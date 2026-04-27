import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OtpForm({ otp, setOtp, verifyOTP }) {
  return (
    <div>
      <Input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <Button className="w-full mt-3" onClick={verifyOTP}>
        Verify OTP
      </Button>
    </div>
  );
}
