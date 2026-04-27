import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  QrCode, 
  UserCheck, 
  Camera, 
  Award, 
  MapPin, 
  Briefcase, 
  Smartphone, 
  Phone, 
  Calendar,
  User,
  Search,
  CheckCircle,
  Clock,
  MessageCircle  // ← Add this
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminKiosk = ({ user }) => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [scannerInstance, setScannerInstance] = useState(null);
  const [scannedWorker, setScannedWorker] = useState(null);
  const [manualWorkerId, setManualWorkerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickStats, setQuickStats] = useState({
  presentToday: 0,
  totalWorkers: 0
});

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const startScanning = () => {
    setScanning(true);
  };

  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { 
        fps: 10, 
        qrbox: { width: 300, height: 300 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
      },
      false
    );

    setScannerInstance(scanner);

    scanner.render(
      async (decodedText) => {
        scanner.clear();
        setScanning(false);
        await handleWorkerScanned(decodedText);
      },
      (error) => {
        console.log('QR Scanner error:', error);
      }
    );

    return () => {
      if (scannerInstance) {
        scannerInstance.clear().catch(() => {});
      }
    };
  }, [scanning]);


  const fetchQuickStats = async () => {
  try {
    const response = await axios.get(`${API}/stats/dashboard`);
    setQuickStats({
      presentToday: response.data.present_today || 0,
      totalWorkers: response.data.total_workers || 0
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  }
};

useEffect(() => {
  fetchQuickStats();
}, []);



  const handleWorkerScanned = async (workerId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/workers/qr/${workerId}`);
      setScannedWorker(response.data);
      toast.success('Worker found!', {
        description: `Successfully scanned ${response.data.user?.name || 'worker'}`,
      });
    } catch (error) {
      toast.error('Worker not found', {
        description: 'Please check the QR code or worker ID',
      });
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    if (!scannedWorker) return;

    try {
      await axios.post(
  `${API}/attendance/mark`,
  {
    worker_id: scannedWorker.worker.user_id,
    date: new Date().toISOString().split('T')[0],
    job_id: null
  }
);
      toast.success('Attendance marked successfully!', {
        description: `${scannedWorker.user?.name || 'Worker'} is now marked present`,
      });
      
      setScannedWorker(prev => ({
        ...prev,
        worker: { ...prev.worker, is_present: true }
      }));

      // Refresh stats after marking attendance
      fetchQuickStats();
      
      setTimeout(() => {
        setScannedWorker(null);
      }, 3000);
      
    } catch (error) {
  let errorMsg = 'Worker not found';
  if (error.response?.data?.detail) {
    if (typeof error.response.data.detail === 'string') {
      errorMsg = error.response.data.detail;
    } else if (Array.isArray(error.response.data.detail)) {
      errorMsg = error.response.data.detail[0]?.msg || 'Worker not found';
    }
  }
  toast.error(errorMsg);
}
  };

  const handleManualEntry = async (e) => {
    e.preventDefault();
    if (!manualWorkerId.trim()) {
      toast.error('Please enter a Worker ID');
      return;
    }
    await handleWorkerScanned(manualWorkerId);
  };

  const getPhoneTypeBadge = (phoneType) => {
    const config = {
      smartphone: { label: 'Smartphone', variant: 'default', icon: Smartphone, color: 'bg-green-500' },
      feature_phone: { label: 'Feature Phone', variant: 'secondary', icon: Phone, color: 'bg-yellow-500' },
      none: { label: 'No Phone', variant: 'destructive', icon: Phone, color: 'bg-red-500' },
    };
    
    const { label, variant, icon: Icon, color } = config[phoneType] || config.none;
    
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  const formatExperience = (experience) => {
    if (!experience) return 'Not specified';
    if (isNaN(experience)) return experience;
    return `${experience} year${experience !== '1' ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <QrCode className="w-8 h-8 text-indigo-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Admin Kiosk
                    </h1>
                    <p className="text-sm text-gray-600">
                      Scan worker QR codes for attendance tracking
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full">
              <User className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">{user?.name || 'Admin'}</span>
            </div>
          </div>
          
          <div className="sm:hidden mt-4">
            <div className="flex items-center gap-2">
              <QrCode className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Admin Kiosk</h2>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Scanner */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Camera className="w-5 h-5 text-indigo-600" />
                  QR Code Scanner
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Scan worker QR codes or manually enter Worker ID
                </p>
              </CardHeader>
              
              <CardContent className="p-6">
                {!scanning ? (
                  <div className="space-y-6">
                    <Button
                      onClick={startScanning}
                      className="w-full h-14 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300"
                      size="lg"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Start Camera Scanner
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-4 text-sm text-gray-500 font-medium">OR</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <form onSubmit={handleManualEntry} className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            type="text"
                            value={manualWorkerId}
                            onChange={(e) => setManualWorkerId(e.target.value)}
                            placeholder="Enter Worker ID manually"
                            className="pl-10 h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <Button 
                          type="submit" 
                          variant="outline"
                          className="w-full h-12 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Searching...
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4 mr-2" />
                              Search Worker
                            </>
                          )}
                        </Button>
                      </form>
                      
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-800 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Tips:</span>
                        </p>
                        <ul className="mt-2 text-sm text-blue-700 space-y-1 pl-6 list-disc">
                          <li>Ensure good lighting for scanning</li>
                          <li>Position QR code within camera view</li>
                          <li>Worker ID can be found on their profile</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <div id="qr-reader" className="rounded-lg overflow-hidden border-2 border-indigo-100"></div>
                      <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-lg pointer-events-none animate-pulse"></div>
                    </div>
                    
                    <Button
                      onClick={() => {
                        setScanning(false);
                        const scannerDiv = document.getElementById('qr-reader');
                        if (scannerDiv) scannerDiv.innerHTML = '';
                      }}
                      variant="outline"
                      className="w-full h-12 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-700"
                    >
                      Stop Scanning
                    </Button>
                    
                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                      <p className="text-sm text-indigo-700 font-medium">
                        📱 Position QR code within the scanner frame
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-emerald-100 shadow-sm">
                         <p className="text-sm text-gray-600">Today's Attendance</p>
                      <p className="text-2xl font-bold text-emerald-600 mt-1">{quickStats.presentToday}</p>
                        </div>
                            <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                            <p className="text-sm text-gray-600">Total Workers</p>
                            <p className="text-2xl font-bold text-indigo-600 mt-1">{quickStats.totalWorkers}</p>
                          </div>
                            </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Worker Info */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  Worker Information
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Details of scanned worker will appear here
                </p>
              </CardHeader>
              
              <CardContent className="p-6">
                {scannedWorker ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Header with QR and Basic Info */}
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      {scannedWorker.worker.qr_code && (
                        <div className="flex-shrink-0">
                          <div className="p-3 bg-white rounded-xl border-2 border-emerald-100 shadow-md">
                            <img
                              src={scannedWorker.worker.qr_code}
                              alt="Worker QR"
                              className="w-48 h-48 cursor-pointer hover:scale-105 transition-transform duration-200"
                              onClick={() => {
                                const newWindow = window.open();
                                newWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>Worker QR Code</title>
                                      <style>
                                        body {
                                          display: flex;
                                          justify-content: center;
                                          align-items: center;
                                          min-height: 100vh;
                                          margin: 0;
                                          background: #f0f0f0;
                                          font-family: Arial, sans-serif;
                                        }
                                        .qr-container {
                                          text-align: center;
                                          background: white;
                                          padding: 30px;
                                          border-radius: 10px;
                                          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                                        }
                                        img {
                                          width: 400px;
                                          height: 400px;
                                        }
                                        .worker-name {
                                          margin-top: 20px;
                                          font-size: 18px;
                                          font-weight: bold;
                                          color: #333;
                                        }
                                        .worker-id {
                                          margin-top: 10px;
                                          font-size: 12px;
                                          color: #666;
                                        }
                                      </style>
                                    </head>
                                    <body>
                                      <div class="qr-container">
                                        <img src="${scannedWorker.worker.qr_code}" alt="Worker QR Code" />
                                        <div class="worker-name">${scannedWorker.user?.name || 'Worker'}</div>
                                        <div class="worker-id">ID: ${scannedWorker.worker.user_id}</div>
                                      </div>
                                    </body>
                                  </html>
                                `);
                              }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {scannedWorker.user?.name || 'Unknown Worker'}
                            </h3>
                            {getPhoneTypeBadge(scannedWorker.worker.phone_type)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Briefcase className="w-4 h-4" />
                            Worker ID: <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">{scannedWorker.worker.user_id}</code>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <Award className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-amber-800 font-medium">Experience</p>
                            <p className="text-lg font-bold text-amber-900">
                              {formatExperience(scannedWorker.worker.experience)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge 
                            variant={scannedWorker.worker.available ? 'default' : 'secondary'}
                            className={`gap-1 ${scannedWorker.worker.available ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : 'bg-amber-100 text-amber-800 hover:bg-amber-100'}`}
                          >
                            {scannedWorker.worker.available ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Available for Work
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" />
                                Currently Busy
                              </>
                            )}
                          </Badge>
                          
                          {scannedWorker.worker.is_present && (
                            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Present Today
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {scannedWorker.worker.skills.length > 0 ? (
                            scannedWorker.worker.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">No skills listed</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Location
                        </p>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="font-medium text-gray-900">
                            {scannedWorker.worker.location || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <p className="text-2xl font-bold text-indigo-600">
                          {scannedWorker.worker.total_jobs || 0}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Total Jobs</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <p className="text-2xl font-bold text-emerald-600">
                          {scannedWorker.worker.rating || 0}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Rating</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <Calendar className="w-6 h-6 text-amber-600 mx-auto" />
                        <p className="text-xs text-gray-600 mt-1">Registered</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {formatDate(scannedWorker.worker.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <Button
                        onClick={markAttendance}
                        className="w-full h-12 text-lg bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-300"
                        size="lg"
                        disabled={scannedWorker.worker.is_present}
                      >
                        <UserCheck className="w-5 h-5 mr-2" />
                        {scannedWorker.worker.is_present ? 'Already Present' : 'Mark Attendance'}
                      </Button>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={() => {
                            // Navigate to worker profile page
                            window.open(`/worker-profile/${scannedWorker.worker.user_id}`, '_blank');
                            }}
                            variant="outline"
                            className="h-11 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
                            >
                            View Full Profile
                        </Button>
                        <Button
                          onClick={() => setScannedWorker(null)}
                          variant="outline"
                          className="h-11 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                        >
                          Clear & Scan Next
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                        <QrCode className="w-12 h-12 text-indigo-400" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-white">
                        <Search className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">No Worker Scanned</h3>
                      <p className="text-gray-600 mt-2 max-w-sm mx-auto">
                        Scan a worker's QR code or enter Worker ID to view their information
                      </p>
                    </div>
                    <div className="pt-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full">
                        <Camera className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm text-indigo-700 font-medium">
                          Ready to scan
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  How it works
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-700">1</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Scan QR Code:</span> Workers show their QR code for scanning
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-700">2</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Verify Details:</span> Check worker information and experience
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-700">3</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Mark Attendance:</span> Confirm worker's presence for the day
                    </p>
                  </div>
                </div>



{/* Add WhatsApp QR code after the How it works content */}
<div className="mt-6 pt-4 border-t border-gray-200">
  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
    <h4 className="font-semibold text-green-800 flex items-center gap-2">
      <MessageCircle className="w-4 h-4" />
      Need Assistance?
    </h4>
    <p className="text-sm text-green-700 mt-1">
      Scan this QR code to chat with support on WhatsApp
    </p>
    <div className="flex justify-center mt-3">
      <img 
        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/918658758951" 
        alt="WhatsApp QR"
        className="w-32 h-32"
      />
    </div>
  </div>
</div>



              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminKiosk;