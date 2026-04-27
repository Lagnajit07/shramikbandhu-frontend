import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Calendar,
  LogOut,
  CheckCircle,
  XCircle,
  Star,
  User,
  TrendingUp,
  Clock,
  DollarSign,
  CheckSquare,
  AlertCircle,
  Smartphone,
  Phone,
  QrCode,
  BarChart3,
  FileText,
  Award,
  History,
  Search,
  Fingerprint,
  Key,
  Loader2,
  ExternalLink,
  Copy,
  Info,
  Shield,
  PlusCircle,
  Users,
  Filter,
  RefreshCw,
  ThumbsUp,
  MessageSquare,
  X,
  ChevronRight,
  Eye,
  Download,
  MessageCircle  // ← ADD THIS LINE
  
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API = `${BACKEND_URL}/api`;

// SAFE HELPERS
const safeText = (value) =>
  typeof value === 'string' ? value : typeof value === 'number' ? value.toString() : '';
const safeNumber = (value) => (typeof value === 'number' ? value : 0);
const safeArray = (value) => (Array.isArray(value) ? value : []);
const safeRating = (value) => (typeof value === 'number' ? value.toFixed(1) : '0.0');
const safeObject = (value) => (typeof value === 'object' && value !== null ? value : {});

// FORMAT DATE
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

// Function to get worker profile data
const fetchWorkerProfile = async (workerId, isPublic = false) => {
  console.log('🔍 Fetching worker profile for ID:', workerId);
  
  try {
    let response;
    if (isPublic) {
      // Public endpoint for worker profile
      const publicAxios = axios.create();
      delete publicAxios.defaults.headers.common['Authorization'];
      
      response = await publicAxios.get(`${API}/workers/profile?worker_id=${workerId}`, {
        timeout: 10000,
      });
    } else {
      // Private endpoint (requires auth)
      response = await axios.get(`${API}/workers/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        timeout: 10000,
      });
    }
    
    console.log('✅ Worker profile response:', response.data);
    
    // ⚠️ FIX: If user is null, create it from worker data
    let result = response.data;
    if (result && result.worker && !result.user) {
      console.log('⚠️ Creating user data from worker info');
      result.user = {
        id: result.worker.user_id,
        name: "Worker " + (result.worker.user_id || workerId).substring(0, 8),
        email: "worker@example.com",
        role: "worker",
        phone: result.worker.phone || "",
        created_at: result.worker.created_at || new Date().toISOString()
      };
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Worker profile error:', error);
    
    // Fallback to mock data
    console.log('🎭 Creating mock data for testing');
    return {
      worker: {
        id: workerId,
        user_id: workerId,
        phone_type: "smartphone",
        phone: "+919999999999",
        skills: ["carpentry", "painting"],
        location: "Mumbai",
        rating: 4.5,
        total_jobs: 10,
        available: true,
        is_present: false,
        qr_code: null,
        created_at: new Date().toISOString()
      },
      user: {
        id: workerId,
        name: "Demo Worker",
        email: "demo@example.com",
        role: "worker",
        phone: "+919999999999",
        created_at: new Date().toISOString()
      }
    };
  }
};

// Function to get worker dashboard data
const fetchWorkerDashboard = async (isPublic = false, workerId = null) => {
  console.log('📊 Fetching worker dashboard');
  
  try {
    let response;
    if (isPublic) {
      // For public access, we need to use profile endpoint
      const profileData = await fetchWorkerProfile(workerId, true);
      // Create minimal dashboard data from profile
      return {
        worker: profileData.worker,
        user: profileData.user,
        stats: {
          total_jobs_completed: profileData.worker.total_jobs || 0,
          total_earnings: 0,
          avg_rating: profileData.worker.rating || 0,
          attendance_today: false,
          available: profileData.worker.available || true,
          skills: profileData.worker.skills || [],
          location: profileData.worker.location || "",
          phone_type: profileData.worker.phone_type || "smartphone",
          upcoming_jobs: 0,
          pending_applications: 0
        },
        recent_jobs: [],
        completed_jobs: [],
        attendance_history: [],
        ratings_received: [],
        earnings_by_month: [],
        pending_applications: []
      };
    } else {
      // Private dashboard endpoint
      response = await axios.get(`${API}/workers/dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        timeout: 10000,
      });
      return response.data;
    }
    
  } catch (error) {
    console.error('❌ Worker dashboard error:', error);
    throw error;
  }
};

const WorkerDashboard = ({ user, onLogout }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [skillsInput, setSkillsInput] = useState('');
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  
  // State for available jobs
  const [availableJobs, setAvailableJobs] = useState([]);
  const [filteredAvailableJobs, setFilteredAvailableJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  
  // State for worker ID entry
  const [workerIdInput, setWorkerIdInput] = useState('');
  const [isPublicAccess, setIsPublicAccess] = useState(false);
  const [showWorkerIdForm, setShowWorkerIdForm] = useState(!user);
  const [workerIdError, setWorkerIdError] = useState('');
  const [copied, setCopied] = useState(false);

  // NEW STATE FOR COMPLETED JOBS AND RATINGS
  const [completedJobs, setCompletedJobs] = useState([]);
  const [jobsToRate, setJobsToRate] = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedJobForRating, setSelectedJobForRating] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [viewingWorkerId, setViewingWorkerId] = useState(null);
  const navigate = useNavigate();


  // NEW: Fetch completed jobs for worker
  const fetchCompletedJobs = async () => {
    try {
      if (isPublicAccess) return; // Skip for public access
      
      console.log('📋 Fetching completed jobs...');
      const response = await axios.get(`${API}/workers/completed-jobs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      console.log('✅ Completed jobs response:', response.data);
      const jobs = safeArray(response.data);
      setCompletedJobs(jobs);
      
      // Filter jobs that haven't been rated yet
      const unratedJobs = jobs.filter(job => !job.has_rated);
      setJobsToRate(unratedJobs);
      
    } catch (error) {
      console.error('❌ Failed to fetch completed jobs:', error);
      setCompletedJobs([]);
      setJobsToRate([]);
    }
  };

  // NEW: Submit rating for employer
  const submitRating = async () => {
    if (!selectedJobForRating) return;
    
    try {
      setLoading(true);
      console.log('⭐ Submitting rating for job:', selectedJobForRating.id);
      
      await axios.post(`${API}/ratings/submit`, {
        job_id: selectedJobForRating.id,
        to_user_id: selectedJobForRating.employer_id,
        rating: ratingValue,
        review: ratingComment
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      toast.success('Rating submitted successfully!');
      
      // Refresh completed jobs
      await fetchCompletedJobs();
      
      // Close modal and reset
      setShowRatingModal(false);
      setRatingValue(5);
      setRatingComment('');
      setSelectedJobForRating(null);
      
    } catch (error) {
      console.error('❌ Failed to submit rating:', error);
      toast.error(error.response?.data?.detail || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  // NEW: Rating Modal Component
  const RatingModal = () => (
    <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Rate Your Experience
          </DialogTitle>
          <DialogDescription>
            Share your feedback about this job completion
          </DialogDescription>
        </DialogHeader>
        
        {selectedJobForRating && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium">{selectedJobForRating.title}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <User className="w-3 h-3" />
                <span>Employer: {selectedJobForRating.employer_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>Date: {formatDate(selectedJobForRating.date)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rating">Your Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingValue(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= ratingValue
                          ? 'fill-yellow-400 text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({ratingValue}/5)
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comment">Your Review (Optional)</Label>
              <Textarea
                id="comment"
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Share your experience with this employer..."
                rows={3}
              />
            </div>
          </div>
        )}
        
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowRatingModal(false)}
            disabled={loading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={submitRating}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <ThumbsUp className="w-4 h-4 mr-2" />
                Submit Rating
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Fetch available jobs
  const fetchAvailableJobs = async () => {
    try {
      console.log('📋 Fetching available jobs...');
      
      const response = await axios.get(`${API}/jobs/available`, {
        headers: isPublicAccess ? {} : { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      console.log('✅ Available jobs response:', response.data);
      
      const jobs = safeArray(response.data);
      setAvailableJobs(jobs);
      setFilteredAvailableJobs(jobs);
      
    } catch (error) {
      console.error('❌ Failed to fetch available jobs:', error);
      toast.error('Could not load available jobs');
      setAvailableJobs([]);
      setFilteredAvailableJobs([]);
    }
  };

  // Apply to job
  const applyToJob = async (jobId) => {
    if (isPublicAccess) {
      toast.error('Please login to apply for jobs');
      return;
    }
    
    try {
      setLoading(true);
      console.log('📝 Applying to job:', jobId);
      
      const response = await axios.post(
        `${API}/applications/apply/${jobId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      console.log('✅ Application submitted:', response.data);
      toast.success('Application submitted successfully! Employer will review your application.');
      
      // Remove job from available jobs list
      setAvailableJobs(prev => prev.filter(job => job.id !== jobId));
      setFilteredAvailableJobs(prev => prev.filter(job => job.id !== jobId));
      
      // Refresh applications list
      const appsRes = await axios.get(`${API}/applications/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setApplications(safeArray(appsRes.data));
      
    } catch (error) {
      console.error('❌ Application failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to apply for job');
    } finally {
      setLoading(false);
    }
  };

  // Filter available jobs
  const filterAvailableJobs = () => {
    let filtered = [...availableJobs];
    
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSkill !== 'all') {
      filtered = filtered.filter(job =>
        job.skill_required?.toLowerCase().includes(selectedSkill.toLowerCase())
      );
    }
    
    setFilteredAvailableJobs(filtered);
  };

  // Mark attendance
const markAttendance = async () => {
  try {
    setLoading(true);
    await axios.post(`${API}/attendance/worker/mark-self`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    toast.success('Attendance marked successfully!');
    setAttendanceMarked(true);
    await fetchDashboardData();
  } catch (error) {
    toast.error(error.response?.data?.detail || 'Failed to mark attendance');
  } finally {
    setLoading(false);
  }
};

  // Update profile
  // Update profile - CORRECTED VERSION
const updateProfile = async (e) => {
  e.preventDefault();
  if (isPublicAccess) {
    toast.error('Please login to update profile');
    return;
  }
  
  try {
    setLoading(true);
    
    // Prepare update data according to WorkerUpdate model in backend
    const updateData = {};
    
    // Handle skills - convert string to array
    const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    if (skillsArray.length > 0) {
      updateData.skills = skillsArray;
    } else {
      updateData.skills = []; // Send empty array if no skills
    }
    
    // Handle location - can be empty string
    const currentLocation = dashboardData?.worker?.location || '';
    updateData.location = currentLocation.trim();
    
    // Handle experience - can be null or empty
    const currentExperience = dashboardData?.worker?.experience || '';
    if (currentExperience.trim()) {
      updateData.experience = currentExperience.trim();
    } else {
      updateData.experience = null; // Send null for empty experience
    }
    
    // Handle availability - default to true
    updateData.available = dashboardData?.worker?.available ?? true;
    
    // Handle phone type - default to smartphone
    updateData.phone_type = dashboardData?.worker?.phone_type || 'smartphone';
    
    // Handle phone - can be empty string
    updateData.phone = dashboardData?.worker?.phone || '';
    
    console.log('📤 Sending profile update data:', updateData);
    
    // Use the correct endpoint from your backend
    const response = await axios.put(
      `${API}/workers/profile/update`,
      updateData,
      { 
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    console.log('✅ Profile update response:', response.data);
    toast.success('Profile updated successfully!');
    
    // Refresh dashboard data
    await fetchDashboardData();
    
  } catch (error) {
    console.error('❌ Profile update failed:', error);
    console.error('Error response data:', error.response?.data);
    
    // Provide more specific error messages
    if (error.response?.data?.detail) {
      if (typeof error.response.data.detail === 'string') {
        toast.error(error.response.data.detail);
      } else if (Array.isArray(error.response.data.detail)) {
        error.response.data.detail.forEach(err => {
          if (err.msg) toast.error(err.msg);
          if (err.loc) console.error(`Field error at ${err.loc}: ${err.msg}`);
        });
      } else {
        toast.error('Failed to update profile. Please check your input.');
      }
    } else {
      toast.error('Failed to update profile. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  // Fetch dashboard data
  const fetchDashboardData = async (workerId = null, isPublicMode = false) => {
    console.log('🚀 fetchDashboardData called with:', { workerId, user, isPublicMode });
    
    try {
      setLoading(true);
      setWorkerIdError('');

      let dashboardDataResult;
      let applicationsData = [];
      let statsData = {};

      if (user && !workerId && !isPublicMode) {
        // Logged-in user accessing their own dashboard
        console.log('🔐 Fetching private dashboard for logged-in user');
        
        // Fetch dashboard data
        const dashboardRes = await axios.get(`${API}/workers/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        dashboardDataResult = dashboardRes.data;
        setIsPublicAccess(false);
        
        // Fetch applications
        try {
          const appsRes = await axios.get(`${API}/applications/my`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          applicationsData = safeArray(appsRes.data);
        } catch (appsError) {
          console.error('Applications fetch error:', appsError);
        }
        
        // Fetch completed jobs
        await fetchCompletedJobs();
        
        // Fetch available jobs
        await fetchAvailableJobs();
        
        // Check today's attendance
        try {
          const attendanceRes = await axios.get(`${API}/attendance/check-today`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setAttendanceMarked(attendanceRes.data?.attendance_marked || false);
        } catch (attendanceError) {
          console.error('Attendance check error:', attendanceError);
        }
        
      } else {
        // Public access by worker ID
        console.log('🌐 Fetching public dashboard for worker ID:', workerId);
        
        if (!workerId) {
          throw new Error('Please enter a Worker ID');
        }
        
        // Fetch worker profile for public view
        const profileData = await fetchWorkerProfile(workerId, true);
        
        // Create dashboard-like structure from profile
        dashboardDataResult = {
          worker: profileData.worker,
          user: profileData.user,
          stats: {
            total_jobs_completed: profileData.worker?.total_jobs || 0,
            total_earnings: 0,
            avg_rating: profileData.worker?.rating || 0,
            attendance_today: false,
            available: profileData.worker?.available || true,
            skills: profileData.worker?.skills || [],
            location: profileData.worker?.location || "",
            phone_type: profileData.worker?.phone_type || "smartphone",
            upcoming_jobs: 0,
            pending_applications: 0,
            experience: profileData.worker?.experience || "",
            joined_date: profileData.worker?.created_at || ""
          },
          recent_jobs: [],
          pending_applications: [],
          completed_jobs: [],
          attendance_history: [],
          ratings_received: [],
          earnings_by_month: []
        };
        
        setIsPublicAccess(true);
        setAttendanceMarked(false);
      }

      setDashboardData(dashboardDataResult);
      setApplications(applicationsData);
      setStats(dashboardDataResult.stats || {});

      if (dashboardDataResult?.worker?.skills) {
        setSkillsInput(safeArray(dashboardDataResult.worker.skills).join(', '));
      }

      console.log('✅ Data loaded successfully');
      setShowWorkerIdForm(false);

    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setWorkerIdError(error.response?.data?.detail || error.message || 'Failed to load dashboard data');
      toast.error(error.response?.data?.detail || error.message || 'Failed to load dashboard data');
      
      // If it's a public access error, show the form again
      if (workerId) {
        setShowWorkerIdForm(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch if user is logged in
  useEffect(() => {
    if (user && !dashboardData && !showWorkerIdForm) {
      fetchDashboardData();
    }
  }, [user, showWorkerIdForm]);

  // Handle worker ID submission
  const handleWorkerIdSubmit = async (e) => {
  e.preventDefault();
  
  if (!workerIdInput.trim()) {
    setWorkerIdError('Please enter a Worker ID');
    return;
  }
  
  setViewingWorkerId(workerIdInput.trim());  // Store the entered ID
  await fetchDashboardData(workerIdInput.trim(), true);
 };
 

  // Copy worker ID to clipboard
const copyWorkerId = () => {
  // Always use the logged-in user's ID first
  const idToCopy = user?.id || worker.id || worker.user_id || viewingWorkerId;
  
  if (idToCopy) {
    navigator.clipboard.writeText(idToCopy);
    setCopied(true);
    toast.success('Worker ID copied!');
    setTimeout(() => setCopied(false), 2000);
  } else {
    toast.error('No Worker ID found');
  }
};

  // Refresh data
  const handleRefresh = () => {
    if (user) {
      fetchDashboardData();
    } else if (dashboardData?.worker?.id) {
      fetchDashboardData(dashboardData.worker.id, true);
    } else {
      setShowWorkerIdForm(true);
    }
    toast.success('Data refreshed');
  };

  // Reset to show form again
  const handleShowForm = () => {
    setShowWorkerIdForm(true);
    setDashboardData(null);
    setWorkerIdInput('');
    setWorkerIdError('');
    setIsPublicAccess(false);
  };

  // NEW: Check for unrated jobs and show reminder
  useEffect(() => {
    if (jobsToRate.length > 0 && !showRatingModal) {
      toast.info(`You have ${jobsToRate.length} completed job(s) to rate!`, {
        duration: 5000,
        action: {
          label: 'Rate Now',
          onClick: () => {
            setSelectedJobForRating(jobsToRate[0]);
            setShowRatingModal(true);
          }
        }
      });
    }
  }, [jobsToRate, showRatingModal]);

  // Worker ID Entry Form
  if (showWorkerIdForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Fingerprint className="w-16 h-16 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Worker Dashboard</h1>
              <p className="text-gray-600">Enter your Worker ID to access your dashboard</p>
            </div>

            <form onSubmit={handleWorkerIdSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="workerId" className="text-sm font-medium">
                  Worker ID
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="workerId"
                    placeholder="Enter your Worker ID"
                    value={workerIdInput}
                    onChange={(e) => {
                      setWorkerIdInput(e.target.value);
                      setWorkerIdError('');
                    }}
                    className="pl-10 py-6 text-lg"
                    disabled={loading}
                  />
                </div>
                {workerIdError && (
                  <p className="text-sm text-red-600">{workerIdError}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full py-6" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading Dashboard...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Access Dashboard
                  </>
                )}
              </Button>

              <div className="text-center space-y-2">
                {user && (
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setShowWorkerIdForm(false);
                      fetchDashboardData();
                    }}
                    className="text-sm"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Back to my secure dashboard
                  </Button>
                )}
              </div>
            </form>

            <Alert className="mt-8 bg-blue-50 border-blue-200">
              <Info className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-700">
                This is a public dashboard. For full features like job applications and attendance marking, please login.
              </AlertDescription>
            </Alert>
          </Card>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If no data and not loading
  if (!dashboardData && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">No Dashboard Data</h2>
          <p className="text-gray-600 mt-2">Unable to load dashboard data</p>
          <Button onClick={handleShowForm} className="mt-4">
            Enter Worker ID
          </Button>
        </div>
      </div>
    );
  }

  const worker = dashboardData?.worker || {};
  const userData = dashboardData?.user || user || {};
  const dashboardStats = dashboardData?.stats || {};
  const recentJobs = safeArray(dashboardData?.recent_jobs);
  const pendingApplications = safeArray(dashboardData?.pending_applications);
  const ratingsReceived = safeArray(dashboardData?.ratings_received);
  const earningsByMonth = safeArray(dashboardData?.earnings_by_month);
  const attendanceHistory = safeArray(dashboardData?.attendance_history);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Left side - Title and Worker Info */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          {isPublicAccess ? (
            <Fingerprint className="w-8 h-8 text-green-600" />
          ) : (
            <User className="w-8 h-8 text-blue-600" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
              {isPublicAccess ? (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Public View</Badge>
              ) : (
                <Badge variant="default" className="text-xs">Secure Access</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {isPublicAccess ? (
                <span>Viewing: <span className="font-semibold">{safeText(userData.name || worker.id || 'Worker')}</span></span>
              ) : (
                <span>Welcome back, <span className="font-semibold">{safeText(userData.name)}</span></span>
              )}
            </p>
          </div>
        </div>
        
        {/* Worker ID Display and Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {/* Worker ID Box */}
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-md">
            <span className="text-xs font-medium text-gray-600 mr-2">Worker ID:</span>
            <code className="text-sm font-mono text-gray-800">
                {user?.id || worker.id || worker.user_id || viewingWorkerId || 'Not available'}

            </code>
            <Button variant="ghost" size="sm" onClick={copyWorkerId} className="ml-2 h-6 w-6 p-0">
              {copied ? <CheckCircle className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-500" />}
            </Button>
          </div>
          
          {/* View Full Profile Button */}
          <Button
            onClick={() => {
              let idToUse;
              if (viewingWorkerId) {
                idToUse = viewingWorkerId;
              } else if (worker.id) {
                idToUse = worker.id;
              } else if (worker.user_id) {
                idToUse = worker.user_id;
              } else if (user?.id) {
                idToUse = user.id;
              }
              if (idToUse) {
                navigate(`/worker-profile/${idToUse}`);
              } else {
                toast.error('No worker ID found');
              }
            }}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            View Full Profile
          </Button>

          {/* Status Badges */}
          <div className="flex items-center gap-2">
            <Badge variant={worker.available ? "default" : "secondary"} className="text-xs">
              {worker.available ? "Available" : "Busy"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Star className="w-3 h-3 mr-1" />
              {safeRating(worker.rating)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Briefcase className="w-3 h-3 mr-1" />
              {safeNumber(worker.total_jobs)} jobs
            </Badge>
            {!isPublicAccess && availableJobs.length > 0 && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                <PlusCircle className="w-3 h-3 mr-1" />
                {availableJobs.length} jobs available
              </Badge>
            )}
            {!isPublicAccess && jobsToRate.length > 0 && (
              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 animate-pulse">
                <Star className="w-3 h-3 mr-1" />
                {jobsToRate.length} to rate
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Action Buttons */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={handleShowForm} className="text-xs">
          <Key className="w-3 h-3 mr-1" />
          {isPublicAccess ? "Enter Different ID" : "View by Worker ID"}
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
          <History className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        
        {/* WhatsApp Button - Add this if you want */}
        <Button onClick={openWhatsApp} className="bg-green-600 hover:bg-green-700">
          <MessageCircle className="w-4 h-4 mr-2" />
          Need Help?
        </Button>
        
        {user && (
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        )}
        
        {isPublicAccess && (
          <Button variant="default" size="sm" onClick={() => window.location.href = '/login'}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Login
          </Button>
        )}
      </div>
    </div>
  </div>
</header>

      {/* Public Access Alert */}
      {isPublicAccess && (
        <Alert className="mx-auto max-w-7xl mt-4 mb-4 bg-yellow-50 border-yellow-200">
          <Info className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-sm text-yellow-800">
            You are viewing the dashboard in public mode. Some features are limited. 
            <Button 
              variant="link" 
              className="h-auto p-0 ml-2 text-yellow-700 underline" 
              onClick={() => window.location.href = '/login'}
            >
              Login for full access
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Attendance Card */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CheckSquare className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Today's Attendance</h3>
              </div>
              <Badge variant={attendanceMarked ? "default" : "secondary"}>
                {attendanceMarked ? "Marked" : "Pending"}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {attendanceMarked 
                ? "You've marked attendance for today" 
                : isPublicAccess 
                  ? "Login to mark attendance" 
                  : "Mark your attendance for today"}
            </p>
            <Button 
              onClick={markAttendance} 
              disabled={attendanceMarked || loading || isPublicAccess}
              className="w-full"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isPublicAccess ? "Login Required" : attendanceMarked ? "Attendance Marked" : "Mark Attendance"}
            </Button>
          </Card>

          {/* Earnings Card */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center mb-4">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Total Earnings</h3>
            </div>
            <p className="text-3xl font-bold text-green-700 mb-2">
              ₹{safeNumber(dashboardStats.total_earnings || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-sm text-gray-600">
              From {safeNumber(dashboardStats.total_jobs_completed || 0)} completed jobs
            </p>
            <Progress 
              value={(safeNumber(dashboardStats.total_jobs_completed) / 50) * 100} 
              className="mt-4 h-2"
            />
          </Card>

          {/* Upcoming Jobs */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Upcoming Jobs</h3>
            </div>
            <p className="text-3xl font-bold text-purple-700 mb-2">
              {safeNumber(dashboardStats.upcoming_jobs || 0)}
            </p>
            <p className="text-sm text-gray-600">
              {isPublicAccess 
                ? "Login to view applications" 
                : `${safeNumber(dashboardStats.pending_applications || 0)} pending applications`}
            </p>
          </Card>

          {/* NEW: Rating Prompt Card */}
          {!isPublicAccess && jobsToRate.length > 0 && (
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 animate-pulse">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Rate Your Jobs</h3>
              </div>
              <p className="text-3xl font-bold text-yellow-700 mb-2">
                {jobsToRate.length}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Completed job(s) waiting for your rating
              </p>
              <Button 
                onClick={() => {
                  setSelectedJobForRating(jobsToRate[0]);
                  setShowRatingModal(true);
                }}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                <Star className="w-4 h-4 mr-2" />
                Rate Now
              </Button>
            </Card>
          )}
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-8 w-full">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="available-jobs" 
              className="flex items-center gap-2"
              disabled={isPublicAccess}
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Available Jobs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="my-jobs" 
              className="flex items-center gap-2"
              disabled={isPublicAccess}
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">My Jobs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="completed-jobs" 
              className="flex items-center gap-2"
              disabled={isPublicAccess}
            >
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Completed</span>
            </TabsTrigger>
            <TabsTrigger 
              value="applications" 
              className="flex items-center gap-2"
              disabled={isPublicAccess}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Applications</span>
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Earnings</span>
            </TabsTrigger>
            <TabsTrigger 
              value="attendance" 
              className="flex items-center gap-2"
              disabled={isPublicAccess}
            >
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{safeNumber(dashboardStats.total_jobs_completed)}</div>
                <p className="text-sm text-gray-600">Jobs Completed</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{safeRating(dashboardStats.avg_rating)}</div>
                <p className="text-sm text-gray-600">Average Rating</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{safeNumber(dashboardStats.upcoming_jobs)}</div>
                <p className="text-sm text-gray-600">Upcoming Jobs</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{isPublicAccess ? 'N/A' : safeNumber(dashboardStats.pending_applications)}</div>
                <p className="text-sm text-gray-600">Pending Apps</p>
              </Card>
            </div>

            {/* Available Jobs Quick View */}
            {!isPublicAccess && availableJobs.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Available Jobs Quick View</h3>
                  <Badge variant="outline">{availableJobs.length} Jobs Available</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {availableJobs.slice(0, 3).map((job, index) => (
                    <Card key={index} className="p-4 border hover:shadow-md transition-shadow">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold">{safeText(job.title)}</h4>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            ₹{safeNumber(job.wage)}/day
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          {safeText(job.location)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {safeText(job.skill_required)}
                        </div>
                        <Button 
                          onClick={() => {
                            setActiveTab('available-jobs');
                          }}
                          variant="outline" 
                          size="sm"
                          className="w-full mt-2"
                        >
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <Button 
                    onClick={() => setActiveTab('available-jobs')}
                    variant="link"
                  >
                    View all {availableJobs.length} available jobs →
                  </Button>
                </div>
              </Card>
            )}

            {/* Recent Jobs & Applications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Jobs */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Recent Jobs</h3>
                  <Badge variant="outline">{recentJobs.length} Jobs</Badge>
                </div>
                <div className="space-y-3">
                  {recentJobs.slice(0, 3).map((job, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{safeText(job.title)}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {safeText(job.location)}
                          <span className="mx-1">•</span>
                          <IndianRupee className="w-3 h-3" />
                          {safeNumber(job.wage)}
                        </div>
                      </div>
                      <Badge variant={
                        job.status === 'completed' ? 'default' : 
                        job.status === 'in_progress' ? 'secondary' : 'outline'
                      }>
                        {safeText(job.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Ratings */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Recent Ratings</h3>
                  <Badge variant="outline">{ratingsReceived.length} Ratings</Badge>
                </div>
                <div className="space-y-3">
                  {ratingsReceived.slice(0, 3).map((rating, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{safeText(rating.job_title)}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {safeRating(rating.rating)}
                          {rating.comment && (
                            <>
                              <span className="mx-1">•</span>
                              <span className="truncate max-w-[150px]">{rating.comment}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Device Information */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Device Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    {worker.phone_type === 'smartphone' ? (
                      <Smartphone className="w-6 h-6 text-blue-600" />
                    ) : worker.phone_type === 'feature' ? (
                      <Phone className="w-6 h-6 text-green-600" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <p className="font-medium capitalize">{safeText(worker.phone_type) || 'Unknown'}</p>
                  <p className="text-xs text-gray-600">Phone Type</p>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <p className="font-medium">{safeText(worker.location) || 'Not set'}</p>
                  <p className="text-xs text-gray-600">Location</p>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="font-medium">{safeArray(worker.skills).length}</p>
                  <p className="text-xs text-gray-600">Skills</p>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <Calendar className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="font-medium">{formatDate(worker.created_at)}</p>
                  <p className="text-xs text-gray-600">Joined Date</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* AVAILABLE JOBS TAB */}
          {!isPublicAccess && (
            <TabsContent value="available-jobs" className="space-y-6">
              <Card className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-lg">Available Jobs Matching Your Skills</h3>
                    <p className="text-sm text-gray-600">
                      Based on your skills: <span className="font-medium">{safeArray(worker.skills).join(', ') || 'No skills set'}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchAvailableJobs}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab('profile')}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Update Skills
                    </Button>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search jobs by title, location, description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by skill" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Skills</SelectItem>
                      {safeArray(worker.skills).map((skill, index) => (
                        <SelectItem key={index} value={skill.toLowerCase()}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Jobs Grid */}
                {filteredAvailableJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {availableJobs.length === 0 
                        ? "No available jobs found matching your skills. Update your profile with more skills!"
                        : "No jobs match your current search filters"}
                    </p>
                    {availableJobs.length === 0 && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setActiveTab('profile')}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Update Skills
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredAvailableJobs.map((job, index) => (
                        <Card key={index} className="p-4 hover:shadow-md transition-shadow border">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <h4 className="font-bold text-lg">{safeText(job.title)}</h4>
                              <Badge variant="outline" className="bg-blue-50">
                                ₹{safeNumber(job.wage)}/day
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="font-medium">{safeText(job.skill_required)}</span>
                              </div>
                              
                              <div className="flex items-center text-sm">
                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{safeText(job.location)}</span>
                              </div>
                              
                              <div className="flex items-center text-sm">
                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{formatDate(job.date)}</span>
                              </div>
                              
                              <div className="flex items-center text-sm">
                                <Users className="w-4 h-4 mr-2 text-gray-500" />
                                <span>Needs: {safeNumber(job.num_workers_needed)} workers</span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {safeText(job.description) || 'No description provided'}
                            </p>
                            
                            <div className="flex items-center justify-between pt-3 border-t">
                              <div className="text-xs text-gray-500">
                                Posted: {formatDate(job.created_at)}
                              </div>
                              <Button 
                                onClick={() => applyToJob(job.id)}
                                disabled={loading}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Apply Now
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="mt-6 text-center text-sm text-gray-500">
                      Showing {filteredAvailableJobs.length} of {availableJobs.length} available jobs
                    </div>
                  </>
                )}
              </Card>
            </TabsContent>
          )}

          {/* MY JOBS TAB */}
          {!isPublicAccess && (
            <TabsContent value="my-jobs" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Active Jobs</h3>
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <History className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
                
                {recentJobs.filter(job => job.status !== 'completed').length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No active jobs found</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab('available-jobs')}
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Browse Available Jobs
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentJobs.filter(job => job.status !== 'completed').map((job, index) => (
                      <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-lg">{safeText(job.title)}</h4>
                              <Badge variant={
                                job.status === 'completed' ? 'default' : 
                                job.status === 'in_progress' ? 'secondary' : 'outline'
                              }>
                                {safeText(job.status)}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div className="flex items-center">
                                <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{safeText(job.skill_required)}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{safeText(job.location)}</span>
                              </div>
                              <div className="flex items-center">
                                <IndianRupee className="w-4 h-4 mr-2 text-gray-500" />
                                <span>₹{safeNumber(job.wage)}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{formatDate(job.date)}</span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-2">
                              {safeText(job.description) || 'No description provided'}
                            </p>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Employer</p>
                              <p className="font-medium">{safeText(job.employer_name)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Posted</p>
                              <p className="font-medium">{formatDate(job.created_at)}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
          )}

          {/* NEW: COMPLETED JOBS TAB */}
          {!isPublicAccess && (
            <TabsContent value="completed-jobs" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-lg">Completed Jobs</h3>
                    <p className="text-sm text-gray-600">
                      Jobs you have successfully completed. Please rate your experience with employers.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchCompletedJobs}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                    {jobsToRate.length > 0 && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => {
                          setSelectedJobForRating(jobsToRate[0]);
                          setShowRatingModal(true);
                        }}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Rate Jobs ({jobsToRate.length})
                      </Button>
                    )}
                  </div>
                </div>

                {completedJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No completed jobs yet</p>
                    <Button 
                      variant="outline" 
                      className="mt-4" 
                      onClick={() => setActiveTab('available-jobs')}
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Browse Available Jobs
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Unrated Jobs Section */}
                    {jobsToRate.length > 0 && (
                      <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <h4 className="font-medium text-lg">Jobs Pending Your Rating</h4>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                            {jobsToRate.length} to rate
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {jobsToRate.slice(0, 2).map((job, index) => (
                            <Card key={index} className="p-4 border-yellow-200 bg-yellow-50">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h5 className="font-bold">{job.title}</h5>
                                  <p className="text-sm text-gray-600">Employer: {job.employer_name}</p>
                                  <p className="text-sm text-gray-600">Completed: {formatDate(job.date)}</p>
                                  <p className="text-sm font-medium text-green-600">₹{job.wage} earned</p>
                                </div>
                                <Button 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedJobForRating(job);
                                    setShowRatingModal(true);
                                  }}
                                  className="bg-yellow-600 hover:bg-yellow-700"
                                >
                                  <Star className="w-4 h-4 mr-2" />
                                  Rate Now
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                        {jobsToRate.length > 2 && (
                          <p className="text-sm text-gray-600 mt-2 text-center">
                            +{jobsToRate.length - 2} more jobs need rating
                          </p>
                        )}
                      </div>
                    )}

                    {/* All Completed Jobs Table */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Job Title</TableHead>
                            <TableHead>Employer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Wage Earned</TableHead>
                            <TableHead>Rating Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {completedJobs.map((job, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{job.title}</TableCell>
                              <TableCell>{job.employer_name}</TableCell>
                              <TableCell>{formatDate(job.date)}</TableCell>
                              <TableCell className="text-green-600 font-bold">
                                ₹{job.wage}
                              </TableCell>
                              <TableCell>
                                {job.has_rated ? (
                                  <Badge variant="default" className="bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Rated
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                    <Star className="w-3 h-3 mr-1" />
                                    Rate Pending
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant={job.has_rated ? "outline" : "default"}
                                    onClick={() => {
                                      if (!job.has_rated) {
                                        setSelectedJobForRating(job);
                                        setShowRatingModal(true);
                                      }
                                    }}
                                    disabled={job.has_rated}
                                    className={job.has_rated ? "" : "bg-yellow-600 hover:bg-yellow-700"}
                                  >
                                    {job.has_rated ? (
                                      <>
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Rated
                                      </>
                                    ) : (
                                      <>
                                        <Star className="w-3 h-3 mr-1" />
                                        Rate
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      // View job details
                                      toast.info("Viewing job details");
                                    }}
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Details
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Summary */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{completedJobs.length}</p>
                          <p className="text-sm text-gray-600">Total Completed</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            ₹{completedJobs.reduce((sum, job) => sum + (job.wage || 0), 0).toLocaleString('en-IN')}
                          </p>
                          <p className="text-sm text-gray-600">Total Earnings</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-yellow-600">{jobsToRate.length}</p>
                          <p className="text-sm text-gray-600">Pending Ratings</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </TabsContent>
          )}

          {/* APPLICATIONS TAB */}
<TabsContent value="applications" className="space-y-6">
  <Card className="p-6">
    <h3 className="font-semibold text-lg mb-6">My Applications</h3>
    
    {applications.length === 0 ? (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">No job applications yet</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => setActiveTab('available-jobs')}
        >
          <Briefcase className="w-4 h-4 mr-2" />
          Browse Available Jobs
        </Button>
      </div>
    ) : (
      <div className="space-y-4">
        {applications.map((data, index) => {
          if (!data?.application || !data?.job) return null;
          const { application, job } = data;

          return (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h4 className="text-lg font-bold">{safeText(job.title)}</h4>
                  <p className="text-sm text-gray-600">{safeText(job.employer_name)}</p>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <Badge
                    variant={
                      application.status === 'accepted'
                        ? 'default'
                        : application.status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {application.status === 'accepted' ? '✓ Accepted' : 
                     application.status === 'rejected' ? '✗ Rejected' : 
                     '⏳ Pending'}
                  </Badge>
                  <p className="text-xs text-gray-500">
                    Applied: {formatDate(application.applied_at)}
                  </p>
                </div>
              </div>

              {/* SHOW REJECTION REASON */}
              {application.status === 'rejected' && application.rejection_reason && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-800">Reason for rejection:</p>
                      <p className="text-sm text-red-700 mt-1">{application.rejection_reason}</p>
                      <p className="text-xs text-red-600 mt-2">
                        Don't get discouraged! Update your profile with more skills and try applying to other jobs.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SHOW ACCEPTED MESSAGE */}
              {application.status === 'accepted' && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-800">Congratulations! Your application has been accepted!</p>
                      <p className="text-sm text-green-700 mt-1">
                        You have been selected for this job. Please check your email for confirmation details.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-600">Skill Required</p>
                    <p className="font-medium">{safeText(job.skill_required)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-600">Location</p>
                    <p className="font-medium">{safeText(job.location)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <IndianRupee className="w-4 h-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-600">Wage</p>
                    <p className="font-medium">₹{safeNumber(job.wage)}/day</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-600">Date</p>
                    <p className="font-medium">{formatDate(job.date)}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {safeText(job.description) || 'No description provided'}
              </p>
            </Card>
          );
        })}
      </div>
    )}
  </Card>
</TabsContent>

          {/* EARNINGS TAB */}
          <TabsContent value="earnings" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg">Earnings Summary</h3>
                  <p className="text-sm text-gray-600">Total earnings from completed jobs</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    ₹{safeNumber(dashboardStats.total_earnings || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-gray-600">
                    From {safeNumber(dashboardStats.total_jobs_completed || 0)} jobs
                  </p>
                </div>
              </div>

              {earningsByMonth.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-medium">Earnings by Month</h4>
                  {earningsByMonth.map((earning, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{earning.month}</span>
                        <span className="text-green-600 font-bold">
                          ₹{safeNumber(earning.total_earnings).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{earning.job_count} jobs</span>
                        <span>Avg: ₹{safeNumber(earning.total_earnings / (earning.job_count || 1)).toFixed(0)}/job</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No earnings data available yet</p>
                </div>
              )}
            </Card>

            {/* Payment History */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Recent Payments</h3>
              {completedJobs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job</TableHead>
                      <TableHead>Employer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedJobs.slice(0, 5).map((job, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{safeText(job.title)}</TableCell>
                        <TableCell>{safeText(job.employer_name)}</TableCell>
                        <TableCell className="text-green-600 font-bold">
                          ₹{safeNumber(job.wage)}
                        </TableCell>
                        <TableCell>{formatDate(job.created_at)}</TableCell>
                        <TableCell>
                          <Badge variant="default">Paid</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No payment history available</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* ATTENDANCE TAB */}
          {!isPublicAccess && (
            <TabsContent value="attendance" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-lg">Attendance</h3>
                    <p className="text-sm text-gray-600">Today's status: 
                      <Badge className="ml-2" variant={attendanceMarked ? "default" : "secondary"}>
                        {attendanceMarked ? "Present" : "Absent"}
                      </Badge>
                    </p>
                  </div>
                  <Button 
                    onClick={markAttendance} 
                    disabled={attendanceMarked || loading}
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {attendanceMarked ? "Attendance Marked" : "Mark Today"}
                  </Button>
                </div>

                {attendanceHistory.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium">Attendance History</h4>
                    {attendanceHistory.slice(0, 10).map((attendance, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <CheckSquare className={`w-5 h-5 mr-3 ${attendance.marked_by_admin ? 'text-blue-600' : 'text-green-600'}`} />
                          <div>
                            <p className="font-medium">{formatDate(attendance.date)}</p>
                            <p className="text-sm text-gray-600">
                              {attendance.marked_by_admin ? 'Marked by Admin' : 'Self-marked'}
                            </p>
                          </div>
                        </div>
                        <Badge variant="default">Present</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No attendance records found</p>
                  </div>
                )}
              </Card>
            </TabsContent>
          )}

          {/* PROFILE TAB */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Profile Information</h3>
              
              <form onSubmit={updateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={safeText(userData.name)} disabled />
                  </div>
                  
                  <div>
                    <Label>Email Address</Label>
                    <Input value={safeText(userData.email)} disabled />
                  </div>
                  
                  <div>
                    <Label>Phone Number</Label>
                    <Input value={safeText(userData.phone || worker.phone)} disabled />
                  </div>
                  
                  <div>
                    <Label>Device Type</Label>
                    <Input value={safeText(worker.phone_type)} disabled />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label>Location</Label>
                    <Input 
                      value={safeText(worker.location)} 
                      onChange={(e) => setDashboardData({
                        ...dashboardData,
                        worker: { ...worker, location: e.target.value }
                      })}
                      placeholder="Enter your location"
                      disabled={isPublicAccess}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label>Skills (comma separated)</Label>
                    <Input 
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      placeholder="e.g., Carpentry, Painting, Plumbing"
                      disabled={isPublicAccess}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Current skills: {safeArray(worker.skills).join(', ') || 'None'}
                    </p>
                  </div>
                </div>

                {/* Profile Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{safeNumber(worker.total_jobs)}</p>
                    <p className="text-sm text-gray-600">Total Jobs</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{safeRating(worker.rating)}</p>
                    <p className="text-sm text-gray-600">Rating</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {safeArray(worker.skills).length}
                    </p>
                    <p className="text-sm text-gray-600">Skills</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold">
                      <Badge variant={worker.available ? "default" : "secondary"}>
                        {worker.available ? "Available" : "Busy"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Status</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t">
                  <Button 
                    type="submit" 
                    disabled={loading || isPublicAccess}
                    className={isPublicAccess ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {isPublicAccess ? "Login to Edit" : loading ? "Updating..." : "Update Profile"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleRefresh}>
                    Refresh
                  </Button>
                  {!isPublicAccess && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveTab('available-jobs')}
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Check Available Jobs
                    </Button>
                  )}
                </div>
              </form>
            </Card>

            {/* QR Code for Feature Phone Users */}
            {worker.phone_type === 'feature' && worker.qr_code && (
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <QrCode className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-lg">Your QR Code</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Show this QR code to admin for attendance marking
                </p>
                <div className="flex justify-center">
                  <img 
                    src={worker.qr_code} 
                    alt="Worker QR Code" 
                    className="w-48 h-48 border rounded-lg"
                  />
                </div>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Worker ID: {safeText(worker.id || worker.user_id)}
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600">
            Worker Dashboard • {new Date().getFullYear()} • Labor Platform
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Worker ID: {user?.id || worker.id || worker.user_id || 'Not available'} • Mode: {isPublicAccess ? 'Public View' : 'Secure Access'}
            {!isPublicAccess && availableJobs.length > 0 && ` • ${availableJobs.length} jobs available`}
            {!isPublicAccess && jobsToRate.length > 0 && ` • ${jobsToRate.length} jobs to rate`}
          </p>
        </div>
      </footer>

      {/* Rating Modal */}
      <RatingModal />
    </div>
  );
};





// Add this function inside your component
const openWhatsApp = () => {
  const phoneNumber = "918658758951"; // Replace with your WhatsApp business number (with country code, no +)
  const message = encodeURIComponent("Hi, I need help with my ShramikBandhu account");
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
};

// Add this button in your JSX (e.g., near the logout button)
<Button 
  onClick={openWhatsApp}
  className="bg-green-600 hover:bg-green-700"
>
  <MessageCircle className="w-4 h-4 mr-2" />
  Need Help? Chat on WhatsApp
</Button>


const fetchMyApplications = async () => {
  try {
    console.log('📋 Fetching my applications...');
    const response = await axios.get(`${API}/applications/my`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    
    console.log('✅ Applications response:', response.data);
    
    const apps = safeArray(response.data);
    setApplications(apps);
    
    // Log to check if rejection_reason is present
    apps.forEach(app => {
      if (app.application.status === 'rejected') {
        console.log('Rejected application:', {
          job: app.job.title,
          reason: app.application.rejection_reason
        });
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to fetch applications:', error);
    setApplications([]);
  }
};

export default WorkerDashboard;