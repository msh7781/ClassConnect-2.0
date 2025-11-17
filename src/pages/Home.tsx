import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Center, Heading, Text, Button, Stack, VStack } from '@chakra-ui/react';
import InitializeFirebase from '../components/InitializeFirebase';

export default function Home() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect based on role
  useEffect(() => {
    if (!loading && currentUser) {
      if (currentUser.role === 'teacher') {
        navigate('/teacher-dashboard');
      } else if (currentUser.role === 'student') {
        navigate('/student-dashboard');
      }
    }
  }, [currentUser, loading, navigate]);

  // If user is not logged in, show login/register options
  return (
    <Box p={8}>
      <VStack spacing={10}>
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Assignment Portal
          </Heading>
          <Text fontSize="xl" color="gray.600">
            A platform for teachers to create assignments and students to submit their work
          </Text>
        </Box>

        {!currentUser ? (
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            <Button color="#7d02c4" bg="gray.300" size="lg" onClick={() => navigate('/login')}>
              Log In
            </Button>
            <Button color="#7d02c4" bg="gray.800" size="lg"  onClick={() => navigate('/register')}>
              Register
            </Button>
          </Stack>
        ) : (
          <Center>
            <Text>Redirecting to dashboard...</Text>
          </Center>
        )}

      </VStack>
    </Box>
  );
}