import { assignmentService, submissionService } from './firebase';
import { Assignment, Submission } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatbotContextData {
  assignments: Assignment[];
  submissions: Submission[];
  studentId?: string;
  teacherId?: string;
  userRole: 'student' | 'teacher';
}

class ChatbotService {
  private conversationHistory: ChatMessage[] = [];
  private maxHistoryLength = 6; // Keep last 6 messages (3 exchanges)

  /**
   * Retrieve Firebase context for the chatbot
   */
  async getContextData(userId: string, userRole: 'student' | 'teacher'): Promise<ChatbotContextData> {
    const contextData: ChatbotContextData = {
      assignments: [],
      submissions: [],
      userRole,
    };

    try {
      // Get assignments
      contextData.assignments = (await assignmentService.getAllAssignments()) as Assignment[];

      if (userRole === 'student') {
        contextData.studentId = userId;
        contextData.submissions = (await submissionService.getStudentSubmissions(userId)) as Submission[];
      } else if (userRole === 'teacher') {
        contextData.teacherId = userId;
        // Get all submissions for teacher's assignments
        const teacherAssignments = contextData.assignments.filter(a => a.createdBy === userId);
        const allSubmissions: Submission[] = [];
        for (const assignment of teacherAssignments) {
          const subs = (await submissionService.getSubmissionsByAssignment(assignment.id)) as Submission[];
          allSubmissions.push(...subs);
        }
        contextData.submissions = allSubmissions;
      }
    } catch (error) {
      console.error('Error retrieving chatbot context:', error);
    }

    return contextData;
  }

  /**
   * Format context data for the system prompt (concise format)
   */
  private formatContextForPrompt(contextData: ChatbotContextData): string {
    let context = '';

    if (contextData.userRole === 'student' && contextData.studentId) {
      context += `\n[STUDENT CONTEXT]\n`;

      const pendingAssignments = contextData.assignments.filter(
        a => !contextData.submissions.some(s => s.assignmentId === a.id)
      );

      const submittedAssignments = contextData.submissions.map(s => {
        const assignment = contextData.assignments.find(a => a.id === s.assignmentId);
        return `- ${assignment?.title || 'Unknown'} (Grade: ${s.grade !== undefined ? s.grade + '/' + assignment?.totalPoints : 'Pending'})`;
      });

      context += `Pending Assignments: ${pendingAssignments.length}\n`;
      if (submittedAssignments.length > 0) {
        context += `Submitted/Graded: ${submittedAssignments.join(', ')}\n`;
      }
    } else if (contextData.userRole === 'teacher' && contextData.teacherId) {
      context += `\n[TEACHER CONTEXT]\n`;
      const teacherAssignments = contextData.assignments.filter(a => a.createdBy === contextData.teacherId);
      const pendingGrading = contextData.submissions.filter(s => s.status !== 'graded').length;

      context += `Total Assignments Created: ${teacherAssignments.length}\n`;
      context += `Total Submissions: ${contextData.submissions.length}\n`;
      context += `Pending Grading: ${pendingGrading}\n`;

      if (teacherAssignments.length > 0) {
        context += `\nAssignments:\n`;
        teacherAssignments.forEach(assignment => {
          const assignmentSubmissions = contextData.submissions.filter(s => s.assignmentId === assignment.id);
          const gradedCount = assignmentSubmissions.filter(s => s.status === 'graded').length;
          context += `- "${assignment.title}" (ID: ${assignment.id}): ${assignmentSubmissions.length} submissions, ${gradedCount} graded\n`;
        });
      }

      if (contextData.submissions.length > 0) {
        context += `\nSubmissions Summary:\n`;
        const submissionsByAssignment = new Map<string, any[]>();
        contextData.submissions.forEach(sub => {
          if (!submissionsByAssignment.has(sub.assignmentId)) {
            submissionsByAssignment.set(sub.assignmentId, []);
          }
          submissionsByAssignment.get(sub.assignmentId)!.push(sub);
        });

        submissionsByAssignment.forEach((subs, assignmentId) => {
          const assignment = teacherAssignments.find(a => a.id === assignmentId);
          const gradedCount = subs.filter(s => s.status === 'graded').length;
          context += `- "${assignment?.title || 'Unknown'}": ${subs.length} submissions (${gradedCount} graded, ${subs.length - gradedCount} pending)\n`;
        });
      }
    }

    return context;
  }

  /**
   * Send message to ChatGPT with Firebase context
   */
  async sendMessage(
    userMessage: string,
    contextData: ChatbotContextData,
    maxTokens: number = 200
  ): Promise<string> {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY environment variable.');
    }

    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    // Trim history to keep last N messages
    if (this.conversationHistory.length > this.maxHistoryLength) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
    }

    const contextString = this.formatContextForPrompt(contextData);

    const systemPrompt = `You are a helpful assistant for an assignment management system. Be concise, direct, and brief in your responses. 
Keep responses under 100 words unless the user specifically asks for more detail.
Use the provided context about assignments and submissions to answer questions.
If you don't have relevant information, politely say so.
Focus on actionable insights and key information.${contextString}`;

    try {
      const response = await fetch(OPENAI_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...this.conversationHistory,
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
          top_p: 0.9,
        }),
      });

      let responseText = '';
      let data;

      try {
        responseText = await response.text();
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', {
          status: response.status,
          statusText: response.statusText,
          responseText: responseText.substring(0, 200),
          apiKeyConfigured: !!OPENAI_API_KEY,
        });
        throw new Error(`OpenAI API error: ${response.statusText || 'Failed to parse response'}`);
      }

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
      }
      const assistantMessage = data.choices[0]?.message?.content || 'I could not generate a response.';

      // Add assistant message to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });

      return assistantMessage;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      throw error;
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   */
  getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }
}

export const chatbotService = new ChatbotService();
export type { ChatMessage, ChatbotContextData };
