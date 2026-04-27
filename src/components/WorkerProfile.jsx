import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Briefcase, 
  Star, 
  Calendar, 
  Phone, 
  Mail,
  Award,
  Smartphone,
  CheckCircle,
  Clock,
  Copy,
  Check
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API = `${BACKEND_URL}/api`;

const WorkerProfile = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchWorkerProfile();
  }, [workerId]);

  const fetchWorkerProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`${API}/workers/qr/${workerId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setWorker(response.data);
    } catch (error) {
      console.error('Error fetching worker:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.response?.status === 404) {
        toast.error('Worker not found');
        navigate('/dashboard');
      } else {
        toast.error('Failed to load worker profile');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyWorkerId = () => {
    navigator.clipboard.writeText(workerId);
    setCopied(true);
    toast.success('Worker ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return 'W';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Worker not found</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="border-0 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-4 border-white">
                <AvatarFallback className="text-2xl bg-white text-indigo-600">
                  {getInitials(worker.user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{worker.user?.name || 'Unknown Worker'}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {worker.worker.phone_type === 'smartphone' ? '📱 Smartphone' : 
                     worker.worker.phone_type === 'feature_phone' ? '☎️ Feature Phone' : '📵 No Phone'}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {worker.worker.available ? '✅ Available' : '⏸️ Busy'}
                  </Badge>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                onClick={copyWorkerId}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy ID'}
              </Button>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium">{worker.user?.phone || worker.worker.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="font-medium">{worker.user?.email || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <Award className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm text-amber-700">Experience</p>
                  <p className="font-medium text-amber-900">
                    {worker.worker.experience ? `${worker.worker.experience} years` : 'Not specified'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-700">Location</p>
                  <p className="font-medium text-blue-900">{worker.worker.location || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {worker.worker.skills && worker.worker.skills.length > 0 ? (
                  worker.worker.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No skills listed</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">{worker.worker.total_jobs || 0}</p>
                <p className="text-xs text-gray-600">Total Jobs</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <p className="text-2xl font-bold text-gray-900">{worker.worker.rating || 0}</p>
                </div>
                <p className="text-xs text-gray-600">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {worker.worker.is_present ? '✅' : '❌'}
                </p>
                <p className="text-xs text-gray-600">Today's Status</p>
              </div>
            </div>

            {/* Registration Date */}
            <div className="pt-4 border-t">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Registered On</p>
                  <p className="font-medium">{formatDate(worker.worker.created_at)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkerProfile;