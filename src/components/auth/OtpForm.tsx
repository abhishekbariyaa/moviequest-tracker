
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2Icon, CheckIcon, KeyIcon } from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

interface OtpFormProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const OtpForm = ({ email, onVerify, onCancel, loading }: OtpFormProps) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      await onVerify(otp);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <KeyIcon className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-center">Enter verification code</h2>
        <p className="text-sm text-muted-foreground text-center mt-1">
          We sent a 6-digit code to {email.replace(/(.{3})(.*)(@.*)/, '$1•••$3')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            render={({ slots }) => (
              <InputOTPGroup>
                {slots.map((slot, index) => (
                  <InputOTPSlot key={index} {...slot} index={index} />
                ))}
              </InputOTPGroup>
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || otp.length !== 6}
          >
            {loading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckIcon className="mr-2 h-4 w-4" />
                Verify
              </>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={onCancel}
            disabled={loading}
          >
            Back
          </Button>
        </div>
      </form>

      <p className="text-xs text-center text-muted-foreground">
        Didn't receive a code? Check your spam folder or try again in a few minutes.
      </p>
    </div>
  );
};

export default OtpForm;
