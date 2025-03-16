
import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { FilmIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Login = () => {
  const [searchParams] = useSearchParams();
  const isRedirected = Boolean(
    searchParams.get('access_token') || 
    searchParams.get('refresh_token') || 
    searchParams.get('type')
  );

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
          {isRedirected 
            ? "Verifying your email..." 
            : "Sign in to manage your personal movie collection"}
        </p>
      </div>
      
      <AuthForm />
      
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>Track, organize and manage your movie watch list.</p>
        {!import.meta.env.VITE_SUPABASE_URL && (
          <p className="mt-2 text-amber-600">
            ⚠️ Supabase credentials missing, authentication won't work
          </p>
        )}
      </footer>
    </div>
  );
};

export default Login;
