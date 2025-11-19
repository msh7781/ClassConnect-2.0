import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Navbar from './components/Navbar';
import { PrivateRoute } from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Landing from './pages/Landing';

// defines the routes for the app and the private routes for the teacher and student routes
function AppRoutes() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Determine default redirect path based on user role
  const getDefaultPath = () => {
    // if the user is not logged in, redirect to the login page
    if (!currentUser) return '/login';
    return currentUser.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard';
  };

  return (
    // this component is used to display the routes for the app
    <Routes>
  
      {/* Landing page which is accessible to all users */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Student routes which are private and only accessible to students */}
      <Route 
        path="/student-dashboard" 
        element={
          <PrivateRoute requiredRole="student">
            <StudentDashboard />
          </PrivateRoute>
        } 
      />
      
      {/* Teacher routes which are private and only accessible to teachers */}
      <Route 
        path="/teacher-dashboard" 
        element={
          <PrivateRoute requiredRole="teacher">
            <TeacherDashboard />
          </PrivateRoute>
        } 
      />
      
      {/* Redirect based on role if the user is not logged in or does not have the required role */}
      <Route 
        path="*" 
        element={<Navigate to={getDefaultPath()} state={{ from: location }} replace />} 
      />
    </Routes>
  );
}
// wraps everything in the app in the AuthProvider and the navbar
// the AuthProvider is used to provide the authentication context to the app
function App() {
  return (
    <AuthProvider>
      <Box minH="100vh"  display="flex" flexDirection="column">
        <Navbar />
        <Box flex="1" py={6}>
          <Container maxW="container">
            <AppRoutes />
          </Container>
        </Box>
      </Box>
    </AuthProvider>
  );
}

export default App;