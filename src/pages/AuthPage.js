// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { toast } from 'sonner';
// import { Users, Home, Info, Mail } from 'lucide-react';

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const API = `${BACKEND_URL}/api`;

// const AuthPage = ({ setUser }) => {
//   const [phone, setPhone] = useState("");
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     name: '',
//     role: 'worker',
//     phone: ''
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const endpoint = isLogin ? `${API}/auth/login` : `${API}/auth/register`;
//       const payload = isLogin
//         ? { email: formData.email, password: formData.password }
//         : formData;

//       const response = await axios.post(endpoint, payload);
//       localStorage.setItem('token', response.data.token);
//       setUser(response.data.user);
//       toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
//       navigate('/dashboard');
//     } catch (error) {
//       toast.error(error.response?.data?.detail || 'Authentication failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
//       {/* Header Navigation */}
//       <div className="bg-white shadow-sm border-b border-gray-200">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="flex items-center space-x-2 mb-4 md:mb-0">
//               <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
//                 <Users className="w-6 h-6 text-white" />
//               </div>
//               <h1 className="text-2xl font-bold text-gray-900">ShramikBandhu</h1>
//             </div>
            
//             <div className="flex items-center space-x-6">
//               <button 
//                 onClick={() => navigate('/')}
//                 className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
//               >
//                 <Home className="w-4 h-4" />
//                 <span>Home</span>
//               </button>
//               <button 
//                 onClick={() => navigate('/about')}
//                 className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
//               >
//                 <Info className="w-4 h-4" />
//                 <span>About</span>
//               </button>
//               <button 
//                 onClick={() => navigate('/contact')}
//                 className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
//               >
//                 <Mail className="w-4 h-4" />
//                 <span>Contact</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-12 flex items-center justify-center">
//         <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-12">
//           {/* Left side - Branding and Welcome */}
//           <div className="lg:w-1/2 text-center lg:text-left">
//             <div className="flex justify-center lg:justify-start mb-6">
//               <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center p-4 shadow-lg border border-blue-200">
//                 <Users className="w-16 h-16 text-blue-600" />
//               </div>
//             </div>
//             <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">ShramikBandhu</h1>
//             <h2 className="text-2xl lg:text-3xl font-semibold text-blue-700 mb-4">
//               Welcome Back
//             </h2>
//             <p className="text-gray-600 text-lg mb-8">
//               Sign in to your account or create a new one
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
//               <Button 
//                 onClick={() => setIsLogin(true)}
//                 variant={isLogin ? "default" : "outline"}
//                 className={`${isLogin ? 'bg-gradient-600 hover:bg-blue-700' : 'border-blue-600 text-blue-600 hover:bg-blue-50'}`}
//               >
//                 Login
//               </Button>
//               <Button 
//                 onClick={() => setIsLogin(false)}
//                 variant={!isLogin ? "default" : "outline"}
//                 className={`${!isLogin ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-600 text-blue-600 hover:bg-blue-50'}`}
//               >
//                 Register
//               </Button>
//             </div>
//           </div>

//           {/* Right side - Login Form */}
//           <Card className="lg:w-1/2 w-full max-w-md p-8 shadow-2xl border border-gray-200">
//             <div className="mb-6">
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                 {isLogin ? 'Phone Number' : 'Registration Details'}
//               </h3>
//               <p className="text-gray-600">
//                 {isLogin ? 'Enter your phone number' : 'Fill in your information'}
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5" data-testid="auth-form">
//               {!isLogin && (
//                 <>
//                   <div>
//                     <Label htmlFor="name">Full Name</Label>
//                     <Input
//                       id="name"
//                       data-testid="name-input"
//                       type="text"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       required
//                       className="mt-1"
//                       placeholder="Enter your full name"
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="role">I am a</Label>
//                     <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
//                       <SelectTrigger className="mt-1" data-testid="role-select">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="worker" data-testid="role-worker">Worker</SelectItem>
//                         <SelectItem value="employer" data-testid="role-employer">Employer</SelectItem>
//                         <SelectItem value="admin" data-testid="role-admin">Admin</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <Label htmlFor="phone">Phone Number</Label>
//                     <Input
//                       id="phone"
//                       data-testid="phone-input"
//                       type="tel"
//                       value={formData.phone}
//                       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                       placeholder="Enter your phone number"
//                       className="mt-1"
//                     />
//                   </div>
//                 </>
//               )}

//               {isLogin && (
//                 <div>
//                   <Label htmlFor="phone">Phone Number</Label>
//                   <Input
//                     id="phone"
//                     data-testid="phone-input"
//                     type="tel"
//                     value={formData.phone}
//                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                     placeholder="Enter your phone number"
//                     className="mt-1"
//                     required={isLogin}
//                   />
//                 </div>
//               )}

//               <div>
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   data-testid="email-input"
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   required
//                   className="mt-1"
//                   placeholder="Enter your email"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   data-testid="password-input"
//                   type="password"
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   required
//                   className="mt-1"
//                   placeholder="Enter your password"
//                 />
//               </div>

//               <Button 
//                 type="submit" 
//                 className="w-full bg-blue-600 hover:bg-blue-700" 
//                 disabled={loading} 
//                 data-testid="submit-btn"
//               >
//                 {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
//               </Button>
//             </form>

//             <div className="mt-6 text-center">
//               <button
//                 type="button"
//                 onClick={() => setIsLogin(!isLogin)}
//                 className="text-blue-600 hover:text-blue-700 font-medium"
//                 data-testid="toggle-auth-btn"
//               >
//                 {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
//               </button>
//             </div>

//             <div className="mt-4 text-center">
//               <button
//                 type="button"
//                 onClick={() => navigate('/')}
//                 className="text-gray-600 hover:text-gray-700"
//                 data-testid="back-home-btn"
//               >
//                 Back to home
//               </button>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;

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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
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
    // Remove all non-digit characters
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    
    // Indian phone number validation
    if (cleanedPhone.length !== 10) {
      return 'Phone number must be exactly 10 digits';
    }
    
    // Check if it starts with valid Indian mobile prefixes
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

  // Handle phone input change with validation
  const handlePhoneChange = (value) => {
    // Remove all non-digit characters
    const cleanedValue = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (cleanedValue.length <= 10) {
      setFormData({ ...formData, phone: cleanedValue });
      
      // Validate if there's input
      if (cleanedValue) {
        const error = validatePhoneNumber(cleanedValue);
        setPhoneError(error);
      } else {
        setPhoneError('');
      }
    }
  };

  // Handle email input change with validation
  const handleEmailChange = (value) => {
    setFormData({ ...formData, email: value });
    
    if (value) {
      const error = validateEmail(value);
      setEmailError(error);
    } else {
      setEmailError('');
    }
  };

  // Handle password input change with validation
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
    // Validate all fields
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
    
    // FIX: Create clean payload
    let payload;
    if (isLogin) {
      payload = {
        email: formData.email,
        password: formData.password
      };
    } else {
      // Registration: Only send these fields
      payload = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        phone: formData.phone,
        password: formData.password
      };
    }

    console.log('Sending payload:', payload); // Debug: Check what's being sent

    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
    navigate('/dashboard');
  } catch (error) {
    console.error('Error details:', error.response?.data); // Debug: See actual error
    toast.error(error.response?.data?.detail || 'Authentication failed');
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
      {/* Main Content */}
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
            <h2 className="text-2xl lg:text-3xl font-semibold text-white/90 mb-4">
              Welcome Back
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Sign in to your account or create a new one
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={() => setIsLogin(true)}
                variant={isLogin ? "default" : "outline"}
                className={isLogin ? "bg-white text-purple-700 hover:bg-white/90" : "border-white text-white hover:bg-white/10"}
                style={isLogin ? {} : {
                  borderColor: 'white',
                  color: 'white'
                }}
              >
                Login
              </Button>
              <Button 
                onClick={() => setIsLogin(false)}
                variant={!isLogin ? "default" : "outline"}
                className={!isLogin ? "bg-white text-purple-700 hover:bg-white/90" : "border-white text-white hover:bg-white/10"}
                style={!isLogin ? {} : {
                  borderColor: 'white',
                  color: 'white'
                }}
              >
                Register
              </Button>
            </div>
          </div>

          {/* Right side - Login Form */}
          <Card className="lg:w-1/2 w-full max-w-md p-8 shadow-2xl border-0">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isLogin ? 'Phone Number' : 'Registration Details'}
              </h3>
              <p className="text-gray-600">
                {isLogin ? 'Enter your phone number' : 'Fill in your information'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" data-testid="auth-form">
              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      data-testid="name-input"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="mt-1"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">I am a</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger className="mt-1" data-testid="role-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="worker" data-testid="role-worker">Worker</SelectItem>
                        <SelectItem value="employer" data-testid="role-employer">Employer</SelectItem>
                        <SelectItem value="admin" data-testid="role-admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  data-testid="phone-input"
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
                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
                {!phoneError && formData.phone && formData.phone.length === 10 && (
                  <p className="text-green-600 text-sm mt-1">✓ Valid phone number</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  data-testid="email-input"
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
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
                {!emailError && formData.email && (
                  <p className="text-green-600 text-sm mt-1">✓ Valid email</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  data-testid="password-input"
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
                  placeholder="Enter your password"
                  minLength={6}
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
                {!passwordError && formData.password && formData.password.length >= 6 && (
                  <p className="text-green-600 text-sm mt-1">✓ Valid password</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full text-white"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
                disabled={loading || phoneError || emailError || passwordError} 
                data-testid="submit-btn"
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
                data-testid="toggle-auth-btn"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-700"
                data-testid="back-home-btn"
              >
                Back to home
              </button>
            </div>


{/* // Add below the login form */}
<div className="mt-4 text-center">
  <button
    onClick={() => {
      const phoneNumber = "918658758951";
      const message = encodeURIComponent("I need help with registration");
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }}
    className="text-green-600 hover:text-green-700 text-sm flex items-center justify-center gap-2"
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
