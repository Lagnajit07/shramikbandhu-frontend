import { MessageCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Users, Home, Info, Mail, Bold } from 'lucide-react';
import ForgotPassword from '@/components/ForgotPassword';

// Use hardcoded URL for production, fallback to env for local
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://shramikbandhu-backend.onrender.com';
const API = `${BACKEND_URL}/api`;

const AuthPage = ({ setUser }) => {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'worker',
    phone: ''
  });
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Phone number validation
  const validatePhoneNumber = (phoneNumber) => {
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    
    if (cleanedPhone.length !== 10) {
      return 'Phone number must be exactly 10 digits';
    }
    
    const validPrefixes = ['6', '7', '8', '9'];
    if (!validPrefixes.includes(cleanedPhone.charAt(0))) {
      return 'Phone number must start with 6, 7, 8, or 9';
    }
    
    return '';
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Password validation
  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const handlePhoneChange = (value) => {
    const cleanedValue = value.replace(/\D/g, '');
    
    if (cleanedValue.length <= 10) {
      setFormData({ ...formData, phone: cleanedValue });
      
      if (cleanedValue) {
        const error = validatePhoneNumber(cleanedValue);
        setPhoneError(error);
      } else {
        setPhoneError('');
      }
    }
  };

  const handleEmailChange = (value) => {
    setFormData({ ...formData, email: value });
    
    if (value) {
      const error = validateEmail(value);
      setEmailError(error);
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (value) => {
    setFormData({ ...formData, password: value });
    
    if (value) {
      const error = validatePassword(value);
      setPasswordError(error);
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const phoneError = validatePhoneNumber(formData.phone);
      const emailError = validateEmail(formData.email);
      const passwordError = validatePassword(formData.password);
      
      if (phoneError) {
        toast.error(phoneError);
        setPhoneError(phoneError);
        setLoading(false);
        return;
      }
      
      if (emailError) {
        toast.error(emailError);
        setEmailError(emailError);
        setLoading(false);
        return;
      }
      
      if (passwordError) {
        toast.error(passwordError);
        setPasswordError(passwordError);
        setLoading(false);
        return;
      }

      if (!isLogin && !formData.name.trim()) {
        toast.error('Please enter your name');
        setLoading(false);
        return;
      }

      const endpoint = isLogin ? `${API}/auth/login` : `${API}/auth/register`;
      
      let payload;
      if (isLogin) {
        payload = {
          email: formData.email,
          password: formData.password
        };
      } else {
        payload = {
          email: formData.email,
          name: formData.name,
          role: formData.role,
          phone: formData.phone,
          password: formData.password
        };
      }

      console.log('📤 Sending to:', endpoint);
      console.log('📦 Payload:', payload);

      const response = await axios({
        method: 'post',
        url: endpoint,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('✅ Response:', response.data);
      
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Error:', error);
      console.error('Response data:', error.response?.data);
      
      let errorMessage = 'Authentication failed';
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail[0]?.msg || 'Validation error';
        }
      } else if (error.message === 'Network Error') {
        errorMessage = 'Cannot connect to server. Please check if backend is running.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-12">
          {/* Left side - Branding and Welcome */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-6">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center p-4 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: '4px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Users className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">ShramikBandhu</h1>
            <h2 className="text-2xl lg:text-3xl font-semibold text-white/90 mb-4">Welcome Back</h2>
            <p className="text-white/80 text-lg mb-8">Sign in to your account or create a new one</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={() => setIsLogin(true)}
                variant={isLogin ? "default" : "outline"}
                className={isLogin ? "bg-white text-purple-700 hover:bg-white/90" : "border-white text-white hover:bg-white/10"}
              >
                Login
              </Button>
              <Button 
                onClick={() => setIsLogin(false)}
                variant={!isLogin ? "default" : "outline"}
                className={!isLogin ? "bg-white text-purple-700 hover:bg-white/90" : "border-white text-white hover:bg-white/10"}
              >
                Register
              </Button>
            </div>
          </div>

          {/* Right side - Form */}
          <Card className="lg:w-1/2 w-full max-w-md p-8 shadow-2xl border-0">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isLogin ? 'Login' : 'Registration Details'}
              </h3>
              <p className="text-gray-600">
                {isLogin ? 'Enter your credentials' : 'Fill in your information'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="mt-1"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">I am a *</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="worker">Worker</SelectItem>
                        <SelectItem value="employer">Employer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onBlur={() => {
                    if (formData.phone) {
                      const error = validatePhoneNumber(formData.phone);
                      setPhoneError(error);
                    }
                  }}
                  placeholder="Enter 10-digit phone number"
                  className={`mt-1 ${phoneError ? 'border-red-500' : ''}`}
                  required
                  maxLength={10}
                />
                {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                {!phoneError && formData.phone && formData.phone.length === 10 && (
                  <p className="text-green-600 text-sm mt-1">✓ Valid phone number</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => {
                    if (formData.email) {
                      const error = validateEmail(formData.email);
                      setEmailError(error);
                    }
                  }}
                  required
                  className={`mt-1 ${emailError ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                {!emailError && formData.email && <p className="text-green-600 text-sm mt-1">✓ Valid email</p>}
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => {
                    if (formData.password) {
                      const error = validatePassword(formData.password);
                      setPasswordError(error);
                    }
                  }}
                  required
                  className={`mt-1 ${passwordError ? 'border-red-500' : ''}`}
                  placeholder="Enter your password (min 6 characters)"
                  minLength={6}
                />
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                {!passwordError && formData.password && formData.password.length >= 6 && (
                  <p className="text-green-600 text-sm mt-1">✓ Valid password</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full text-white"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                disabled={loading || phoneError || emailError || passwordError}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
              </Button>
            </form>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm font-bold text-purple-600 hover:text-purple-700"
              >
                Forgot Password?
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-700"
              >
                Back to home
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  const phoneNumber = "918658758951";
                  const message = encodeURIComponent("I need help with registration");
                  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
                }}
                className="text-green-600 hover:text-green-700 text-sm flex items-center justify-center gap-2 w-full"
              >
                <MessageCircle className="w-4 h-4" />
                Need Help? Chat with Support on WhatsApp
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
