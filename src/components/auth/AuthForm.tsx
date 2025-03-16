
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2Icon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLocation } from 'react-router-dom';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const { signIn, signUp, loading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Check for email confirmation success
  useEffect(() => {
    const checkEmailConfirmation = async () => {
      const searchParams = new URLSearchParams(location.search);
      
      // Email confirmation process
      if (searchParams.has('access_token') || 
          searchParams.has('refresh_token') || 
          searchParams.has('type')) {
        try {
          const { error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          } else {
            setVerificationSuccess(true);
            toast({
              title: "Email verified",
              description: "Your email has been verified. You can now sign in.",
              variant: "default",
            });
          }
        } catch (error: any) {
          console.error('Error handling verification:', error);
          toast({
            title: "Verification error",
            description: error.message || "There was an error verifying your email.",
            variant: "destructive",
          });
        }
      }
    };
    
    checkEmailConfirmation();
  }, [location, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isSignUp) {
        await signUp(email, password);
        // Clear the form after signup
        setEmail('');
        setPassword('');
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      // Error is handled in the auth context
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        {isSignUp ? 'Create an account' : 'Sign in to your account'}
      </h2>
      
      {verificationSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700">
          <CheckCircleIcon className="h-5 w-5" />
          <p>Email verified successfully! You can now sign in.</p>
        </div>
      )}
      
      {isSignUp && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2 text-blue-700">
          <AlertTriangleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            After signing up, you'll need to verify your email address before you can sign in. Please check your inbox for the verification link.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              {isSignUp ? 'Creating account...' : 'Signing in...'}
            </>
          ) : (
            isSignUp ? 'Sign Up' : 'Sign In'
          )}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {isSignUp 
            ? 'Already have an account? Sign in' 
            : "Don't have an account? Sign up"}
        </button>
      </div>
      
      {/* Supabase credentials notice */}
      {!import.meta.env.VITE_SUPABASE_URL && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2 text-yellow-700">
          <AlertTriangleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Missing Supabase credentials</p>
            <p className="mt-1">
              Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment 
              variables for authentication to work.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
