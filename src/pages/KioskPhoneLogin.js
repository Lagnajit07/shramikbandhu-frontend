import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function KioskPhoneLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const sendOTP = async () => {
    try {
      await axios.post(`${API}/kiosk/send-otp`, { phone });
      toast.success("OTP Sent");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOTP = async () => {
    try {
      await axios.post(`${API}/kiosk/verify-otp`, { phone, otp });
      toast.success("Verified");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-semibold mb-3">Kiosk Phone Login</h2>

      <Input
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {!otpSent ? (
        <Button onClick={sendOTP} className="w-full mt-4">
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

          <Button onClick={verifyOTP} className="w-full mt-4">
            Verify OTP
          </Button>
        </>
      )}
    </div>
  );
}
