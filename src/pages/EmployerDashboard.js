import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger  // Added import
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  Briefcase, MapPin, IndianRupee, Calendar, Users, 
  PlusCircle, LogOut, CheckCircle, RefreshCw,
  User, Building2, Mail, Phone, IdCard, AlertCircle,
  Star, Trophy, TrendingUp, Award, Target, BarChart3,
  MessageSquare, ThumbsUp, X, Filter, Check, Clock,
  Eye, ExternalLink, Users2, FileText, CheckSquare,
  XCircle, AlertTriangle, Mail as MailIcon,
  Loader2, Shield, History, DollarSign, Trash2,
  Info, TrendingDown, Award as AwardIcon, Download,
  ClipboardCheck, ThumbsDown, EyeOff, StarHalf,
  Bell, BellOff, Settings, Search, QrCode,
  Fingerprint, Key, AlertOctagon, Sparkles,  MessageCircle  // ← ADD THIS

} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API = `${BACKEND_URL}/api`;

const EmployerDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    total_jobs: 0,
    active_jobs: 0,
    completed_jobs: 0,
    company_rating: 0.0,
    total_ratings: 0,
    total_workers_hired: 0
  });
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    skill_required: '',
    num_workers_needed: 1,
    location: '',
    wage: '',
    date: ''
  });
  const [employerProfile, setEmployerProfile] = useState(null);
  const [errors, setErrors] = useState({
    stats: false,
    jobs: false,
    profile: false
  });
  const [recentRatings, setRecentRatings] = useState([]);
  const [completedJobsForRating, setCompletedJobsForRating] = useState([]);
  const [showRateDialog, setShowRateDialog] = useState(false);
  const [selectedJobForRating, setSelectedJobForRating] = useState(null);
  const [selectedWorkerForRating, setSelectedWorkerForRating] = useState(null);
  const [ratingForm, setRatingForm] = useState({
    rating: 5,
    comment: ''
  });
  const [ratingFilter, setRatingFilter] = useState('all');
  const [jobPostingSuccess, setJobPostingSuccess] = useState(false);
  const [newlyPostedJob, setNewlyPostedJob] = useState(null);
  const [showJobConfirmation, setShowJobConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const [applicationFilter, setApplicationFilter] = useState('all');
  
  // NEW: State for job completion
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [jobToComplete, setJobToComplete] = useState(null);
  const [completingJob, setCompletingJob] = useState(false);
  
  // NEW: State for completed jobs view
  const [completedJobs, setCompletedJobs] = useState([]);
  const [ratingWorkers, setRatingWorkers] = useState([]);
  const [showWorkerRatingDialog, setShowWorkerRatingDialog] = useState(false);
  const [workerRatingForm, setWorkerRatingForm] = useState({
    rating: 5,
    comment: ''
  });

  const api = axios.create({
    baseURL: API,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  useEffect(() => {
    console.log('🔍 EmployerDashboard mounted with user:', user);
    
    if (user && user.id && user.role === 'employer') {
      fetchAllData();
      fetchApplications();
      fetchCompletedJobs(); // NEW: Fetch completed jobs
    } else {
      console.warn('⚠️ User not ready or not an employer:', user);
    }
  }, [user]);

  // NEW: Fetch completed jobs
  const fetchCompletedJobs = async () => {
    try {
      console.log('📋 Fetching completed jobs...');
      const response = await api.get('/employer/completed-jobs');
      console.log('✅ Completed jobs response:', response.data);
      setCompletedJobs(response.data || []);
      
      // Extract workers who need rating
      const workersToRate = [];
      response.data.forEach(job => {
        if (job.assigned_workers && job.assigned_workers.length > 0) {
          job.assigned_workers.forEach(workerId => {
            workersToRate.push({
              jobId: job.id,
              jobTitle: job.title,
              workerId: workerId,
              workerName: `Worker ${workerId.substring(0, 6)}`, // Placeholder
              date: job.date
            });
          });
        }
      });
      setRatingWorkers(workersToRate);
      
    } catch (error) {
      console.error('❌ Failed to fetch completed jobs:', error);
      setCompletedJobs([]);
    }
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






  const fetchAllData = async () => {
    setFetching(true);
    setErrors({ stats: false, jobs: false, profile: false });
    
    try {
      await fetchJobs();
      
      try {
        await fetchStats();
      } catch (statsError) {
        console.warn('⚠️ Stats fetch failed:', statsError.message);
        setErrors(prev => ({ ...prev, stats: true }));
        calculateStatsFromJobs();
      }
      
      try {
        await fetchEmployerProfile();
      } catch (profileError) {
        console.warn('⚠️ Profile fetch failed:', profileError.message);
        setErrors(prev => ({ ...prev, profile: true }));
      }
      
      try {
        await fetchRatings();
      } catch (ratingsError) {
        console.warn('⚠️ Ratings fetch failed:', ratingsError.message);
      }
      
    } catch (error) {
      console.error('❌ Error in fetchAllData:', error.message);
      toast.error('Failed to load dashboard data.');
    } finally {
      setFetching(false);
    }
  };

  const fetchApplications = async () => {
    try {
      console.log('📄 Fetching applications...');
      const response = await api.get('/employer/applications');
      console.log('✅ Applications response:', response.data);
      setApplications(response.data || []);
    } catch (error) {
      console.error('❌ Applications fetch error:', error.response?.data || error.message);
      toast.error('Failed to load applications.');
    }
  };

  const fetchStats = async () => {
    try {
      console.log('📊 Fetching stats...');
      const response = await api.get('/stats/dashboard');
      console.log('✅ Stats response:', response.data);
      setStats(prev => ({ 
        ...prev, 
        ...response.data,
        company_rating: response.data.company_rating || response.data.rating || employerProfile?.rating || 0.0
      }));
    } catch (error) {
      console.error('❌ Stats fetch error:', error.response?.data || error.message);
      throw error;
    }
  };

  const fetchEmployerProfile = async () => {
    try {
      console.log('👤 Fetching employer profile...');
      const response = await api.get('/employers/profile');
      console.log('✅ Profile response:', response.data);
      setEmployerProfile(response.data);
      
      if (response.data.rating || response.data.avg_rating) {
        setStats(prev => ({
          ...prev,
          company_rating: response.data.avg_rating || response.data.rating || prev.company_rating,
          total_ratings: response.data.total_ratings || prev.total_ratings,
          total_workers_hired: response.data.total_workers_hired || prev.total_workers_hired
        }));
      }
    } catch (error) {
      console.log('⚠️ Profile not found or error:', error.response?.status);
      if (error.response?.status !== 404) {
        throw error;
      }
    }
  };

  const fetchJobs = async () => {
    try {
      console.log('📋 Fetching jobs...');
      const response = await api.get('/jobs/my');
      console.log('✅ Jobs response:', response.data);
      const employerJobs = response.data || [];
      setJobs(employerJobs);
      
      const completedJobs = employerJobs.filter(job => job.status === 'completed');
      setCompletedJobsForRating(completedJobs);
      
      calculateStatsFromJobs(employerJobs);
      
    } catch (error) {
      console.error('❌ Jobs fetch error:', error.response?.data || error.message);
      setErrors(prev => ({ ...prev, jobs: true }));
      setJobs([]);
      toast.error('Failed to load jobs.');
    }
  };

  const fetchRatings = async () => {
    try {
      console.log('⭐ Fetching ratings...');
      const response = await api.get('/employer/ratings');
      console.log('✅ Ratings response:', response.data);
      setRecentRatings(response.data || []);
    } catch (error) {
      console.log('⚠️ Trying alternative ratings endpoint...');
      try {
        const response = await api.get('/ratings/employer');
        console.log('✅ Ratings response (alternative):', response.data);
        setRecentRatings(response.data || []);
      } catch (altError) {
        console.log('⚠️ Ratings endpoint not available:', altError.message);
        setRecentRatings(generateMockRatings());
      }
    }
  };

  const generateMockRatings = () => {
    return [
      { 
        id: '1', 
        rating: 5, 
        comment: "Great employer! Paid on time and provided good working conditions.", 
        worker_name: "Rajesh Kumar", 
        job_title: "Construction Work",
        created_at: "2024-01-15T10:30:00Z"
      }
    ];
  };

  const calculateStatsFromJobs = (jobsData = jobs) => {
    const total = jobsData.length;
    const active = jobsData.filter(j => j.status === 'open' || j.status === 'in_progress').length;
    const completed = jobsData.filter(j => j.status === 'completed').length;
    
    // Calculate total workers hired
    const totalWorkersHired = jobsData.reduce((sum, job) => {
      return sum + (job.assigned_workers?.length || 0);
    }, 0);
    
    console.log('📈 Calculated stats from jobs:', { total, active, completed, totalWorkersHired });
    
    setStats(prev => ({
      ...prev,
      total_jobs: total,
      active_jobs: active,
      completed_jobs: completed,
      total_workers_hired: totalWorkersHired
    }));
  };

  // NEW: Job Completion Function
  const handleCompleteJob = async (jobId) => {
    if (!jobId) return;
    
    setCompletingJob(true);
    try {
      console.log('✅ Marking job as complete:', jobId);
      
      // Use POST endpoint instead of PUT
      const response = await api.post(`/jobs/${jobId}/complete`);
      
      console.log('✅ Job completion response:', response.data);
      
      toast.success(
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-semibold">Job Marked as Complete!</p>
            <p className="text-sm">Workers have been notified to submit ratings.</p>
          </div>
        </div>,
        { duration: 5000 }
      );
      
      // Update jobs list
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? { ...job, status: 'completed' } : job
        )
      );
      
      // Update completed jobs
      fetchCompletedJobs();
      
      // Refresh stats
      calculateStatsFromJobs();
      
      // Close dialog
      setShowCompleteDialog(false);
      setJobToComplete(null);
      
    } catch (error) {
      console.error('❌ Complete job error:', error);
      
      let errorMessage = 'Failed to complete job';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      toast.error(
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <div>
            <p className="font-semibold">Completion Failed</p>
            <p className="text-sm">{errorMessage}</p>
          </div>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setCompletingJob(false);
    }
  };

  // NEW: Open complete job dialog
  const openCompleteDialog = (job) => {
    setJobToComplete(job);
    setShowCompleteDialog(true);
  };

  // NEW: Submit worker rating
  const submitWorkerRating = async () => {
    if (!selectedWorkerForRating) return;
    
    setLoading(true);
    try {
      console.log('⭐ Submitting worker rating for:', selectedWorkerForRating);
      
      await api.post('/ratings/submit', {
        job_id: selectedWorkerForRating.jobId,
        to_user_id: selectedWorkerForRating.workerId,
        rating: workerRatingForm.rating,
        review: workerRatingForm.comment
      });
      
      toast.success('Worker rating submitted successfully!');
      
      // Close dialog and reset
      setShowWorkerRatingDialog(false);
      setSelectedWorkerForRating(null);
      setWorkerRatingForm({ rating: 5, comment: '' });
      
      // Refresh ratings
      fetchRatings();
      
    } catch (error) {
      console.error('❌ Failed to submit worker rating:', error);
      toast.error(error.response?.data?.detail || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (applicationFilter === 'all') return true;
    return app.application.status === applicationFilter;
  });

  const pendingApplications = applications.filter(app => app.application.status === 'pending');
  const acceptedApplications = applications.filter(app => app.application.status === 'accepted');
  const rejectedApplications = applications.filter(app => app.application.status === 'rejected');

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    setJobPostingSuccess(false);
    setNewlyPostedJob(null);

    try {
      console.log('🚀 Creating job with data:', jobForm);
      
      const requiredFields = ['title', 'description', 'skill_required', 'location', 'wage', 'date'];
      const missingFields = requiredFields.filter(field => !jobForm[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill all required fields: ${missingFields.join(', ')}`);
      }

      if (parseFloat(jobForm.wage) <= 0) {
        throw new Error('Wage must be greater than 0');
      }

      const selectedDate = new Date(jobForm.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        throw new Error('Job date cannot be in the past');
      }

      const formattedDate = new Date(jobForm.date).toISOString().split('T')[0];
      
      const jobData = {
        title: jobForm.title.trim(),
        description: jobForm.description.trim(),
        skill_required: jobForm.skill_required.trim(),
        num_workers_needed: parseInt(jobForm.num_workers_needed) || 1,
        location: jobForm.location.trim(),
        wage: parseFloat(jobForm.wage) || 0,
        date: formattedDate
      };

      console.log('📤 Sending job data to API:', jobData);
      
      const response = await api.post('/jobs', jobData);
      
      console.log('✅ Job creation API response:', response.data);
      
      if (response.data && response.data.id) {
        setJobPostingSuccess(true);
        setNewlyPostedJob(response.data);
        
        toast.success(
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-semibold">Job Posted Successfully!</p>
              <p className="text-sm">"{response.data.title}" has been posted.</p>
            </div>
          </div>,
          {
            duration: 5000,
            action: {
              label: 'View Job',
              onClick: () => setShowJobConfirmation(true)
            }
          }
        );
        
        setShowCreateJob(false);
        
        setJobForm({
          title: '',
          description: '',
          skill_required: '',
          num_workers_needed: 1,
          location: '',
          wage: '',
          date: ''
        });
        
        setTimeout(() => {
          fetchJobs();
          fetchStats();
        }, 1000);
        
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (error) {
      console.error('❌ Job creation error:', error);
      
      let errorMessage = 'Failed to create job. Please try again.';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid job data. Please check all fields.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        setTimeout(() => onLogout(), 2000);
      } else if (error.response?.status === 403) {
        errorMessage = 'You are not authorized to post jobs.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <div>
            <p className="font-semibold">Job Posting Failed</p>
            <p className="text-sm">{errorMessage}</p>
          </div>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptApplication = async (applicationId) => {
    if (!window.confirm('Accept this worker for the job? They will receive a confirmation email.')) return;

    setLoading(true);
    try {
      await api.post(`/applications/${applicationId}/employer/accept`);
      toast.success('✅ Application accepted! Worker has been notified via email.');
      
      setApplications(prev => prev.filter(app => 
        app.application.id !== applicationId
      ));
      
      fetchJobs();
      
    } catch (error) {
      console.error('❌ Error accepting application:', error);
      toast.error(error.response?.data?.detail || 'Failed to accept application');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectApplication = async (applicationId) => {
  // Show a prompt with a textarea for rejection reason
  const rejectionReason = prompt('Please provide a reason for rejection:');
  
  // If user cancels, don't proceed
  if (rejectionReason === null) return;

  setLoading(true);
  try {
    // Send the reason in the request body
    await api.post(`/applications/${applicationId}/employer/reject`, { 
      reason: rejectionReason || 'The employer has selected other candidates for this position.'
    });
    
    toast.success('Application rejected. Worker has been notified with the reason.');
    
    // Remove from applications list
    setApplications(prev => prev.filter(app => 
      app.application.id !== applicationId
    ));
    
  } catch (error) {
    console.error('❌ Error rejecting application:', error);
    toast.error(error.response?.data?.detail || 'Failed to reject application');
  } finally {
    setLoading(false);
  }
};

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // NEW: Complete Job Dialog Component
  const CompleteJobDialog = () => (
    <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Mark Job as Complete
          </DialogTitle>
          <DialogDescription>
            Confirm that this job has been successfully completed
          </DialogDescription>
        </DialogHeader>
        
        {jobToComplete && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium">{jobToComplete.title}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Calendar className="w-3 h-3" />
                <span>Date: {formatDate(jobToComplete.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-3 h-3" />
                <span>Location: {jobToComplete.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-3 h-3" />
                <span>Workers: {jobToComplete.assigned_workers?.length || 0} assigned</span>
              </div>
            </div>
            
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <AlertDescription className="text-sm text-yellow-800">
                <strong>Important:</strong> Once marked as complete:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Workers will become available for new jobs</li>
                  <li>Workers will be asked to rate their experience</li>
                  <li>You will be able to rate the workers</li>
                  <li>This action cannot be undone</li>
                </ul>
              </AlertDescription>
            </Alert>
            
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Total Wage Payment: 
                <span className="text-green-600 ml-2">
                  ₹{(jobToComplete.wage || 0) * (jobToComplete.assigned_workers?.length || 0)}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                (₹{jobToComplete.wage || 0} × {jobToComplete.assigned_workers?.length || 0} workers)
              </p>
            </div>
          </div>
        )}
        
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowCompleteDialog(false);
              setJobToComplete(null);
            }}
            disabled={completingJob}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => handleCompleteJob(jobToComplete?.id)}
            disabled={completingJob || !jobToComplete}
            className="bg-green-600 hover:bg-green-700"
          >
            {completingJob ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Complete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // NEW: Worker Rating Dialog Component
  const WorkerRatingDialog = () => (
    <Dialog open={showWorkerRatingDialog} onOpenChange={setShowWorkerRatingDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Rate Worker Performance
          </DialogTitle>
          <DialogDescription>
            Share your feedback about this worker's performance
          </DialogDescription>
        </DialogHeader>
        
        {selectedWorkerForRating && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium">{selectedWorkerForRating.workerName}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Briefcase className="w-3 h-3" />
                <span>Job: {selectedWorkerForRating.jobTitle}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>Date: {formatDate(selectedWorkerForRating.date)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="worker-rating">Performance Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setWorkerRatingForm({...workerRatingForm, rating: star})}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= workerRatingForm.rating
                          ? 'fill-yellow-400 text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({workerRatingForm.rating}/5)
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="worker-comment">Comments (Optional)</Label>
              <Textarea
                id="worker-comment"
                value={workerRatingForm.comment}
                onChange={(e) => setWorkerRatingForm({...workerRatingForm, comment: e.target.value})}
                placeholder="Share your feedback about this worker's performance..."
                rows={3}
              />
            </div>
          </div>
        )}
        
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowWorkerRatingDialog(false);
              setSelectedWorkerForRating(null);
              setWorkerRatingForm({ rating: 5, comment: '' });
            }}
            disabled={loading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={submitWorkerRating}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Star className="w-4 h-4 mr-2" />
                Submit Rating
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const JobConfirmationDialog = () => (
    <Dialog open={showJobConfirmation} onOpenChange={setShowJobConfirmation}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Check className="w-6 h-6 text-green-500" />
            Job Posted Successfully!
          </DialogTitle>
        </DialogHeader>
        
        {newlyPostedJob && (
          <div className="mt-4 space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-800">Your job is now live!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Workers can now apply for this job. You'll receive applications in the Applications tab.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Job Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Job Title</p>
                  <p className="font-medium">{newlyPostedJob.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Skill Required</p>
                  <p className="font-medium">{newlyPostedJob.skill_required}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{newlyPostedJob.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Daily Wage</p>
                  <p className="font-medium">₹{newlyPostedJob.wage}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Workers Needed</p>
                  <p className="font-medium">{newlyPostedJob.num_workers_needed}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Job Date</p>
                  <p className="font-medium">{formatDate(newlyPostedJob.date)}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <Users2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Workers will see this job in their available jobs list</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>You'll receive applications in the Applications tab</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 mt=0.5 flex-shrink-0" />
                  <span>Review and accept suitable candidates</span>
                </li>
                <li className="flex items-start gap-2">
                  <MailIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Accepted workers will get confirmation emails</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowJobConfirmation(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowJobConfirmation(false);
                  setActiveTab('applications');
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Applications
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-1" />
                      <span className="font-medium">{user?.name || 'Employer'}</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      Employer Account
                    </span>
                    {user?.id && (
                      <div className="flex items-center text-xs text-gray-500">
                        <IdCard className="w-3 h-3 mr-1" />
                        ID: {user.id.substring(0, 8)}...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => {
                  fetchAllData();
                  fetchApplications();
                  fetchCompletedJobs(); // Refresh completed jobs too
                }}
                variant="outline" 
                size="sm"
                disabled={fetching || loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                onClick={onLogout} 
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Company: <span className="text-blue-700 font-semibold">{employerProfile?.company_name || 'Not Set'}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{user?.phone || 'Not Set'}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Employer ID: <code className="bg-gray-100 px-2 py-1 rounded font-mono">{user?.id}</code>
              </div>
            </div>
          </div>
        </div>
      </header>

      {(errors.stats || errors.jobs || errors.profile) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800">Partial Data Loaded</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {errors.stats && <li>Dashboard statistics could not be loaded</li>}
                    {errors.jobs && <li>Jobs list could not be loaded</li>}
                    {errors.profile && <li>Company profile could not be loaded</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(loading || fetching) && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center min-w-[200px]">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <span className="text-gray-700 font-medium">
              {loading ? 'Processing...' : 'Loading Dashboard...'}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JobConfirmationDialog />
        <CompleteJobDialog />
        <WorkerRatingDialog />

        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-white to-yellow-50 border-yellow-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
                  Company Rating
                </p>
                <div className="mt-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${
                          star <= Math.floor(stats.company_rating)
                            ? 'text-yellow-500 fill-yellow-500'
                            : star <= stats.company_rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 font-bold text-lg text-gray-900">
                      {stats.company_rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Based on {stats.total_ratings || 0} ratings</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total_jobs}</p>
                <p className="text-xs text-gray-500 mt-2">All posted jobs</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.active_jobs}</p>
                <p className="text-xs text-gray-500 mt-2">Currently open</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Workers Hired</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.total_workers_hired}</p>
                <p className="text-xs text-gray-500 mt-2">Total assigned</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <Users2 className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{pendingApplications.length}</p>
                <p className="text-xs text-gray-500 mt-2">Pending review</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-full">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-8 bg-white rounded-xl p-6 border shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Job Management</h2>
              <p className="text-gray-600 mt-1">Post new job opportunities and manage existing ones</p>
            </div>
            <Dialog open={showCreateJob} onOpenChange={setShowCreateJob}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 px-6">
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Post New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">Create New Job Posting</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateJob} className="space-y-5 mt-4">
                  <div className="space-y-2">
                    <Label>Job Title *</Label>
                    <Input
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      placeholder="e.g. Construction Worker, Painter, Welder"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea
                      value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      placeholder="Describe the work, responsibilities, requirements..."
                      required
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Skill Required *</Label>
                    <Input
                      value={jobForm.skill_required}
                      onChange={(e) => setJobForm({ ...jobForm, skill_required: e.target.value })}
                      placeholder="e.g. Construction, Painting, Electrical Work"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Workers Needed *</Label>
                      <Input
                        type="number"
                        value={jobForm.num_workers_needed}
                        onChange={(e) => setJobForm({ ...jobForm, num_workers_needed: e.target.value })}
                        min="1"
                        max="100"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Daily Wage (₹) *</Label>
                      <Input
                        type="number"
                        value={jobForm.wage}
                        onChange={(e) => setJobForm({ ...jobForm, wage: e.target.value })}
                        placeholder="500"
                        min="100"
                        step="50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Input
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      placeholder="e.g. Mumbai, Andheri West, Site Address"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Job Date *</Label>
                    <Input
                      type="date"
                      value={jobForm.date}
                      onChange={(e) => setJobForm({ ...jobForm, date: e.target.value })}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Creating Job...
                        </>
                      ) : (
                        'Post Job Now'
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              My Jobs ({jobs.length})
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Applications ({applications.length})
              {pendingApplications.length > 0 && (
                <Badge className="ml-1 bg-red-100 text-red-800 hover:bg-red-100">
                  {pendingApplications.length} new
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completed ({completedJobs.length})
            </TabsTrigger>
          </TabsList>

          {/* JOBS TAB */}
          <TabsContent value="jobs" className="space-y-6">
            <Card className="overflow-hidden border shadow-sm">
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">My Posted Jobs</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {jobs.length === 0 ? 'No jobs posted yet' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} found`}
                    </p>
                  </div>
                  {jobs.length > 0 && (
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold text-blue-600">{stats.active_jobs}</span> active • 
                        <span className="font-semibold text-green-600 mx-1">{stats.completed_jobs}</span> completed
                      </div>
                      <div className="flex items-center text-sm">
                        <FileText className="w-4 h-4 text-purple-500 mr-1" />
                        <span className="font-semibold">{pendingApplications.length}</span>
                        <span className="text-gray-500 ml-1">pending applications</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {jobs.length === 0 ? (
                <div className="py-16 px-6 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <Briefcase className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
                    <p className="text-gray-600 mb-6">
                      Start by posting your first job opportunity. Workers will be able to apply and you can review their applications.
                    </p>
                    <Dialog open={showCreateJob} onOpenChange={setShowCreateJob}>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 px-6">
                          <PlusCircle className="w-5 h-5 mr-2" />
                          Post Your First Job
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                </div>
              ) : (
                <div className="divide-y">
                  {jobs.map((job) => (
                    <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                <Badge 
                                  variant={job.status === 'completed' ? 'default' : 'outline'}
                                  className={
                                    job.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-orange-100 text-orange-800'
                                  }
                                >
                                  {job.status === 'completed' ? 'Completed' : 
                                   job.status === 'in_progress' ? 'In Progress' : 
                                   'Open'}
                                </Badge>
                              </div>
                              {job.description && (
                                <p className="text-gray-600 text-sm mb-3">{job.description}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center text-sm">
                              <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <span className="text-gray-500">Skill: </span>
                                <span className="font-medium">{job.skill_required}</span>
                              </div>
                            </div>

                            <div className="flex items-center text-sm">
                              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <span className="text-gray-500">Location: </span>
                                <span className="font-medium">{job.location}</span>
                              </div>
                            </div>

                            <div className="flex items-center text-sm">
                              <IndianRupee className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <span className="text-gray-500">Wage: </span>
                                <span className="font-medium">₹{job.wage}/day</span>
                              </div>
                            </div>

                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <span className="text-gray-500">Date: </span>
                                <span className="font-medium">{formatDate(job.date)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center text-sm">
                            <Users className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-500">Workers: </span>
                            <span className="font-medium ml-1">
                              {job.assigned_workers?.length || 0} / {job.num_workers_needed} assigned
                            </span>
                            <span className="mx-2">•</span>
                            <FileText className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-500">Applications: </span>
                            <span className="font-medium ml-1">
                              {applications.filter(app => app.job.id === job.id).length} total
                            </span>
                          </div>
                        </div>

                        <div className="lg:w-48 flex flex-col gap-3">
                          <div className="text-xs text-gray-500">
                            Posted: {formatDate(job.created_at)}
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            {job.status !== 'completed' && (
                              <>
                                <Button
                                  onClick={() => {
                                    setActiveTab('applications');
                                    setApplicationFilter('pending');
                                  }}
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                >
                                  <FileText className="w-4 h-4 mr-2" />
                                  View Applications
                                </Button>
                                
                                {/* NEW: Complete Job Button - Only for jobs with assigned workers */}
                                {job.assigned_workers?.length > 0 && job.status !== 'completed' && (
                                  <Button
                                    onClick={() => openCompleteDialog(job)}
                                    disabled={loading}
                                    size="sm"
                                    className="w-full bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark Complete
                                  </Button>
                                )}
                              </>
                            )}
                            
                            {job.status === 'completed' && job.assigned_workers?.length > 0 && (
                              <Button
                                onClick={() => {
                                  // Find workers who need rating
                                  const workers = job.assigned_workers.map(workerId => ({
                                    jobId: job.id,
                                    jobTitle: job.title,
                                    workerId: workerId,
                                    workerName: `Worker ${workerId.substring(0, 6)}`,
                                    date: job.date
                                  }));
                                  
                                  if (workers.length > 0) {
                                    setSelectedWorkerForRating(workers[0]);
                                    setShowWorkerRatingDialog(true);
                                  }
                                }}
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                <Star className="w-4 h-4 mr-2" />
                                Rate Workers
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* APPLICATIONS TAB */}
          <TabsContent value="applications" className="space-y-6">
            <Card className="overflow-hidden border shadow-sm">
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Job Applications</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Review and manage applications from workers
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Select value={applicationFilter} onValueChange={setApplicationFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter applications" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Applications</SelectItem>
                        <SelectItem value="pending">Pending ({pendingApplications.length})</SelectItem>
                        <SelectItem value="accepted">Accepted ({acceptedApplications.length})</SelectItem>
                        <SelectItem value="rejected">Rejected ({rejectedApplications.length})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {filteredApplications.length === 0 ? (
                <div className="py-16 px-6 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {applicationFilter === 'pending' ? 'No pending applications' : 
                       applicationFilter === 'accepted' ? 'No accepted applications' :
                       applicationFilter === 'rejected' ? 'No rejected applications' : 
                       'No applications yet'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {applicationFilter === 'pending' ? 'When workers apply for your jobs, they will appear here.' : 
                       'Applications will appear here based on the selected filter.'}
                    </p>
                    {applicationFilter === 'pending' && (
                      <Button 
                        onClick={() => setActiveTab('jobs')}
                        variant="outline"
                      >
                        <Briefcase className="w-4 h-4 mr-2" />
                        View My Jobs
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredApplications.map((item) => (
                    <div key={item.application.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {item.worker.name}
                                </h3>
                                <Badge className={
                                  item.application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  item.application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }>
                                  {item.application.status}
                                </Badge>
                              </div>
                              <p className="text-gray-600">
                                Applied for: <span className="font-medium">{item.job.title}</span>
                              </p>
                            </div>
                            <div className="text-xs text-gray-500">
                              Applied: {formatDate(item.application.applied_at)}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center text-sm">
                              <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <span className="text-gray-500">Job: </span>
                                <span className="font-medium">{item.job.title}</span>
                              </div>
                            </div>

                            <div className="flex items-center text-sm">
                              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <span className="text-gray-500">Location: </span>
                                <span className="font-medium">{item.job.location}</span>
                              </div>
                            </div>

                            <div className="flex items-center text-sm">
                              <IndianRupee className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <span className="text-gray-500">Wage: </span>
                                <span className="font-medium">₹{item.job.wage}/day</span>
                              </div>
                            </div>

                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <span className="text-gray-500">Date: </span>
                                <span className="font-medium">{formatDate(item.job.date)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Worker Contact</p>
                              <div className="flex items-center gap-4">
                                {item.worker.email && (
                                  <div className="flex items-center text-sm">
                                    <Mail className="w-4 h-4 mr-1 text-gray-400" />
                                    <span>{item.worker.email}</span>
                                  </div>
                                )}
                                {item.worker.phone && (
                                  <div className="flex items-center text-sm">
                                    <Phone className="w-4 h-4 mr-1 text-gray-400" />
                                    <span>{item.worker.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-gray-500 mb-1">Skills & Experience</p>
                              <div className="flex flex-wrap gap-2">
                                {item.worker.skills.map((skill, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {item.worker.experience && (
                                  <Badge variant="outline" className="text-xs bg-blue-50">
                                    {item.worker.experience} experience
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="lg:w-48 flex flex-col gap-3">
                          {item.application.status === 'pending' && (
                            <>
                              <Button
                                onClick={() => handleAcceptApplication(item.application.id)}
                                disabled={loading}
                                size="sm"
                                className="w-full bg-green-600 hover:bg-green-700"
                              >
                                <CheckSquare className="w-4 h-4 mr-2" />
                                Accept Application
                              </Button>
                              <Button
                                onClick={() => handleRejectApplication(item.application.id)}
                                disabled={loading}
                                variant="outline"
                                size="sm"
                                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject Application
                              </Button>
                            </>
                          )}
                          {item.application.status === 'accepted' && (
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                              <p className="text-sm font-medium text-green-800">Accepted</p>
                              <p className="text-xs text-green-600">
                                Worker notified via email
                              </p>
                            </div>
                          )}
                          {item.application.status === 'rejected' && (
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                              <p className="text-sm font-medium text-red-800">Rejected</p>
                              <p className="text-xs text-red-600">
                                Worker notified via email
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* NEW: COMPLETED JOBS TAB */}
          <TabsContent value="completed" className="space-y-6">
            <Card className="overflow-hidden border shadow-sm">
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Completed Jobs</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Review completed jobs and rate worker performance
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {ratingWorkers.length > 0 && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <Star className="w-3 h-3 mr-1" />
                        {ratingWorkers.length} workers to rate
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchCompletedJobs}
                      disabled={loading}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>

              {completedJobs.length === 0 ? (
                <div className="py-16 px-6 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed jobs yet</h3>
                    <p className="text-gray-600 mb-6">
                      Complete some jobs first, then you can review them here and rate worker performance.
                    </p>
                    <Button 
                      onClick={() => setActiveTab('jobs')}
                      variant="outline"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      View Active Jobs
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="divide-y">
                  {completedJobs.map((job) => (
                    <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                <Badge className="bg-green-100 text-green-800">
                                  Completed
                                </Badge>
                              </div>
                              {job.description && (
                                <p className="text-gray-600 text-sm mb-3">{job.description}</p>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Completed: {formatDate(job.created_at)}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center text-sm">
                              <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <span className="text-gray-500">Skill: </span>
                                <span className="font-medium">{job.skill_required}</span>
                              </div>
                            </div>

                            <div className="flex items-center text-sm">
                              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <span className="text-gray-500">Location: </span>
                                <span className="font-medium">{job.location}</span>
                              </div>
                            </div>

                            <div className="flex items-center text-sm">
                              <IndianRupee className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <span className="text-gray-500">Wage Paid: </span>
                                <span className="font-medium text-green-600">
                                  ₹{(job.wage || 0) * (job.assigned_workers?.length || 0)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <span className="text-gray-500">Date: </span>
                                <span className="font-medium">{formatDate(job.date)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center text-sm">
                            <Users className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-500">Workers Assigned: </span>
                            <span className="font-medium ml-1">
                              {job.assigned_workers?.length || 0}
                            </span>
                            <span className="mx-2">•</span>
                            <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-500">Per Worker: </span>
                            <span className="font-medium ml-1">₹{job.wage || 0}</span>
                          </div>
                        </div>

                        <div className="lg:w-48 flex flex-col gap-3">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <p className="text-sm font-medium text-green-800">Job Completed</p>
                            <p className="text-xs text-green-600">
                              All workers paid
                            </p>
                          </div>
                          
                          {job.assigned_workers?.length > 0 && (
                            <Button
                              onClick={() => {
                                // Find workers from this job
                                const workers = job.assigned_workers.map(workerId => ({
                                  jobId: job.id,
                                  jobTitle: job.title,
                                  workerId: workerId,
                                  workerName: `Worker ${workerId.substring(0, 6)}`,
                                  date: job.date
                                }));
                                
                                if (workers.length > 0) {
                                  setSelectedWorkerForRating(workers[0]);
                                  setShowWorkerRatingDialog(true);
                                }
                              }}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Star className="w-4 h-4 mr-2" />
                              Rate Workers
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployerDashboard;