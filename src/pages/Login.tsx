
import React from 'react';
import { FilmIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Login = () => {
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
      
      <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-xl border border-gray-200 shadow-sm text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Welcome to MovieQuest
        </h2>
        <p className="mb-6 text-gray-600">
          Your personal movie tracking application
        </p>
        <Link to="/">
          <Button className="w-full mb-4">
            Enter Application
          </Button>
        </Link>
      </div>
      
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>Track, organize and manage your movie watch list.</p>
      </footer>
    </div>
  );
};

export default Login;
