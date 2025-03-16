
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2Icon, MailIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import OtpForm from './OtpForm';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const { signIn, signUp, verifyOtp, loading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Missing email",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isSignUp) {
        // For sign up, we'll use the OTP flow
        await signUp(email);
        setShowOtpForm(true);
      } else {
        // For sign in, we'll also use OTP
        await signUp(email);
        setShowOtpForm(true);
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      await verifyOtp(email, otp);
      setShowOtpForm(false);
    } catch (error) {
      console.error('OTP verification error:', error);
    }
  };

  // Show OTP form if in verification mode
  if (showOtpForm) {
    return (
      <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-xl border border-gray-200 shadow-sm">
        <OtpForm 
          email={email}
          onVerify={handleVerifyOtp}
          onCancel={() => setShowOtpForm(false)}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        {isSignUp ? 'Create an account' : 'Sign in to your account'}
      </h2>
      
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
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Sending verification code...
            </>
          ) : (
            <>
              <MailIcon className="mr-2 h-4 w-4" />
              {isSignUp ? 'Sign Up with Email' : 'Sign In with Email'}
            </>
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
    </div>
  );
};

export default AuthForm;
