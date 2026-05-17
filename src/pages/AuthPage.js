import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Users, MessageCircle } from 'lucide-react';
import ForgotPassword from '@/components/ForgotPassword';

// Hardcoded backend URL for production
const API = 'https://shramikbandhu-backend.onrender.com/api';

const AuthPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Separate states for login and registration
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'worker',
    phone: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    phone: '',
    name: ''
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) return 'Phone number must be 10 digits';
    if (!['6', '7', '8', '9'].includes(cleaned[0])) return 'Phone must start with 6,7,8,9';
    return '';
  };

  const validateName = (name) => {
    if (!name) return 'Name is required';
    return '';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(loginData.email);
    const passwordError = validatePassword(loginData.password);
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      toast.error('Please fix the errors');
      return;
    }
    
    setLoading(true);
    
    try {
      const payload = {
        email: loginData.email,
        password: loginData.password
      };
      
      console.log('Login payload:', payload);
      
      const response = await axios.post(`${API}/auth/login`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error.response?.data);
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(registerData.email);
    const passwordError = validatePassword(registerData.password);
    const phoneError = validatePhone(registerData.phone);
    const nameError = validateName(registerData.name);
    
    if (emailError || passwordError || phoneError || nameError) {
      setErrors({
        email: emailError,
        password: passwordError,
        phone: phoneError,
        name: nameError
      });
      toast.error('Please fix the errors');
      return;
    }
    
    setLoading(true);
    
    try {
      const payload = {
        email: registerData.email,
        password: registerData.password,
        name: registerData.name,
        role: registerData.role,
        phone: registerData.phone.replace(/\D/g, '')
      };
      
      console.log('Register payload:', payload);
      
      const response = await axios.post(`${API}/auth/register`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Register error:', error.response?.data);
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto gap-12">
          {/* Left side - Branding */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">ShramikBandhu</h1>
            <h2 className="text-2xl lg:text-3xl font-semibold text-white/90 mb-4">
              {isLogin ? 'Welcome Back' : 'Join Us'}
            </h2>
            <p className="text-white/80 text-lg mb-8">
              {isLogin 
                ? 'Sign in to your account to continue' 
                : 'Create a new account to get started'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={() => setIsLogin(true)}
                className={isLogin ? "bg-white text-purple-700" : "bg-white/20 text-white"}
              >
                Login
              </Button>
              <Button 
                onClick={() => setIsLogin(false)}
                className={!isLogin ? "bg-white text-purple-700" : "bg-white/20 text-white"}
              >
                Register
              </Button>
            </div>
          </div>

          {/* Right side - Form */}
          <Card className="lg:w-1/2 w-full max-w-md p-8">
            {isLogin ? (
              // Login Form
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Login</h3>
                  <p className="text-gray-600">Enter your credentials to access your account</p>
                </div>

                <div>
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => {
                      setLoginData({ ...loginData, email: e.target.value });
                      setErrors({ ...errors, email: '' });
                    }}
                    placeholder="Enter your email"
                    className="mt-1"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => {
                      setLoginData({ ...loginData, password: e.target.value });
                      setErrors({ ...errors, password: '' });
                    }}
                    placeholder="Enter your password"
                    className="mt-1"
                    required
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            ) : (
              // Register Form
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Register</h3>
                  <p className="text-gray-600">Create your account to get started</p>
                </div>

                <div>
                  <Label>Full Name *</Label>
                  <Input
                    type="text"
                    value={registerData.name}
                    onChange={(e) => {
                      setRegisterData({ ...registerData, name: e.target.value });
                      setErrors({ ...errors, name: '' });
                    }}
                    placeholder="Enter your full name"
                    className="mt-1"
                    required
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label>Role *</Label>
                  <Select value={registerData.role} onValueChange={(value) => setRegisterData({ ...registerData, role: value })}>
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

                <div>
                  <Label>Phone Number *</Label>
                  <Input
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) => {
                      setRegisterData({ ...registerData, phone: e.target.value });
                      setErrors({ ...errors, phone: '' });
                    }}
                    placeholder="10-digit mobile number"
                    className="mt-1"
                    required
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => {
                      setRegisterData({ ...registerData, email: e.target.value });
                      setErrors({ ...errors, email: '' });
                    }}
                    placeholder="Enter your email"
                    className="mt-1"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    value={registerData.password}
                    onChange={(e) => {
                      setRegisterData({ ...registerData, password: e.target.value });
                      setErrors({ ...errors, password: '' });
                    }}
                    placeholder="Minimum 6 characters"
                    className="mt-1"
                    required
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </form>
            )}

            {/* Common links */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
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
                Need Help? Chat on WhatsApp
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
