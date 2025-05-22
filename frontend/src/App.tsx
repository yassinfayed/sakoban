import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/services/authContext';
import LoginForm from '@/pages/Login';
import RegisterForm from '@/pages/Register';
import GameLayout from '@/components/GameLayout';
import AdminPage from '@/pages/AdminPage';
import { Toaster } from '@/components/ui/toaster';

const AuthRoutes: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect based on user role after authentication state changes
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/game');
      }
    }
  }, [user, navigate]); // Rerun effect when user or navigate changes

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <LoginForm 
            switchToRegister={() => navigate('/register')}
            // onSuccess prop removed, redirection handled by useEffect
          />
        } 
      />
      <Route 
        path="/register" 
        element={
          <RegisterForm 
            switchToLogin={() => navigate('/login')}
            // onSuccess prop removed, redirection handled by useEffect
          />
        } 
      />
      <Route path="/game/*" element={<GameLayout />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/" element={<Navigate to="/game" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AuthRoutes />
        <Toaster />
      </Router>
    </AuthProvider>
  );
};

export default App;
