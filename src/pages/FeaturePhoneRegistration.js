import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function FeaturePhoneRegistration() {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (phone.length !== 10) return toast.error("Invalid phone number");
    try {
      setLoading(true);
      await axios.post(`${API}/auth/send-otp`, { phone });
      toast.success("OTP Sent");
      setOtpSent(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOTP = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/auth/verify-otp`, { phone, otp });
      toast.success("OTP Verified");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Phone Number Login</h2>

      <Input
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {!otpSent ? (
        <Button onClick={sendOTP} className="w-full mt-4" disabled={loading}>
          Get OTP
        </Button>
      ) : (
        <>
          <Input
            placeholder="Enter OTP"
            className="mt-4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button onClick={verifyOTP} className="w-full mt-4" disabled={loading}>
            Verify OTP
          </Button>
        </>
      )}
    </div>
  );
}
