import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Spinner,
  useToast,
  IconButton,
  Collapse,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { CloseIcon, ChatIcon } from '@chakra-ui/icons';
import { chatbotService, ChatMessage } from '../services/chatbot';
import { ChatbotContextData } from '../services/chatbot';

interface ChatbotProps {
  userId: string;
  userRole: 'student' | 'teacher';
}

export default function Chatbot({ userId, userRole }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [contextData, setContextData] = useState<ChatbotContextData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  // Load context on mount
  useEffect(() => {
    const loadContext = async () => {
      try {
        const data = await chatbotService.getContextData(userId, userRole);
        setContextData(data);
      } catch (error) {
        console.error('Error loading chatbot context:', error);
      }
    };
    loadContext();
  }, [userId, userRole]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !contextData) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message to display
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await chatbotService.sendMessage(userMessage, contextData, 200);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error: any) {
      console.error('Chatbot error:', error);
      
      let errorMessage = 'Sorry, I encountered an error. ';
      
      if (error.message.includes('API key')) {
        errorMessage += 'Please configure the OpenAI API key in the environment variables.';
      } else if (error.message.includes('OpenAI API error')) {
        errorMessage += 'There was an issue with the AI service. Please try again.';
      } else {
        errorMessage += 'Please try again.';
      }

      toast({
        title: 'Chatbot Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleClearChat = () => {
    setMessages([]);
    chatbotService.clearHistory();
  };

  return (
    <Box position="fixed" bottom="20px" right="20px" zIndex={1000}>
      {/* Chatbot Container */}
      <Collapse in={isOpen}>
        <Box
          bg="white"
          borderRadius="16px"
          boxShadow="0 8px 32px rgba(125, 2, 196, 0.2)"
          border="1px solid"
          borderColor="gray.200"
          width="400px"
          maxHeight="600px"
          display="flex"
          flexDirection="column"
          mb={3}
        >
          {/* Header */}
          <Box
            bg="linear-gradient(135deg, #7d02c4 0%, #6b019f 100%)"
            color="white"
            p={4}
            borderRadius="16px 16px 0 0"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <HStack spacing={2}>
              <ChatIcon boxSize={5} />
              <Text fontWeight="bold" fontSize="sm">
                Assignment Assistant
              </Text>
            </HStack>
            <HStack spacing={2}>
              {messages.length > 0 && (
                <IconButton
                  aria-label="Clear chat"
                  icon={<CloseIcon boxSize={3} />}
                  size="xs"
                  variant="ghost"
                  _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
                  onClick={handleClearChat}
                />
              )}
              <IconButton
                aria-label="Close chatbot"
                icon={<CloseIcon boxSize={4} />}
                size="xs"
                variant="ghost"
                _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
                onClick={toggleChatbot}
              />
            </HStack>
          </Box>

          {/* Messages Area */}
          <VStack
            flex={1}
            p={4}
            spacing={3}
            overflowY="auto"
            align="stretch"
            bg="gray.50"
            minHeight="300px"
          >
            {messages.length === 0 ? (
              <VStack
                spacing={3}
                align="center"
                justify="center"
                h="100%"
                p={4}
              >
                <ChatIcon boxSize={8} color="gray.300" />
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Hi! I'm your assignment assistant. Ask me about your {userRole === 'student' ? 'assignments, submissions, or grades' : 'assignments, submissions, or student progress'}.
                </Text>
              </VStack>
            ) : (
              <>
                {messages.map((message, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent={message.role === 'user' ? 'flex-end' : 'flex-start'}
                  >
                    <Box
                      maxWidth="80%"
                      bg={message.role === 'user' ? '#7d02c4' : 'white'}
                      color={message.role === 'user' ? 'white' : 'gray.800'}
                      p={3}
                      borderRadius={message.role === 'user' ? '12px 12px 0px 12px' : '12px 12px 12px 0px'}
                      boxShadow={message.role === 'user' ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'}
                      fontSize="sm"
                      lineHeight="1.4"
                      wordBreak="break-word"
                      whiteSpace="pre-wrap"
                    >
                      {message.content}
                    </Box>
                  </Box>
                ))}
                {loading && (
                  <Box display="flex" justifyContent="flex-start">
                    <HStack spacing={2} p={3} bg="white" borderRadius="12px 12px 12px 0px" boxShadow="0 2px 4px rgba(0,0,0,0.1)">
                      <Spinner size="sm" color="#7d02c4" />
                      <Text fontSize="sm" color="gray.500">Typing...</Text>
                    </HStack>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </VStack>

          <Divider m={0} />

          {/* Input Area */}
          <Box p={3} bg="white" borderRadius="0 0 16px 16px">
            <VStack spacing={2}>
              {!contextData && (
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  Loading context...
                </Text>
              )}
              <HStack spacing={2} width="100%">
                <Input
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading || !contextData}
                  size="sm"
                  borderRadius="8px"
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.200"
                  _focus={{
                    bg: 'white',
                    borderColor: '#7d02c4',
                    boxShadow: '0 0 0 3px rgba(125, 2, 196, 0.1)',
                  }}
                  _disabled={{
                    opacity: 0.6,
                    cursor: 'not-allowed',
                  }}
                />
                <Button
                  bg="#7d02c4"
                  color="white"
                  _hover={{ bg: '#6b019f', transform: 'scale(1.05)' }}
                  _active={{ bg: '#5a0186' }}
                  size="sm"
                  px={4}
                  borderRadius="8px"
                  onClick={handleSendMessage}
                  isDisabled={!input.trim() || loading || !contextData}
                  fontSize="sm"
                  fontWeight="600"
                  transition="all 0.2s"
                >
                  Send
                </Button>
              </HStack>
              <Text fontSize="xs" color="gray.400" textAlign="center">
                Uses minimum tokens • Data from Firebase
              </Text>
            </VStack>
          </Box>
        </Box>
      </Collapse>

      {/* Toggle Button */}
      <Button
        leftIcon={<ChatIcon />}
        bg={isOpen ? 'gray.600' : '#7d02c4'}
        color="white"
        _hover={{
          bg: isOpen ? 'gray.700' : '#6b019f',
          transform: 'scale(1.1)',
        }}
        _active={{ bg: isOpen ? 'gray.800' : '#5a0186' }}
        borderRadius="50px"
        height="56px"
        width="56px"
        padding={0}
        boxShadow="0 4px 12px rgba(125, 2, 196, 0.3)"
        onClick={toggleChatbot}
        transition="all 0.3s ease"
        aria-label="Toggle chatbot"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {!isOpen && <ChatIcon boxSize={6} />}
      </Button>
    </Box>
  );
}
