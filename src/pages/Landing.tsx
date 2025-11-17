import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  CloseButton,
  Avatar,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  StarIcon,
  InfoIcon,
  ChatIcon,
} from "@chakra-ui/icons";
import { useState } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  const [message, setMessage] = useState("");

  const features = [
    {
      title: "Assignment Management",
      description:
        "Teachers can create, manage, and grade assignments with ease",
      icon: CheckCircleIcon,
    },
    {
      title: "Multimedia Submissions",
      description:
        "Students can submit text responses with up to 5 images per assignment",
      icon: StarIcon,
    },
    {
      title: "Real-time Collaboration",
      description:
        "Instant updates and notifications for seamless teacher-student interaction",
      icon: InfoIcon,
    },
  ];

  const stats = [
    { number: "100%", label: "Secure & Private" },
    { number: "24/7", label: "Available Access" },
    { number: "∞", label: "Assignments" },
  ];

  const sampleChats = [
    {
      id: 1,
      sender: "bot",
      message: "Hello! How can I help you today?",
      time: "10:00 AM",
    },
    {
      id: 2,
      sender: "user",
      message: "I need help with assignments",
      time: "10:01 AM",
    },
    {
      id: 3,
      sender: "bot",
      message: "Sure! Are you a teacher or a student?",
      time: "10:02 AM",
    },
    { id: 4, sender: "user", message: "I am a teacher", time: "10:03 AM" },
    {
      id: 5,
      sender: "bot",
      message:
        "Great! You can create assignments from your dashboard. Would you like to know more about grading features?",
      time: "10:04 AM",
    },
  ];

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)">
      {/* Navigation Bar */}

      {/* Hero Section */}
      <Container pt={20} pb={16}>
        <VStack spacing={8} textAlign="center">
          <VStack spacing={4}>
            <Heading
              size="2xl"
              color="gray.800"
              fontWeight="800"
              lineHeight="shorter"
              maxW="4xl"
            >
              Modern Assignment Management
              <Text as="span" color="#7d02c4">
                {" "}
                Made Simple
              </Text>
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="2xl" lineHeight="tall">
              Streamline your educational workflow with our intuitive assignment
              portal. Perfect for teachers and students seeking efficient,
              collaborative learning.
            </Text>
          </VStack>

          <HStack spacing={4} pt={4}>
            <Button
              size="lg"
              bg="#7d02c4"
              color="white"
              _hover={{
                bg: "#6b019f",
                transform: "translateY(-2px)",
                boxShadow: "xl",
              }}
              borderRadius="12px"
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="600"
              transition="all 0.3s"
              onClick={() => navigate("/register")}
            >
              Register Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              borderColor="#7d02c4"
              color="#7d02c4"
              _hover={{
                bg: "#7d02c4",
                color: "white",
                transform: "translateY(-2px)",
              }}
              borderRadius="12px"
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="600"
              transition="all 0.3s"
              onClick={() => navigate("/login")}
            >
              Login Now
            </Button>
          </HStack>
        </VStack>
      </Container>

      {/* Stats Section */}
      <Box bg="white" py={16}>
        <Container maxW="7xl">
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={8}
            textAlign="center"
          >
            {stats.map((stat, index) => (
              <VStack key={index} spacing={2}>
                <Text fontSize="4xl" fontWeight="800" color="#7d02c4">
                  {stat.number}
                </Text>
                <Text fontSize="lg" color="gray.600" fontWeight="500">
                  {stat.label}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="7xl" py={20}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color="gray.800" fontWeight="700">
              Everything You Need
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Powerful features designed to enhance the teaching and learning
              experience
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {features.map((feature, index) => (
              <Card
                key={index}
                bg="white"
                borderRadius="16px"
                boxShadow="0 4px 20px rgba(125, 2, 196, 0.1)"
                border="1px solid"
                borderColor="gray.100"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(125, 2, 196, 0.15)",
                  borderColor: "#7d02c4",
                }}
                transition="all 0.3s"
                p={6}
              >
                <CardBody textAlign="center">
                  <VStack spacing={4}>
                    <Box
                      bg="#7d02c4"
                      color="white"
                      borderRadius="full"
                      p={3}
                      display="inline-flex"
                    >
                      <Icon as={feature.icon} boxSize={6} />
                    </Box>
                    <Heading size="md" color="gray.800">
                      {feature.title}
                    </Heading>
                    <Text color="gray.600" lineHeight="tall">
                      {feature.description}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* How It Works Section */}
      <Box bg="white" py={20}>
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading size="xl" color="gray.800" fontWeight="700">
                How It Works
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Get started in just a few simple steps
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <VStack spacing={4} textAlign="center">
                <Box
                  bg="#7d02c4"
                  color="white"
                  borderRadius="full"
                  w={16}
                  h={16}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="2xl"
                  fontWeight="800"
                >
                  1
                </Box>
                <Heading size="md" color="gray.800">
                  Sign Up
                </Heading>
                <Text color="gray.600">
                  Create your account as a teacher or student in seconds
                </Text>
              </VStack>

              <VStack spacing={4} textAlign="center">
                <Box
                  bg="#7d02c4"
                  color="white"
                  borderRadius="full"
                  w={16}
                  h={16}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="2xl"
                  fontWeight="800"
                >
                  2
                </Box>
                <Heading size="md" color="gray.800">
                  Create & Submit
                </Heading>
                <Text color="gray.600">
                  Teachers create assignments, students submit with text and
                  images
                </Text>
              </VStack>

              <VStack spacing={4} textAlign="center">
                <Box
                  bg="#7d02c4"
                  color="white"
                  borderRadius="full"
                  w={16}
                  h={16}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="2xl"
                  fontWeight="800"
                >
                  3
                </Box>
                <Heading size="md" color="gray.800">
                  Grade & Feedback
                </Heading>
                <Text color="gray.600">
                  Review submissions and provide detailed feedback instantly
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxW="7xl" py={20}>
        <Box
          bg="linear-gradient(135deg, #7d02c4 0%, #9333ea 100%)"
          borderRadius="24px"
          p={12}
          textAlign="center"
          color="white"
        >
          <VStack spacing={6}>
            <Heading size="xl" fontWeight="700">
              Ready to Transform Your Classroom?
            </Heading>
            <Text fontSize="lg" opacity={0.9} maxW="2xl">
              Join thousands of educators already using Assignment Portal to
              streamline their teaching workflow
            </Text>
            <Button
              size="lg"
              bg="white"
              color="#7d02c4"
              _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
              borderRadius="12px"
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="600"
              transition="all 0.3s"
              onClick={() => navigate("/register")}
            >
              Get Started Today
            </Button>
          </VStack>
        </Box>
      </Container>

      {/* Footer */}
      <Box bg="gray.800" color="white" py={8}>
        <Container maxW="7xl">
          <Flex
            justify="space-between"
            align="center"
            flexDirection={{ base: "column", md: "row" }}
            gap={4}
          >
            <Text>&copy; 2024 Assignment Portal. All rights reserved.</Text>
            <HStack spacing={6}>
              <Text cursor="pointer" _hover={{ color: "#7d02c4" }}>
                Privacy Policy
              </Text>
              <Text cursor="pointer" _hover={{ color: "#7d02c4" }}>
                Terms of Service
              </Text>
              <Text cursor="pointer" _hover={{ color: "#7d02c4" }}>
                Support
              </Text>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Chatbot Widget */}
      <Box position="fixed" bottom="20px" right="20px" zIndex={1000}>
        {/* Chat Window */}
        <Collapse in={isOpen} animateOpacity>
          <Box
            bg="white"
            borderRadius="16px"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.15)"
            w={{ base: "90vw", sm: "380px" }}
            h="500px"
            mb={4}
            overflow="hidden"
            display="flex"
            flexDirection="column"
          >
            {/* Chat Header */}
            <Flex
              bg="#7d02c4"
              color="white"
              p={4}
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack spacing={3}>
                <Avatar size="sm" name="Support Bot" bg="#9333ea" />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="600" fontSize="md">
                    Support Assistant
                  </Text>
                  <Text fontSize="xs" opacity={0.9}>
                    Online
                  </Text>
                </VStack>
              </HStack>
              <CloseButton onClick={onToggle} />
            </Flex>

            {/* Chat Messages */}
            <VStack
              flex={1}
              overflowY="auto"
              p={4}
              spacing={3}
              align="stretch"
              bg="gray.50"
            >
              {sampleChats.map((chat) => (
                <Flex
                  key={chat.id}
                  justify={chat.sender === "user" ? "flex-end" : "flex-start"}
                >
                  <Box
                    maxW="75%"
                    bg={chat.sender === "user" ? "#7d02c4" : "white"}
                    color={chat.sender === "user" ? "white" : "gray.800"}
                    px={4}
                    py={2}
                    borderRadius="12px"
                    boxShadow="sm"
                  >
                    <Text fontSize="sm">{chat.message}</Text>
                    <Text fontSize="xs" opacity={0.7} mt={1} textAlign="right">
                      {chat.time}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </VStack>

            {/* Chat Input */}
            <Box p={4} bg="white" borderTop="1px solid" borderColor="gray.200">
              <InputGroup size="md">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  borderRadius="full"
                  pr="4rem"
                  focusBorderColor="#7d02c4"
                />
                <InputRightElement width="4rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    bg="#7d02c4"
                    color="white"
                    borderRadius="full"
                    _hover={{ bg: "#6b019f" }}
                    onClick={() => setMessage("")}
                  >
                    Send
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>
          </Box>
        </Collapse>

        {/* Chat Toggle Button */}
        <IconButton
          icon={<ChatIcon />}
          aria-label="Toggle chat"
          size="lg"
          bg="#7d02c4"
          color="white"
          borderRadius="full"
          boxShadow="0 4px 16px rgba(125, 2, 196, 0.4)"
          _hover={{
            bg: "#6b019f",
            transform: "scale(1.1)",
            boxShadow: "0 6px 20px rgba(125, 2, 196, 0.5)",
          }}
          transition="all 0.3s"
          onClick={onToggle}
          w="60px"
          h="60px"
          fontSize="24px"
        />
      </Box>
    </Box>
  );
}
