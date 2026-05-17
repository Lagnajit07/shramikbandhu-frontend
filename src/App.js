import React, { useState, useEffect } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

// Pages
import LandingPage from '@/pages/LandingPage';
import ContactPage from '@/pages/ContactPage';
import AuthPage from '@/pages/AuthPage';
import WorkerDashboard from '@/pages/WorkerDashboard';
import EmployerDashboard from '@/pages/EmployerDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminKiosk from '@/pages/AdminKiosk';
import { Users, Home, Info, Mail, MessageCircle } from 'lucide-react';

// Components
import QRScanner from '@/components/QRScanner';
import WorkerProfile from './components/WorkerProfile';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://shramikbandhu-backend.onrender.com';
const API = `${BACKEND_URL}/api`;

// Axios interceptor
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${API}/auth/me`);
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea]/10 to-[#764BA2]/10">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Loading ShramikBandhu...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage user={user} />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Authentication Route */}
          <Route
            path="/auth"
            element={user ? <Navigate to="/dashboard" /> : <AuthPage setUser={setUser} />}
          />

          {/* QR Scanner Route */}
          <Route 
            path="/scan" 
            element={
              user ? <QRScanner user={user} /> : <Navigate to="/auth" />
            } 
          />

          {/* Worker Profile Route - Public/Protected */}
          <Route
            path="/worker-profile/:workerId"
            element={
              user ? <WorkerProfile /> : <Navigate to="/auth" />
            }
          />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              !user ? (
                <Navigate to="/auth" />
              ) : user.role === 'worker' ? (
                <WorkerDashboard user={user} onLogout={handleLogout} />
              ) : user.role === 'employer' ? (
                <EmployerDashboard user={user} onLogout={handleLogout} />
              ) : user.role === 'admin' ? (
                <AdminDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Admin Kiosk Route */}
          <Route
            path="/admin/kiosk"
            element={
              !user || user.role !== 'admin' ? <Navigate to="/" /> : <AdminKiosk user={user} />
            }
          />

          {/* Catch-all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>

      <Toaster 
        position="top-right" 
        richColors 
        expand={true}
        theme="light"
        toastOptions={{
          classNames: {
            toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
            description: 'group-[.toast]:text-muted-foreground',
            actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
            cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          },
        }}
      />


{/* // Add after the Toaster component */}
<div className="fixed bottom-6 left-6 z-50">
  <button
    onClick={() => {
      const phoneNumber = "918658758951";
      const message = encodeURIComponent("Hi, I need help");
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }}
    className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
  >
    <MessageCircle className="w-6 h-6" />
  </button>
</div>





    </div>
  );
}

export default App;
