
import React from 'react';
import { FilmIcon } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/auth/AuthForm';

const Login = () => {
  const { user, loading } = useAuth();

  // If user is already logged in, redirect to home page
  if (user && !loading) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center gap-2 mb-4">
          <div className="bg-gray-900 text-white p-3 rounded-xl">
            <FilmIcon size={28} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">MovieQuest</h1>
        </div>
        <p className="text-gray-600">
          Track, organize and manage your personal movie collection
        </p>
      </div>
      
      <AuthForm />
      
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>Track, organize and manage your movie watch list.</p>
      </footer>
    </div>
  );
};

export default Login;
