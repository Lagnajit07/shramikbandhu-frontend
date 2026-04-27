import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,  // ← ADD THIS
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Users,
  Briefcase,
  Calendar,
  LogOut,
  PlusCircle,
  QrCode,
  UserCheck,
  Phone,
  PhoneOff,
  Star,
  MapPin,
  BriefcaseBusiness,
  Award,
  ChevronDown,
  ChevronUp,
  Loader2,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [workers, setWorkers] = useState([]);
  const [allWorkers, setAllWorkers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRegisterWorker, setShowRegisterWorker] = useState(false);
  const [jobAssignment, setJobAssignment] = useState({
    workerId: "",
    jobId: "",
  });
  const [workerForm, setWorkerForm] = useState({
    name: "",
    email: "",
    phone: "",
    phone_type: "smartphone",
    experience: "",
    skills: "",
    location: "",
    password: "default123",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    skills: "",
    location: "",
  });


const [showEditWorker, setShowEditWorker] = useState(false);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [workerToDelete, setWorkerToDelete] = useState(null);
const [workerToEdit, setWorkerToEdit] = useState(null);
const [editWorkerForm, setEditWorkerForm] = useState({
    name: "",
    email: "",
    phone: "",
    phone_type: "smartphone",
    experience: "",
    skills: "",
    location: "",
    password: "",
});
const [editFormErrors, setEditFormErrors] = useState({
  name: "",
  phone: "",
  email: "",
});





  // Pagination states
  const [visibleWorkers, setVisibleWorkers] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalWorkers, setTotalWorkers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  // State for tracking copied worker IDs
  const [copiedWorkerId, setCopiedWorkerId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, workersRes, attendanceRes, jobsRes] = await Promise.all([
        axios.get(`${API}/stats/dashboard`),
        axios.get(`${API}/workers?limit=1000`),
        axios.get(`${API}/attendance/today`),
        axios.get(`${API}/jobs`),
      ]);

      setStats(statsRes.data);
      
      // Sort workers by created_at in descending order (newest first)
      const sortedWorkers = [...workersRes.data].sort((a, b) => {
        if (a.created_at && b.created_at) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return 0;
      });
      
      setAllWorkers(sortedWorkers);
      setTotalWorkers(sortedWorkers.length);
      
      // Set initial visible workers
      setWorkers(sortedWorkers.slice(0, visibleWorkers));
      
      setAttendance(attendanceRes.data);
      setJobs(jobsRes.data);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  // Phone number validation function
  const validatePhoneNumber = (phone) => {
    if (!phone) return "Phone number is required";
    
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if it's a valid Indian mobile number (10 digits, starting with 6-9)
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      return "Please enter a valid 10-digit Indian mobile number";
    }
    
    return "";
  };

  // Validate email for smartphone users
const validateEmail = (email, phoneType) => {
  // For non-smartphone users, email is optional
  if (phoneType !== "smartphone") {
    return ""; // No error, email not required
  }
  
  // For smartphone users, email is required
  if (!email) {
    return "Email is required for smartphone users";
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address";
  }
  
  return "";
};

  // Validate required fields
  const validateForm = () => {
    const errors = {
      name: workerForm.name ? "" : "Name is required",
      email: validateEmail(workerForm.email, workerForm.phone_type),
      phone: validatePhoneNumber(workerForm.phone),
      experience: workerForm.experience ? "" : "Experience is required",
      skills: workerForm.skills ? "" : "Skills are required",
      location: workerForm.location ? "" : "Location is required",
    };

    setFormErrors(errors);
    return !Object.values(errors).some(error => error !== "");
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    
    // Auto-format phone number as user types
    let formattedValue = value.replace(/\D/g, '');
    
    if (formattedValue.length > 10) {
      formattedValue = formattedValue.slice(0, 10);
    }
    
    if (formattedValue.length > 6) {
      formattedValue = formattedValue.replace(/(\d{5})(\d+)/, '$1 $2');
    } else if (formattedValue.length > 5) {
      formattedValue = formattedValue.replace(/(\d{5})(\d+)/, '$1 $2');
    }
    
    if (formattedValue.length > 3) {
      formattedValue = formattedValue.replace(/(\d{3})(\d+)/, '$1 $2');
    }
    
    // Validate as user types
    const phoneError = validatePhoneNumber(formattedValue);
    setFormErrors(prev => ({
      ...prev,
      phone: phoneError
    }));
    
    setWorkerForm(prev => ({
      ...prev,
      phone: formattedValue
    }));
  };

  const handleShowMore = () => {
    setIsLoadingMore(true);
    
    setTimeout(() => {
      const newVisibleCount = visibleWorkers + 6;
      setVisibleWorkers(newVisibleCount);
      setWorkers(allWorkers.slice(0, newVisibleCount));
      setIsLoadingMore(false);
    }, 300);
  };

  const handleShowLess = () => {
    setVisibleWorkers(6);
    setWorkers(allWorkers.slice(0, 6));
  };

  const copyWorkerId = (workerId) => {
    navigator.clipboard.writeText(workerId)
      .then(() => {
        setCopiedWorkerId(workerId);
        toast.success("Worker ID copied to clipboard!");
        
        setTimeout(() => {
          setCopiedWorkerId(null);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy Worker ID");
      });
  };

const handleRegisterWorker = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    toast.error("Please fix the errors in the form");
    return;
  }
  
  setLoading(true);

  try {
    // Generate email for non-smartphone users
    let emailValue;
    if (workerForm.phone_type === "smartphone" && workerForm.email) {
      emailValue = workerForm.email;
    } else {
      const phoneNumber = workerForm.phone.replace(/\s/g, '');
      emailValue = `worker_${phoneNumber}@shramikbandhu.com`;
    }

    // Convert skills from comma-separated string to array
    const skillsArray = workerForm.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      email: emailValue,
      name: workerForm.name,
      role: "worker",
      phone: workerForm.phone.replace(/\s/g, ''),
      phone_type: workerForm.phone_type,
      experience: workerForm.experience || "",  // ← ADD THIS
      skills: skillsArray,  // ← ADD THIS (send as array)
      location: workerForm.location || "",  // ← ADD THIS
      password: workerForm.password || "default123"
    };

    console.log("Registering worker with payload:", payload);

    await axios.post(`${API}/auth/register`, payload);

    toast.success("Worker registered successfully!");
    setShowRegisterWorker(false);

    // Reset form
    setWorkerForm({
      name: "",
      email: "",
      phone: "",
      phone_type: "smartphone",
      experience: "",
      skills: "",
      location: "",
      password: "default123",
    });
    
    setFormErrors({
      name: "",
      email: "",
      phone: "",
      experience: "",
      skills: "",
      location: "",
    });

    fetchData();
  } catch (error) {
    let errorMessage = "Failed to register worker";
    if (error.response?.data?.detail) {
      if (typeof error.response.data.detail === 'string') {
        errorMessage = error.response.data.detail;
      } else if (Array.isArray(error.response.data.detail)) {
        errorMessage = error.response.data.detail[0]?.msg || "Validation error";
      }
    }
    toast.error(errorMessage);
    console.error("Registration error:", error.response?.data);
  } finally {
    setLoading(false);
  }
};

// Open Edit Dialog
const openEditDialog = (worker) => {
    setWorkerToEdit(worker);
    setEditFormErrors({ name: "", phone: "", email: "" }); // Reset errors

    
    // Fetch user data for this worker
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${API}/users/${worker.user_id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const userData = response.data;
            
            setEditWorkerForm({
                name: worker.name || "",
                email: userData.email || "",
                phone: worker.phone || "",
                phone_type: worker.phone_type || "smartphone",
                experience: worker.experience || "",
                skills: Array.isArray(worker.skills) ? worker.skills.join(", ") : "",
                location: worker.location || "",
                password: "",
            });
        } catch (error) {
            // If can't fetch user, use worker data
            setEditWorkerForm({
                name: worker.name || "",
                email: "",
                phone: worker.phone || "",
                phone_type: worker.phone_type || "smartphone",
                experience: worker.experience || "",
                skills: Array.isArray(worker.skills) ? worker.skills.join(", ") : "",
                location: worker.location || "",
                password: "",
            });
        }
    };
    
    fetchUserData();
    setShowEditWorker(true);
};

// Handle Edit Worker
const handleEditWorker = async (e) => {
    e.preventDefault();

    // Validate phone number
  const phoneError = validatePhoneNumber(editWorkerForm.phone);
  if (phoneError) {
    setEditFormErrors(prev => ({ ...prev, phone: phoneError }));
    toast.error(phoneError);
    return;
  }
  
  // Validate name
  if (!editWorkerForm.name.trim()) {
    setEditFormErrors(prev => ({ ...prev, name: "Name is required" }));
    toast.error("Name is required");
    return;
  }
  
  // Validate email for smartphone users
  if (editWorkerForm.phone_type === "smartphone" && editWorkerForm.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editWorkerForm.email)) {
      setEditFormErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      toast.error("Please enter a valid email address");
      return;
    }
  }
    setLoading(true);
    
    try {
        const skillsArray = editWorkerForm.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        
        const payload = {
            name: editWorkerForm.name,
            email: editWorkerForm.email,
            phone: editWorkerForm.phone.replace(/\s/g, ''),
            phone_type: editWorkerForm.phone_type,
            experience: editWorkerForm.experience,
            skills: skillsArray,
            location: editWorkerForm.location,
        };
        
        if (editWorkerForm.password) {
            payload.password = editWorkerForm.password;
        }
        
        await axios.put(`${API}/workers/${workerToEdit.user_id}`, payload, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        toast.success("Worker updated successfully!");
        setShowEditWorker(false);
        setWorkerToEdit(null);
        fetchData();
        
    } catch (error) {
        let errorMessage = "Failed to update worker";
        if (error.response?.data?.detail) {
            if (typeof error.response.data.detail === 'string') {
                errorMessage = error.response.data.detail;
            } else if (Array.isArray(error.response.data.detail)) {
                errorMessage = error.response.data.detail[0]?.msg || "Validation error";
            }
        }
        toast.error(errorMessage);
    } finally {
        setLoading(false);
    }
};

const handleEditPhoneChange = (e) => {
  const value = e.target.value;
  
  // Auto-format phone number as user types
  let formattedValue = value.replace(/\D/g, '');
  
  if (formattedValue.length > 10) {
    formattedValue = formattedValue.slice(0, 10);
  }
  
  if (formattedValue.length > 6) {
    formattedValue = formattedValue.replace(/(\d{5})(\d+)/, '$1 $2');
  } else if (formattedValue.length > 5) {
    formattedValue = formattedValue.replace(/(\d{5})(\d+)/, '$1 $2');
  }
  
  if (formattedValue.length > 3) {
    formattedValue = formattedValue.replace(/(\d{3})(\d+)/, '$1 $2');
  }
  
  // Validate as user types
  const phoneError = validatePhoneNumber(formattedValue);
  setEditFormErrors(prev => ({
    ...prev,
    phone: phoneError
  }));
  
  setEditWorkerForm(prev => ({
    ...prev,
    phone: formattedValue
  }));
};


// Open Delete Dialog
const openDeleteDialog = (worker) => {
    setWorkerToDelete(worker);
    setShowDeleteConfirm(true);
};

// Handle Delete Worker
const handleDeleteWorker = async () => {
    if (!workerToDelete) return;
    
    setLoading(true);
    try {
        await axios.delete(`${API}/workers/${workerToDelete.user_id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        toast.success("Worker deleted successfully!");
        setShowDeleteConfirm(false);
        setWorkerToDelete(null);
        fetchData();
        
    } catch (error) {
        let errorMessage = "Failed to delete worker";
        if (error.response?.data?.detail) {
            errorMessage = error.response.data.detail;
        }
        toast.error(errorMessage);
    } finally {
        setLoading(false);
    }
};



  const handleManualJobAssignment = async () => {
    if (!jobAssignment.workerId || !jobAssignment.jobId) {
      toast.error("Please select both worker and job");
      return;
    }

    try {
      await axios.post(`${API}/jobs/assign`, {
        worker_id: jobAssignment.workerId,
        job_id: jobAssignment.jobId,
        manually_assigned: true,
      });

      toast.success("Job assigned successfully!");
      setJobAssignment({ workerId: "", jobId: "" });
      fetchData();
 } catch (error) {
  let errorMessage = "Failed to assign job";
  if (error.response?.data?.detail) {
    if (typeof error.response.data.detail === 'string') {
      errorMessage = error.response.data.detail;
    } else if (Array.isArray(error.response.data.detail)) {
      errorMessage = error.response.data.detail[0]?.msg || "Validation error";
    }
  }
  toast.error(errorMessage);
}
  };

  // Filter workers by phone type
  const smartphoneWorkers = allWorkers.filter(
    (w) => w.phone_type === "smartphone"
  );
  const featurePhoneWorkers = allWorkers.filter(
    (w) => w.phone_type === "feature_phone"
  );
  const noPhoneWorkers = allWorkers.filter((w) => w.phone_type === "none");

  const getWorkerAvatar = (name) => {
    if (!name) return "👷";
    const initials = name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    return initials;
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Recently';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getExperienceColor = (experience) => {
    if (!experience) return "bg-gray-100 text-gray-700";
    const expNum = parseInt(experience) || 0;
    if (expNum >= 10) return "bg-purple-100 text-purple-800";
    if (expNum >= 5) return "bg-blue-100 text-blue-800";
    if (expNum >= 2) return "bg-green-100 text-green-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = searchQuery === "" || 
      worker.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      worker.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" ||
      (selectedFilter === "available" && worker.available) ||
      (selectedFilter === "smartphone" && worker.phone_type === "smartphone") ||
      (selectedFilter === "feature_phone" && worker.phone_type === "feature_phone") ||
      (selectedFilter === "no_phone" && worker.phone_type === "none");
    
    return matchesSearch && matchesFilter;
  });

  const getPhoneTypeIcon = (type) => {
    switch(type) {
      case "smartphone": return "📱";
      case "feature_phone": return "☎️";
      case "none": return "📵";
      default: return "📱";
    }
  };

  // Required field indicator component
  const RequiredStar = () => (
    <span className="text-red-500 ml-1">*</span>
  );

  // Error message component
  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    
    return (
      <div className="flex items-center gap-1 mt-1">
        <AlertCircle className="w-3 h-3 text-red-500" />
        <p className="text-xs text-red-600">{error}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="hidden md:block p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-600">Welcome back, <span className="font-semibold text-gray-900">{user.name}</span></p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border border-indigo-100">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              <Button
                onClick={() => navigate("/admin/kiosk")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Open Kiosk
              </Button>
              
              <Button
                variant="outline"
                onClick={onLogout}
                className="border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Total Workers</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.total_workers || 0}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-green-600">+12% this month</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-emerald-50 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Present Today</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {stats.present_today || 0}
                  </p>
                  <div className="mt-2">
                    <div className="w-full bg-emerald-100 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full" 
                        style={{ width: `${(stats.present_today || 0) / (stats.total_workers || 1) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
                  <UserCheck className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Active Jobs</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.active_jobs || 0}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-600">Open positions</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                  <Briefcase className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-orange-50 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Employers</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {stats.total_employers || 0}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-600">Registered companies</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Phone Type Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Phone Type Cards */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Phone className="w-5 h-5 text-indigo-600" />
                Device Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <span className="text-2xl">📱</span>
                    </div>
                    <Badge className="bg-emerald-600 text-white px-3 py-1 text-lg font-bold">
                      {smartphoneWorkers.length}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Smartphone Users</h3>
                  <p className="text-sm text-gray-600 mb-4">Full app access & self-service</p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-full bg-emerald-100 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full" 
                        style={{ width: `${(smartphoneWorkers.length / allWorkers.length) * 100 || 0}%` }}
                      ></div>
                    </div>
                    <span className="font-medium text-emerald-700">
                      {allWorkers.length > 0 ? Math.round((smartphoneWorkers.length / allWorkers.length) * 100) : 0}%
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <span className="text-2xl">☎️</span>
                    </div>
                    <Badge className="bg-amber-600 text-white px-3 py-1 text-lg font-bold">
                      {featurePhoneWorkers.length}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Feature Phone Users</h3>
                  <p className="text-sm text-gray-600 mb-4">SMS-based communication</p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-full bg-amber-100 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full" 
                        style={{ width: `${(featurePhoneWorkers.length / allWorkers.length) * 100 || 0}%` }}
                      ></div>
                    </div>
                    <span className="font-medium text-amber-700">
                      {allWorkers.length > 0 ? Math.round((featurePhoneWorkers.length / allWorkers.length) * 100) : 0}%
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-gradient-to-br from-rose-50 to-white border border-rose-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-rose-100 rounded-lg">
                      <span className="text-2xl">📵</span>
                    </div>
                    <Badge className="bg-rose-600 text-white px-3 py-1 text-lg font-bold">
                      {noPhoneWorkers.length}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">No Phone Users</h3>
                  <p className="text-sm text-gray-600 mb-4">Manual assistance required</p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-full bg-rose-100 rounded-full h-2">
                      <div 
                        className="bg-rose-500 h-2 rounded-full" 
                        style={{ width: `${(noPhoneWorkers.length / allWorkers.length) * 100 || 0}%` }}
                      ></div>
                    </div>
                    <span className="font-medium text-rose-700">
                      {allWorkers.length > 0 ? Math.round((noPhoneWorkers.length / allWorkers.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowRegisterWorker(true)}
                  className="w-full justify-start h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
                >
                  <PlusCircle className="w-4 h-4 mr-3" />
                  Register New Worker
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full justify-start h-12 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
                  onClick={() => navigate("/admin/kiosk")}
                >
                  <QrCode className="w-4 h-4 mr-3" />
                  Open Attendance Kiosk
                </Button>
              </div>
              
              <div className="border-t border-gray-200 my-6"></div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BriefcaseBusiness className="w-4 h-4 text-rose-600" />
                  Manual Job Assignment
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Select Worker</Label>
                    <Select
                      value={jobAssignment.workerId}
                      onValueChange={(value) =>
                        setJobAssignment({ ...jobAssignment, workerId: value })
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Choose a no-phone worker" />
                      </SelectTrigger>
                      <SelectContent>
                        {noPhoneWorkers.map((worker) => (
                          <SelectItem key={worker.user_id} value={worker.user_id}>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-800">
                                {getWorkerAvatar(worker.name)}
                              </div>
                              {worker.name || `${worker.user_id.substring(0, 30)}`}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Select Job</Label>
                    <Select
                      value={jobAssignment.jobId}
                      onValueChange={(value) =>
                        setJobAssignment({ ...jobAssignment, jobId: value })
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Choose available job" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobs.length === 0 ? (
                          <SelectItem value="no-jobs" disabled>
                            No jobs available
                          </SelectItem>
                        ) : (
                          jobs.map((job) => (
                            <SelectItem key={job.id} value={job.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{job.title || `Job ${job.id}`}</span>
                                <span className="text-xs text-gray-500">{job.location} • ₹{job.wage}</span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    onClick={handleManualJobAssignment}
                    className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-md"
                    disabled={!jobAssignment.workerId || !jobAssignment.jobId}
                  >
                    Assign Job to Worker
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Worker Management Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 mb-8">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-indigo-600" />
                  Worker Management
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Manage all registered workers in your system
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400">
                    🔍
                  </div>
                  <Input
                    placeholder="Search workers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <span className="mr-2">⚡</span>
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Workers</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="smartphone">Smartphone</SelectItem>
                    <SelectItem value="feature_phone">Feature Phone</SelectItem>
                    <SelectItem value="no_phone">No Phone</SelectItem>
                  </SelectContent>
                </Select>
                
                <Dialog open={showRegisterWorker} onOpenChange={setShowRegisterWorker}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Worker
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <PlusCircle className="w-6 h-6 text-indigo-600" />
                        Register New Worker
                        <div className="ml-auto text-sm font-normal text-gray-500">
                          <span className="text-red-500">*</span> Required fields
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleRegisterWorker} className="space-y-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-xs text-indigo-600">1</span>
                          </span>
                          Basic Information
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="font-medium text-gray-900 flex items-center">
                              Worker Name
                              <RequiredStar />
                            </Label>
                            <Input
                              value={workerForm.name}
                              onChange={(e) =>
                                setWorkerForm({ ...workerForm, name: e.target.value })
                              }
                              placeholder="Enter full name"
                              className={`bg-gray-50 ${formErrors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'}`}
                            />
                            <ErrorMessage error={formErrors.name} />
                          </div>

                          <div className="space-y-2">
                            <Label className="font-medium text-gray-900 flex items-center">
                              Phone Type
                              <RequiredStar />
                            </Label>
                            <Select
                              value={workerForm.phone_type}
                              onValueChange={(value) =>
                                setWorkerForm({ ...workerForm, phone_type: value })
                              }
                            >
                              <SelectTrigger className={`bg-gray-50 ${formErrors.phone ? 'border-red-300' : 'border-gray-200'}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="smartphone" className="flex items-center gap-2">
                                  <span className="text-lg">📱</span> Smartphone
                                </SelectItem>
                                <SelectItem value="feature_phone" className="flex items-center gap-2">
                                  <span className="text-lg">☎️</span> Feature Phone
                                </SelectItem>
                                <SelectItem value="none" className="flex items-center gap-2">
                                  <span className="text-lg">📵</span> No Phone
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="text-xs text-gray-500 mt-1">
                              Select based on worker's device availability
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-xs text-indigo-600">2</span>
                          </span>
                          Contact Information
                        </h4>
                        
                        {workerForm.phone_type === "smartphone" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="font-medium text-gray-900 flex items-center">
                                Email Address
                                <RequiredStar />
                              </Label>
                              <Input
                                type="email"
                                value={workerForm.email}
                                onChange={(e) =>
                                  setWorkerForm({
                                    ...workerForm,
                                    email: e.target.value,
                                  })
                                }
                                placeholder="worker@example.com"
                                className={`bg-gray-50 ${formErrors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'}`}
                              />
                              <ErrorMessage error={formErrors.email} />
                              <div className="text-xs text-gray-500 mt-1">
                                Required for smartphone users
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="font-medium text-gray-900 flex items-center">
                                Password
                                <RequiredStar />
                              </Label>
                              <Input
                                type="password"
                                value={workerForm.password}
                                onChange={(e) =>
                                  setWorkerForm({
                                    ...workerForm,
                                    password: e.target.value,
                                  })
                                }
                                placeholder="Enter password"
                                className="bg-gray-50 border-gray-200"
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                Default: "default123" - can be changed later
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label className="font-medium text-gray-900 flex items-center">
                            Phone Number
                            <RequiredStar />
                          </Label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              +91
                            </div>
                            <Input
                              value={workerForm.phone}
                              onChange={handlePhoneChange}
                              placeholder="98765 43210"
                              className={`pl-12 bg-gray-50 ${formErrors.phone ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'}`}
                            />
                          </div>
                          <ErrorMessage error={formErrors.phone} />
                          <div className="text-xs text-gray-500 mt-1">
                            Enter 10-digit Indian mobile number. Example: 98765 43210
                          </div>
                        </div>
                      </div>

                      {/* Professional Information */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-xs text-indigo-600">3</span>
                          </span>
                          Professional Information
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="font-medium text-gray-900 flex items-center">
                              Experience (years)
                              <RequiredStar />
                            </Label>
                            <Input
                              value={workerForm.experience}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value === '' || parseInt(value) <= 50) {
                                  setWorkerForm({ ...workerForm, experience: value });
                                }
                              }}
                              placeholder="e.g. 2, 5, 10"
                              className={`bg-gray-50 ${formErrors.experience ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'}`}
                            />
                            <ErrorMessage error={formErrors.experience} />
                            <div className="text-xs text-gray-500 mt-1">
                              Enter years of experience (max 50)
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="font-medium text-gray-900 flex items-center">
                              Skills
                              <RequiredStar />
                            </Label>
                            <Input
                              value={workerForm.skills}
                              onChange={(e) =>
                                setWorkerForm({ ...workerForm, skills: e.target.value })
                              }
                              placeholder="Construction, Plumbing, Electrical, Carpentry"
                              className={`bg-gray-50 ${formErrors.skills ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'}`}
                            />
                            <ErrorMessage error={formErrors.skills} />
                            <div className="text-xs text-gray-500 mt-1">
                              Separate skills with commas
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="font-medium text-gray-900 flex items-center">
                            Location
                            <RequiredStar />
                          </Label>
                          <Input
                            value={workerForm.location}
                            onChange={(e) =>
                              setWorkerForm({
                                ...workerForm,
                                location: e.target.value,
                              })
                            }
                            placeholder="e.g. Mumbai, Andheri West"
                            className={`bg-gray-50 ${formErrors.location ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'}`}
                          />
                          <ErrorMessage error={formErrors.location} />
                          <div className="text-xs text-gray-500 mt-1">
                            City and area where worker is available
                          </div>
                        </div>
                      </div>

                      {/* Form Validation Summary */}
                      {(Object.values(formErrors).some(error => error !== "")) && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <h4 className="font-medium text-red-900">Please fix the following errors:</h4>
                          </div>
                          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                            {formErrors.name && <li>Worker name is required</li>}
                            {formErrors.email && <li>{formErrors.email}</li>}
                            {formErrors.phone && <li>{formErrors.phone}</li>}
                            {formErrors.experience && <li>Experience is required</li>}
                            {formErrors.skills && <li>Skills are required</li>}
                            {formErrors.location && <li>Location is required</li>}
                          </ul>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowRegisterWorker(false);
                            setFormErrors({
                              name: "",
                              email: "",
                              phone: "",
                              experience: "",
                              skills: "",
                              location: "",
                            });
                          }}
                          className="border-gray-300 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                        
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Registering...
                            </>
                          ) : (
                            <>
                              <PlusCircle className="w-4 h-4 mr-2" />
                              Register Worker
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredWorkers.length}</span> of <span className="font-semibold text-gray-900">{totalWorkers}</span> workers
                {searchQuery && (
                  <span className="text-indigo-600 ml-2">
                    • Search: "{searchQuery}"
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-indigo-200 text-indigo-700">
                  Newest First
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                </div>
                <p className="mt-4 text-gray-600 font-medium">Loading worker data...</p>
                <p className="text-sm text-gray-500">Please wait while we fetch the latest information</p>
              </div>
            ) : filteredWorkers.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No workers found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchQuery ? 'No workers match your search criteria. Try adjusting your search.' : 'Start by registering your first worker.'}
                </p>
                <Button 
                  onClick={() => setShowRegisterWorker(true)}
                  className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add First Worker
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWorkers.map((worker) => (
                    <Card 
                      key={worker.id}
                      className="hover:shadow-xl transition-all duration-300 border hover:border-indigo-200 bg-gradient-to-br from-white to-gray-50"
                    >
                      <CardContent className="p-6">
                        {/* Header with Avatar and Actions */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full border-2 border-white shadow-md flex items-center justify-center text-sm font-bold ${
                              worker.phone_type === "smartphone" ? "bg-emerald-100 text-emerald-800" :
                              worker.phone_type === "feature_phone" ? "bg-amber-100 text-amber-800" :
                              "bg-rose-100 text-rose-800"
                            }`}>
                              {getWorkerAvatar(worker.name)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">
                                {worker.name || `Worker ${worker.user_id.substring(0, 8)}`}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg">{getPhoneTypeIcon(worker.phone_type)}</span>
                                <Badge variant="outline" className={`text-xs border ${
                                  worker.phone_type === "smartphone" ? "border-emerald-200 text-emerald-700" :
                                  worker.phone_type === "feature_phone" ? "border-amber-200 text-amber-700" :
                                  "border-rose-200 text-rose-700"
                                }`}>
                                  {worker.phone_type === "smartphone" ? "Smartphone" :
                                   worker.phone_type === "feature_phone" ? "Feature Phone" : "No Phone"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Experience Badge */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 ${getExperienceColor(worker.experience)}`}>
                          <Award className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {worker.experience ? `${worker.experience} years` : 'Experience not specified'}
                          </span>
                        </div>

                        {/* Details Grid */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>Location</span>
                              </div>
                              <p className="font-medium text-gray-900 truncate">
                                {worker.location || "Not specified"}
                              </p>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <BriefcaseBusiness className="w-4 h-4" />
                                <span>Status</span>
                              </div>
                              <Badge 
                                className={`${worker.available ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                              >
                                {worker.available ? "Available" : "Busy"}
                              </Badge>
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="text-lg">🛠️</span>
                              <span>Skills</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {worker.skills?.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  {skill}
                                </Badge>
                              ))}
                              {worker.skills?.length > 3 && (
                                <Badge variant="outline" className="text-xs text-gray-500">
                                  +{worker.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Stats Row */}
                          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="font-bold text-gray-900">4.5</span>
                              </div>
                              <p className="text-xs text-gray-600">Rating</p>
                            </div>
                            <div className="text-center">
                              <p className="font-bold text-gray-900 mb-1">{worker.total_jobs || 0}</p>
                              <p className="text-xs text-gray-600">Jobs</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <Calendar className="w-3 h-3 text-gray-500" />
                                <span className="font-bold text-gray-900">
                                  {formatDate(worker.created_at)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">Joined</p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-gray-200 hover:bg-gray-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyWorkerId(worker.user_id);
                              }}
                            >
                              {copiedWorkerId === worker.user_id ? (
                                <Check className="w-3 h-3 mr-1 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3 mr-1" />
                              )}
                              Copy ID
                            </Button>
                            {/* Action Buttons - Add after the header */}
<div className="flex gap-1">
    <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
        onClick={() => openEditDialog(worker)}
        title="Edit Worker"
    >
        <Edit className="h-3 w-3" />
    </Button>
    <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
        onClick={() => openDeleteDialog(worker)}
        title="Delete Worker"
    >
        <Trash2 className="h-3 w-3" />
    </Button>
</div>


{/* Edit Worker Dialog */}
<Dialog open={showEditWorker} onOpenChange={setShowEditWorker}>
    <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
                Edit Worker
            </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleEditWorker} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                
                <div className="space-y-2">
                    <Label className="font-medium text-gray-900">Phone Type *</Label>
                    <Select
                        value={editWorkerForm.phone_type}
                        onValueChange={(value) => setEditWorkerForm({ ...editWorkerForm, phone_type: value })}
                    >
                        <SelectTrigger className="bg-gray-50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="smartphone">Smartphone</SelectItem>
                            <SelectItem value="feature_phone">Feature Phone</SelectItem>
                            <SelectItem value="none">No Phone</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {editWorkerForm.phone_type === "smartphone" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="font-medium text-gray-900">Email Address</Label>
                        <Input
                            type="email"
                            value={editWorkerForm.email}
                            onChange={(e) => setEditWorkerForm({ ...editWorkerForm, email: e.target.value })}
                            className="bg-gray-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="font-medium text-gray-900">New Password (Optional)</Label>
                        <Input
                            type="password"
                            value={editWorkerForm.password}
                            onChange={(e) => setEditWorkerForm({ ...editWorkerForm, password: e.target.value })}
                            placeholder="Leave empty to keep current"
                            className="bg-gray-50"
                        />
                    </div>
                </div>
            )}
            
            <div className="space-y-2">
  <Label className="font-medium text-gray-900">Phone Number *</Label>
  <div className="relative">
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
      +91
    </div>
    <Input
      value={editWorkerForm.phone}
      onChange={handleEditPhoneChange}  // ← Use the new handler
      placeholder="98765 43210"
      className={`pl-12 bg-gray-50 ${editFormErrors.phone ? 'border-red-300' : 'border-gray-200'}`}
    />
  </div>
  {editFormErrors.phone && (
    <div className="flex items-center gap-1 mt-1">
      <AlertCircle className="w-3 h-3 text-red-500" />
      <p className="text-xs text-red-600">{editFormErrors.phone}</p>
    </div>
  )}
  <div className="text-xs text-gray-500 mt-1">
    Enter 10-digit Indian mobile number. Example: 98765 43210
  </div>
</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="font-medium text-gray-900">Experience (years)</Label>
                    <Input
                        value={editWorkerForm.experience}
                        onChange={(e) => setEditWorkerForm({ ...editWorkerForm, experience: e.target.value })}
                        placeholder="e.g. 5"
                        className="bg-gray-50"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label className="font-medium text-gray-900">Location</Label>
                    <Input
                        value={editWorkerForm.location}
                        onChange={(e) => setEditWorkerForm({ ...editWorkerForm, location: e.target.value })}
                        placeholder="e.g. Mumbai"
                        className="bg-gray-50"
                    />
                </div>
            </div>
            
            <div className="space-y-2">
                <Label className="font-medium text-gray-900">Skills (comma separated)</Label>
                <Input
                    value={editWorkerForm.skills}
                    onChange={(e) => setEditWorkerForm({ ...editWorkerForm, skills: e.target.value })}
                    placeholder="Construction, Plumbing, Electrical"
                    className="bg-gray-50"
                />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowEditWorker(false)}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                    {loading ? "Updating..." : "Update Worker"}
                </Button>
            </div>
        </form>
    </DialogContent>
</Dialog>

{/* Delete Confirmation Dialog */}
<Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
    <DialogContent className="max-w-md bg-white">
        <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Delete Worker</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg">
                <p className="font-medium text-gray-900">Are you sure you want to delete this worker?</p>
                <p className="text-sm text-gray-600 mt-1">This action cannot be undone.</p>
            </div>
            {workerToDelete && (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold">{workerToDelete.name}</p>
                    <p className="text-sm text-gray-600">{workerToDelete.phone}</p>
                </div>
            )}
        </div>
        <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteWorker} disabled={loading}>
                {loading ? "Deleting..." : "Delete Worker"}
            </Button>
        </DialogFooter>
    </DialogContent>
</Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Show More/Less Buttons */}
                {totalWorkers > 0 && filteredWorkers.length > 0 && (
                  <div className="flex flex-col items-center gap-4 mt-8">
                    {totalWorkers > 6 && workers.length < totalWorkers && (
                      <Button
                        onClick={handleShowMore}
                        disabled={isLoadingMore}
                        className="px-8 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                      >
                        {isLoadingMore ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-5 h-5 mr-2" />
                            Load More Workers ({totalWorkers - workers.length} remaining)
                          </>
                        )}
                      </Button>
                    )}

                    {workers.length > 6 && (
                      <Button
                        onClick={handleShowLess}
                        variant="outline"
                        className="px-8 h-12 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300"
                      >
                        <ChevronUp className="w-5 h-5 mr-2" />
                        Show Less (Back to 6)
                      </Button>
                    )}

                    <div className="text-sm text-gray-600">
                      Showing {workers.length} of {totalWorkers} workers
                      {allWorkers.length > 0 && ` • Newest: ${formatDate(allWorkers[0].created_at)}`}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg">
                  <UserCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Attendance</p>
                  <p className="text-2xl font-bold text-gray-900">{attendance.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(allWorkers.length * 0.3) || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                  <span className="text-lg">₹</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Wage</p>
                  <p className="text-2xl font-bold text-gray-900">₹850/day</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "sonner";
// import {
//   Users,
//   Briefcase,
//   Calendar,
//   LogOut,
//   PlusCircle,
//   QrCode,
//   UserCheck,
//   Phone,
//   PhoneOff,
//   Star,
//   MapPin,
//   BriefcaseBusiness,
//   Award,
//   ChevronDown,
//   ChevronUp,
//   Loader2,
//   Copy,
//   Check,
// } from "lucide-react";

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const API = `${BACKEND_URL}/api`;

// const AdminDashboard = ({ user, onLogout }) => {
//   const navigate = useNavigate();
//   const [stats, setStats] = useState({});
//   const [workers, setWorkers] = useState([]);
//   const [allWorkers, setAllWorkers] = useState([]);
//   const [attendance, setAttendance] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [jobs, setJobs] = useState([]);
//   const [showRegisterWorker, setShowRegisterWorker] = useState(false);
//   const [jobAssignment, setJobAssignment] = useState({
//     workerId: "",
//     jobId: "",
//   });
//   const [workerForm, setWorkerForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     phone_type: "smartphone",
//     experience: "",
//     skills: "",
//     location: "",
//     password: "default123",
//   });

//   // Pagination states
//   const [visibleWorkers, setVisibleWorkers] = useState(6);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [totalWorkers, setTotalWorkers] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
  
//   // State for tracking copied worker IDs
//   const [copiedWorkerId, setCopiedWorkerId] = useState(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       const [statsRes, workersRes, attendanceRes, jobsRes] = await Promise.all([
//         axios.get(`${API}/stats/dashboard`),
//         axios.get(`${API}/workers?limit=1000`), // Get all workers for now
//         axios.get(`${API}/attendance/today`),
//         axios.get(`${API}/jobs`),
//       ]);

//       setStats(statsRes.data);
      
//       // Sort workers by created_at in descending order (newest first)
//       const sortedWorkers = [...workersRes.data].sort((a, b) => {
//         if (a.created_at && b.created_at) {
//           return new Date(b.created_at) - new Date(a.created_at);
//         }
//         return 0;
//       });
      
//       setAllWorkers(sortedWorkers);
//       setTotalWorkers(sortedWorkers.length);
      
//       // Set initial visible workers
//       setWorkers(sortedWorkers.slice(0, visibleWorkers));
      
//       setAttendance(attendanceRes.data);
//       setJobs(jobsRes.data);

//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch dashboard data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleShowMore = () => {
//     setIsLoadingMore(true);
    
//     // Show loading for better UX
//     setTimeout(() => {
//       const newVisibleCount = visibleWorkers + 6;
//       setVisibleWorkers(newVisibleCount);
//       setWorkers(allWorkers.slice(0, newVisibleCount));
//       setIsLoadingMore(false);
//     }, 300);
//   };

//   const handleShowLess = () => {
//     setVisibleWorkers(6);
//     setWorkers(allWorkers.slice(0, 6));
//   };

//   // Function to copy worker ID to clipboard
//   const copyWorkerId = (workerId) => {
//     navigator.clipboard.writeText(workerId)
//       .then(() => {
//         setCopiedWorkerId(workerId);
//         toast.success("Worker ID copied to clipboard!");
        
//         // Reset the copied state after 2 seconds
//         setTimeout(() => {
//           setCopiedWorkerId(null);
//         }, 2000);
//       })
//       .catch((err) => {
//         console.error("Failed to copy: ", err);
//         toast.error("Failed to copy Worker ID");
//       });
//   };

//   const handleRegisterWorker = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const skillsArray = workerForm.skills
//         .split(",")
//         .map((s) => s.trim())
//         .filter(Boolean);

//       const payload = {
//         ...workerForm,
//         skills: skillsArray,
//       };

//       if (workerForm.phone_type !== "smartphone") {
//         payload.email = null;
//         payload.password = null;
//       }

//       await axios.post(`${API}/workers/register`, payload);

//       toast.success("Worker registered successfully!");
//       setShowRegisterWorker(false);

//       setWorkerForm({
//         name: "",
//         email: "",
//         phone: "",
//         phone_type: "smartphone",
//         experience: "",
//         skills: "",
//         location: "",
//         password: "default123",
//       });

//       // Refresh data to show new worker at the top
//       fetchData();
//     } catch (error) {
//       toast.error(error.response?.data?.detail || "Failed to register worker");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleManualJobAssignment = async () => {
//     if (!jobAssignment.workerId || !jobAssignment.jobId) {
//       toast.error("Please select both worker and job");
//       return;
//     }
//     console.log(jobAssignment);

//     try {
//       await axios.post(`${API}/jobs/assign`, {
//         worker_id: jobAssignment.workerId,
//         job_id: jobAssignment.jobId,
//         manually_assigned: true,
//       });

//       toast.success("Job assigned successfully!");
//       setJobAssignment({ workerId: "", jobId: "" });
//       fetchData();
//     } catch (error) {
//       toast.error(error.response?.data?.detail || "Failed to assign job");
//     }
//   };

//   // Filter workers by phone type
//   const smartphoneWorkers = allWorkers.filter(
//     (w) => w.phone_type === "smartphone"
//   );
//   const featurePhoneWorkers = allWorkers.filter(
//     (w) => w.phone_type === "feature_phone"
//   );
//   const noPhoneWorkers = allWorkers.filter((w) => w.phone_type === "none");

//   // Format date for display
//   const formatDate = (isoString) => {
//     if (!isoString) return 'Recently';
//     const date = new Date(isoString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   return (
//     <div
//       className="min-h-screen"
//       data-testid="admin-dashboard"
//       style={{
//         background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
//       }}
//     >
//       {/* Header */}
//       <header className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Admin Dashboard
//             </h1>
//             <p className="text-sm text-gray-600">Welcome, {user.name}</p>
//           </div>
//           <div className="flex space-x-3">
//             <Button
//               onClick={() => navigate("/admin/kiosk")}
//               data-testid="kiosk-btn"
//               style={{
//                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                 color: "white",
//                 border: "none",
//               }}
//             >
//               <QrCode className="w-4 h-4 mr-2" />
//               Open Kiosk
//             </Button>
//             <Button
//               variant="outline"
//               onClick={onLogout}
//               data-testid="logout-btn"
//               style={{
//                 borderColor: "#667eea",
//                 color: "#667eea",
//               }}
//             >
//               <LogOut className="w-4 h-4 mr-2" />
//               Logout
//             </Button>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats Cards */}
//         <div className="grid md:grid-cols-4 gap-6 mb-8">
//           <Card className="p-6 bg-white/80 backdrop-blur-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Workers</p>
//                 <p className="text-3xl font-bold text-gray-900">
//                   {stats.total_workers || 0}
//                 </p>
//               </div>
//               <Users className="w-10 h-10 text-blue-600 opacity-20" />
//             </div>
//           </Card>

//           <Card className="p-6 bg-white/80 backdrop-blur-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Present Today</p>
//                 <p className="text-3xl font-bold text-green-600">
//                   {stats.present_today || 0}
//                 </p>
//               </div>
//               <UserCheck className="w-10 h-10 text-green-600 opacity-20" />
//             </div>
//           </Card>

//           <Card className="p-6 bg-white/80 backdrop-blur-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Active Jobs</p>
//                 <p className="text-3xl font-bold text-purple-600">
//                   {stats.active_jobs || 0}
//                 </p>
//               </div>
//               <Briefcase className="w-10 h-10 text-purple-600 opacity-20" />
//             </div>
//           </Card>

//           <Card className="p-6 bg-white/80 backdrop-blur-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Employers</p>
//                 <p className="text-3xl font-bold text-orange-600">
//                   {stats.total_employers || 0}
//                 </p>
//               </div>
//               <Briefcase className="w-10 h-10 text-orange-600 opacity-20" />
//             </div>
//           </Card>
//         </div>

//         {/* Workers by Phone Type Section */}
//         <div className="mb-8">
//           <Card className="mb-6 bg-white/90 backdrop-blur-sm">
//             <CardHeader>
//               <CardTitle className="text-2xl font-bold text-gray-900">
//                 Workers by Phone Type
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                 <Card className="bg-gradient-to-br from-green-50 to-white">
//                   <CardContent className="p-6">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center space-x-2">
//                         <Phone className="w-5 h-5 text-green-600" />
//                         <h3 className="font-semibold text-gray-900">
//                           Smartphone Users
//                         </h3>
//                       </div>
//                       <Badge
//                         variant="default"
//                         className="text-lg"
//                         style={{
//                           background:
//                             "linear-gradient(135deg, #10b981 0%, #059669 100%)",
//                           color: "white",
//                         }}
//                       >
//                         {smartphoneWorkers.length}
//                       </Badge>
//                     </div>
//                     <p className="text-sm text-gray-600">
//                       Can access app independently
//                     </p>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-gradient-to-br from-yellow-50 to-white">
//                   <CardContent className="p-6">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center space-x-2">
//                         <Phone className="w-5 h-5 text-yellow-600" />
//                         <h3 className="font-semibold text-gray-900">
//                           Feature Phone Users
//                         </h3>
//                       </div>
//                       <Badge
//                         variant="secondary"
//                         className="text-lg"
//                         style={{
//                           background:
//                             "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
//                           color: "white",
//                         }}
//                       >
//                         {featurePhoneWorkers.length}
//                       </Badge>
//                     </div>
//                     <p className="text-sm text-gray-600">
//                       Limited app access, SMS-based
//                     </p>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-gradient-to-br from-red-50 to-white">
//                   <CardContent className="p-6">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center space-x-2">
//                         <PhoneOff className="w-5 h-5 text-red-600" />
//                         <h3 className="font-semibold text-gray-900">
//                           No Phone Users
//                         </h3>
//                       </div>
//                       <Badge
//                         variant="destructive"
//                         className="text-lg"
//                         style={{
//                           background:
//                             "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
//                           color: "white",
//                         }}
//                       >
//                         {noPhoneWorkers.length}
//                       </Badge>
//                     </div>
//                     <p className="text-sm text-gray-600">
//                       Require manual assistance
//                     </p>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Manual Job Assignment Section */}
//               <div
//                 className="p-6 rounded-lg border"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
//                   borderColor: "#93c5fd",
//                 }}
//               >
//                 <h3 className="text-xl font-bold text-gray-900 mb-4">
//                   Manual Job Assignment (For No-Phone Workers)
//                 </h3>
//                 <p className="text-gray-600 mb-6">
//                   Assign jobs to workers who don't have phones.
//                 </p>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                   <div>
//                     <Label className="font-semibold mb-2 block text-gray-900">
//                       Select Worker
//                     </Label>
//                     <Select
//                       value={jobAssignment.workerId}
//                       onValueChange={(value) =>
//                         setJobAssignment({ ...jobAssignment, workerId: value })
//                       }
//                     >
//                       <SelectTrigger
//                         className="bg-white"
//                         style={{
//                           borderColor: "#93c5fd",
//                         }}
//                       >
//                         <SelectValue placeholder="Choose a worker" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {noPhoneWorkers.map((worker) => (
//                           <SelectItem
//                             key={worker.user_id}
//                             value={worker.user_id}
//                           >
//                             {worker.name || `Worker ${worker.user_id.substring(0, 8)}`}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <Label className="font-semibold mb-2 block text-gray-900">
//                       Select Job
//                     </Label>
//                     <Select
//                       value={jobAssignment.jobId}
//                       onValueChange={(value) =>
//                         setJobAssignment({ ...jobAssignment, jobId: value })
//                       }
//                     >
//                       <SelectTrigger
//                         className="bg-white"
//                         style={{
//                           borderColor: "#93c5fd",
//                         }}
//                       >
//                         <SelectValue placeholder="Choose a job" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {jobs.length === 0 ? (
//                           <SelectItem value="no-jobs" disabled>
//                             No jobs available
//                           </SelectItem>
//                         ) : (
//                           jobs.map((job) => (
//                             <SelectItem key={job.id} value={job.id}>
//                               {job.title || job.job_type || `Job ${job.id}`}
//                             </SelectItem>
//                           ))
//                         )}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="flex items-end">
//                     <Button
//                       onClick={handleManualJobAssignment}
//                       className="w-full"
//                       disabled={!jobAssignment.workerId || !jobAssignment.jobId}
//                       style={{
//                         background:
//                           "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                         color: "white",
//                         border: "none",
//                       }}
//                     >
//                       Assign Job
//                     </Button>
//                   </div>
//                 </div>

//                 <div
//                   className="border-t pt-4"
//                   style={{ borderColor: "#93c5fd" }}
//                 >
//                   <p className="text-sm" style={{ color: "#1e40af" }}>
//                     <strong>Note:</strong> This feature is specifically for
//                     workers without mobile phones. They will be notified through
//                     alternate means.
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* All Registered Workers Section */}
//         <div>
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900">
//                 All Registered Workers
//               </h2>
//               <p className="text-sm text-gray-600 mt-1">
//                 Newest workers appear first • Showing {workers.length} of {totalWorkers} workers
//               </p>
//             </div>
//             <Dialog
//               open={showRegisterWorker}
//               onOpenChange={setShowRegisterWorker}
//             >
//               <DialogTrigger asChild>
//                 <Button
//                   data-testid="register-worker-btn"
//                   style={{
//                     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                     color: "white",
//                     border: "none",
//                   }}
//                 >
//                   <PlusCircle className="w-5 h-5 mr-2" />
//                   Register Worker
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="max-w-2xl bg-white">
//                 <DialogHeader>
//                   <DialogTitle className="text-gray-900">
//                     Register New Worker
//                   </DialogTitle>
//                 </DialogHeader>
//                 <form onSubmit={handleRegisterWorker} className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <Label className="text-gray-900">Worker Name</Label>
//                       <Input
//                         value={workerForm.name}
//                         onChange={(e) =>
//                           setWorkerForm({ ...workerForm, name: e.target.value })
//                         }
//                         required
//                         data-testid="worker-name-input"
//                         className="bg-white"
//                       />
//                     </div>

//                     <div>
//                       <Label className="text-gray-900">Phone Type</Label>
//                       <Select
//                         value={workerForm.phone_type}
//                         onValueChange={(value) =>
//                           setWorkerForm({ ...workerForm, phone_type: value })
//                         }
//                       >
//                         <SelectTrigger
//                           data-testid="phone-type-select"
//                           className="bg-white"
//                         >
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="smartphone">Smartphone</SelectItem>
//                           <SelectItem value="feature_phone">
//                             Feature Phone
//                           </SelectItem>
//                           <SelectItem value="none">No Phone</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   {workerForm.phone_type === "smartphone" && (
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <Label className="text-gray-900">Email</Label>
//                         <Input
//                           type="email"
//                           value={workerForm.email}
//                           onChange={(e) =>
//                             setWorkerForm({
//                               ...workerForm,
//                               email: e.target.value,
//                             })
//                           }
//                           required
//                           data-testid="worker-email-input"
//                           className="bg-white"
//                         />
//                       </div>
//                       <div>
//                         <Label className="text-gray-900">Password</Label>
//                         <Input
//                           type="password"
//                           value={workerForm.password}
//                           onChange={(e) =>
//                             setWorkerForm({
//                               ...workerForm,
//                               password: e.target.value,
//                             })
//                           }
//                           required
//                           data-testid="worker-password-input"
//                           className="bg-white"
//                         />
//                       </div>
//                     </div>
//                   )}

//                   <div>
//                     <Label className="text-gray-900">Phone Number</Label>
//                     <Input
//                       value={workerForm.phone}
//                       onChange={(e) =>
//                         setWorkerForm({ ...workerForm, phone: e.target.value })
//                       }
//                       placeholder="+91XXXXXXXXXX"
//                       data-testid="worker-phone-input"
//                       className="bg-white"
//                     />
//                   </div>

//                   <div>
//                     <Label className="text-gray-900">Experience (in years)</Label>
//                     <Input
//                       value={workerForm.experience}
//                       onChange={(e) =>
//                         setWorkerForm({ ...workerForm, experience: e.target.value })
//                       }
//                       placeholder="e.g. 2, 5, 10"
//                       data-testid="worker-experience-input"
//                       className="bg-white"
//                     />
//                   </div>

//                   <div>
//                     <Label className="text-gray-900">
//                       Skills (comma separated)
//                     </Label>
//                     <Input
//                       value={workerForm.skills}
//                       onChange={(e) =>
//                         setWorkerForm({ ...workerForm, skills: e.target.value })
//                       }
//                       placeholder="e.g. Construction, Plumbing, Electrical"
//                       required
//                       data-testid="worker-skills-input"
//                       className="bg-white"
//                     />
//                   </div>

//                   <div>
//                     <Label className="text-gray-900">Location</Label>
//                     <Input
//                       value={workerForm.location}
//                       onChange={(e) =>
//                         setWorkerForm({
//                           ...workerForm,
//                           location: e.target.value,
//                         })
//                       }
//                       placeholder="e.g. Mumbai, Andheri"
//                       required
//                       data-testid="worker-location-input"
//                       className="bg-white"
//                     />
//                   </div>

//                   <Button
//                     type="submit"
//                     className="w-full"
//                     disabled={loading}
//                     data-testid="submit-worker-btn"
//                     style={{
//                       background: loading
//                         ? "#cbd5e1"
//                         : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                       color: "white",
//                       border: "none",
//                     }}
//                   >
//                     {loading ? "Registering..." : "Register Worker"}
//                   </Button>
//                 </form>
//               </DialogContent>
//             </Dialog>
//           </div>

//           {isLoading ? (
//             <div className="flex justify-center items-center py-12">
//               <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
//               <span className="ml-2 text-gray-600">Loading workers...</span>
//             </div>
//           ) : workers.length === 0 ? (
//             <Card className="py-12 text-center bg-white/80 backdrop-blur-sm">
//               <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
//               <h3 className="text-lg font-medium text-gray-900">No workers registered yet</h3>
//               <p className="text-gray-600 mt-1">Register your first worker to get started</p>
//             </Card>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {workers.map((worker) => (
//                   <Card
//                     key={worker.id}
//                     className="hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm"
//                   >
//                     <CardHeader className="pb-3">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <CardTitle className="text-lg text-gray-900">
//                             {worker.name || `Worker ${worker.user_id.substring(0, 8)}`}
//                           </CardTitle>
//                           <p className="text-sm text-gray-600">
//                             {worker.skills?.join(", ") || "General Labor"}
//                           </p>
//                         </div>
//                         <Badge
//                           variant={
//                             worker.phone_type === "smartphone"
//                               ? "default"
//                               : worker.phone_type === "feature_phone"
//                               ? "secondary"
//                               : "destructive"
//                           }
//                           style={
//                             worker.phone_type === "smartphone"
//                               ? {
//                                   background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
//                                   color: "white",
//                                 }
//                               : worker.phone_type === "feature_phone"
//                               ? {
//                                   background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
//                                   color: "white",
//                                 }
//                               : {
//                                   background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
//                                   color: "white",
//                                 }
//                           }
//                         >
//                           {worker.phone_type === "smartphone"
//                             ? "📱"
//                             : worker.phone_type === "feature_phone"
//                             ? "☎️"
//                             : "📵"}{" "}
//                           {worker.phone_type}
//                         </Badge>
//                       </div>
//                     </CardHeader>

//                     <CardContent className="space-y-3">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <Award className="w-4 h-4 text-gray-500" />
//                           <span className="text-sm text-gray-700">Experience:</span>
//                         </div>
//                         <span className="font-medium text-gray-900">
//                           {worker.experience ? `${worker.experience} years` : "Not specified"}
//                         </span>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <MapPin className="w-4 h-4 text-gray-500" />
//                           <span className="text-sm text-gray-700">Location:</span>
//                         </div>
//                         <span className="font-medium text-gray-900">
//                           {worker.location || "Not specified"}
//                         </span>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <Star className="w-4 h-4 text-gray-500" />
//                           <span className="text-sm text-gray-700">Rating:</span>
//                         </div>
//                         <div className="flex items-center space-x-1">
//                           <span className="font-medium text-gray-900">4.5</span>
//                           <div className="flex">
//                             {[...Array(5)].map((_, i) => (
//                               <Star
//                                 key={i}
//                                 className="w-3 h-3 text-yellow-500 fill-current"
//                               />
//                             ))}
//                           </div>
//                           <span className="text-sm text-gray-600">
//                             ({worker.total_jobs || 0} jobs)
//                           </span>
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <BriefcaseBusiness className="w-4 h-4 text-gray-500" />
//                           <span className="text-sm text-gray-700">Status:</span>
//                         </div>
//                         <Badge
//                           variant={worker.available ? "default" : "secondary"}
//                           style={
//                             worker.available
//                               ? {
//                                   background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
//                                   color: "white",
//                                 }
//                               : {
//                                   background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
//                                   color: "white",
//                                 }
//                           }
//                         >
//                           {worker.available ? "Available" : "Busy"}
//                         </Badge>
//                       </div>

//                       {/* Registration Date */}
//                       <div className="flex items-center justify-between pt-3 border-t border-gray-200">
//                         <div className="flex items-center space-x-2">
//                           <Calendar className="w-4 h-4 text-gray-500" />
//                           <span className="text-sm text-gray-700">Registered:</span>
//                         </div>
//                         <span className="text-sm font-medium text-gray-900">
//                           {formatDate(worker.created_at)}
//                         </span>
//                       </div>

//                       {/* Worker ID with Copy Button */}
//                       <div className="pt-4 border-t border-gray-200">
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm text-gray-600">Worker ID:</span>
//                           <div className="flex items-center space-x-2">
//                             <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-900 max-w-[120px] truncate">
//                               {worker.user_id.substring(0, 12)}...
//                             </code>
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               onClick={() => copyWorkerId(worker.user_id)}
//                               className="h-8 w-8 p-0 hover:bg-gray-100"
//                               title="Copy Worker ID"
//                             >
//                               {copiedWorkerId === worker.user_id ? (
//                                 <Check className="w-3 h-3 text-green-600" />
//                               ) : (
//                                 <Copy className="w-3 h-3 text-gray-500" />
//                               )}
//                             </Button>
//                           </div>
//                         </div>
                        
//                         {/* Optional: Full ID display on hover */}
//                         <div className="mt-1 text-xs text-gray-500 text-center">
//                           Click copy icon to copy full ID
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>

//               {/* Show More/Less Buttons */}
//               {totalWorkers > 0 && (
//                 <div className="flex flex-col items-center gap-4 mt-8">
//                   {totalWorkers > 6 && workers.length < totalWorkers && (
//                     <Button
//                       onClick={handleShowMore}
//                       disabled={isLoadingMore}
//                       className="px-8"
//                       style={{
//                         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                         color: "white",
//                         border: "none",
//                       }}
//                     >
//                       {isLoadingMore ? (
//                         <>
//                           <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                           Loading...
//                         </>
//                       ) : (
//                         <>
//                           <ChevronDown className="w-5 h-5 mr-2" />
//                           Show More Workers ({totalWorkers - workers.length} more)
//                         </>
//                       )}
//                     </Button>
//                   )}

//                   {workers.length > 6 && (
//                     <Button
//                       onClick={handleShowLess}
//                       variant="outline"
//                       className="px-8"
//                       style={{
//                         borderColor: "#667eea",
//                         color: "#667eea",
//                       }}
//                     >
//                       <ChevronUp className="w-5 h-5 mr-2" />
//                       Show Less (Back to 6)
//                     </Button>
//                   )}

//                   <div className="text-sm text-gray-600">
//                     Showing {workers.length} of {totalWorkers} workers
//                     {allWorkers.length > 0 && ` • Newest: ${formatDate(allWorkers[0].created_at)}`}
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;




// ======= Image Admin dashboard ==========

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "sonner";
// import {
//   Users,
//   Briefcase,
//   Calendar,
//   LogOut,
//   PlusCircle,
//   QrCode,
//   UserCheck,
//   Phone,
//   PhoneOff,
//   Star,
//   MapPin,
//   BriefcaseBusiness,
//   Award,
//   ChevronDown,
//   ChevronUp,
//   Loader2,
//   Copy,
//   Check,
//   Edit,
//   Trash2,
//   User,
//   Upload,
//   X,
// } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const API = `${BACKEND_URL}/api`;

// const AdminDashboard = ({ user, onLogout }) => {
//   const navigate = useNavigate();
//   const [stats, setStats] = useState({});
//   const [workers, setWorkers] = useState([]);
//   const [allWorkers, setAllWorkers] = useState([]);
//   const [attendance, setAttendance] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [jobs, setJobs] = useState([]);
//   const [showRegisterWorker, setShowRegisterWorker] = useState(false);
//   const [showEditWorker, setShowEditWorker] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [workerToDelete, setWorkerToDelete] = useState(null);
//   const [workerToEdit, setWorkerToEdit] = useState(null);
//   const [jobAssignment, setJobAssignment] = useState({
//     workerId: "",
//     jobId: "",
//   });
//   const [workerForm, setWorkerForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     phone_type: "smartphone",
//     experience: "",
//     skills: "",
//     location: "",
//     password: "default123",
//     avatar: null,
//   });
//   const [editWorkerForm, setEditWorkerForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     phone_type: "smartphone",
//     experience: "",
//     skills: "",
//     location: "",
//     password: "",
//     avatar: null,
//     avatar_preview: "",
//   });

//   // Pagination states
//   const [visibleWorkers, setVisibleWorkers] = useState(6);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [totalWorkers, setTotalWorkers] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedFilter, setSelectedFilter] = useState("all");
  
//   // State for tracking copied worker IDs
//   const [copiedWorkerId, setCopiedWorkerId] = useState(null);
//   const [uploadingImage, setUploadingImage] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       const [statsRes, workersRes, attendanceRes, jobsRes] = await Promise.all([
//         axios.get(`${API}/stats/dashboard`),
//         axios.get(`${API}/workers?limit=1000`),
//         axios.get(`${API}/attendance/today`),
//         axios.get(`${API}/jobs`),
//       ]);

//       setStats(statsRes.data);
      
//       // Sort workers by created_at in descending order (newest first)
//       const sortedWorkers = [...workersRes.data].sort((a, b) => {
//         if (a.created_at && b.created_at) {
//           return new Date(b.created_at) - new Date(a.created_at);
//         }
//         return 0;
//       });
      
//       setAllWorkers(sortedWorkers);
//       setTotalWorkers(sortedWorkers.length);
      
//       // Set initial visible workers
//       setWorkers(sortedWorkers.slice(0, visibleWorkers));
      
//       setAttendance(attendanceRes.data);
//       setJobs(jobsRes.data);

//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch dashboard data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleShowMore = () => {
//     setIsLoadingMore(true);
    
//     setTimeout(() => {
//       const newVisibleCount = visibleWorkers + 6;
//       setVisibleWorkers(newVisibleCount);
//       setWorkers(allWorkers.slice(0, newVisibleCount));
//       setIsLoadingMore(false);
//     }, 300);
//   };

//   const handleShowLess = () => {
//     setVisibleWorkers(6);
//     setWorkers(allWorkers.slice(0, 6));
//   };

//   const copyWorkerId = (workerId) => {
//     navigator.clipboard.writeText(workerId)
//       .then(() => {
//         setCopiedWorkerId(workerId);
//         toast.success("Worker ID copied to clipboard!");
        
//         setTimeout(() => {
//           setCopiedWorkerId(null);
//         }, 2000);
//       })
//       .catch((err) => {
//         console.error("Failed to copy: ", err);
//         toast.error("Failed to copy Worker ID");
//       });
//   };

//   const handleRegisterWorker = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const skillsArray = workerForm.skills
//         .split(",")
//         .map((s) => s.trim())
//         .filter(Boolean);

//       const formData = new FormData();
//       formData.append("name", workerForm.name);
//       formData.append("phone", workerForm.phone);
//       formData.append("phone_type", workerForm.phone_type);
//       formData.append("experience", workerForm.experience);
//       formData.append("skills", JSON.stringify(skillsArray));
//       formData.append("location", workerForm.location);
      
//       if (workerForm.phone_type === "smartphone") {
//         formData.append("email", workerForm.email);
//         formData.append("password", workerForm.password);
//       }

//       if (workerForm.avatar) {
//         formData.append("avatar", workerForm.avatar);
//       }

//       await axios.post(`${API}/workers/register`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       toast.success("Worker registered successfully!");
//       setShowRegisterWorker(false);

//       setWorkerForm({
//         name: "",
//         email: "",
//         phone: "",
//         phone_type: "smartphone",
//         experience: "",
//         skills: "",
//         location: "",
//         password: "default123",
//         avatar: null,
//       });

//       fetchData();
//     } catch (error) {
//       toast.error(error.response?.data?.detail || "Failed to register worker");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditWorker = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const skillsArray = editWorkerForm.skills
//         .split(",")
//         .map((s) => s.trim())
//         .filter(Boolean);

//       const formData = new FormData();
//       formData.append("name", editWorkerForm.name);
//       formData.append("phone", editWorkerForm.phone);
//       formData.append("phone_type", editWorkerForm.phone_type);
//       formData.append("experience", editWorkerForm.experience);
//       formData.append("skills", JSON.stringify(skillsArray));
//       formData.append("location", editWorkerForm.location);
      
//       if (editWorkerForm.phone_type === "smartphone") {
//         formData.append("email", editWorkerForm.email);
//         if (editWorkerForm.password) {
//           formData.append("password", editWorkerForm.password);
//         }
//       }

//       if (editWorkerForm.avatar && typeof editWorkerForm.avatar !== 'string') {
//         formData.append("avatar", editWorkerForm.avatar);
//       }

//       await axios.put(`${API}/workers/${workerToEdit.user_id}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       toast.success("Worker updated successfully!");
//       setShowEditWorker(false);
//       setWorkerToEdit(null);
//       fetchData();
//     } catch (error) {
//       toast.error(error.response?.data?.detail || "Failed to update worker");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteWorker = async () => {
//     if (!workerToDelete) return;

//     setLoading(true);
//     try {
//       await axios.delete(`${API}/workers/${workerToDelete.user_id}`);
//       toast.success("Worker deleted successfully!");
//       setShowDeleteConfirm(false);
//       setWorkerToDelete(null);
//       fetchData();
//     } catch (error) {
//       toast.error(error.response?.data?.detail || "Failed to delete worker");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleManualJobAssignment = async () => {
//     if (!jobAssignment.workerId || !jobAssignment.jobId) {
//       toast.error("Please select both worker and job");
//       return;
//     }

//     try {
//       await axios.post(`${API}/jobs/assign`, {
//         worker_id: jobAssignment.workerId,
//         job_id: jobAssignment.jobId,
//         manually_assigned: true,
//       });

//       toast.success("Job assigned successfully!");
//       setJobAssignment({ workerId: "", jobId: "" });
//       fetchData();
//     } catch (error) {
//       toast.error(error.response?.data?.detail || "Failed to assign job");
//     }
//   };

//   // Filter workers by phone type
//   const smartphoneWorkers = allWorkers.filter(
//     (w) => w.phone_type === "smartphone"
//   );
//   const featurePhoneWorkers = allWorkers.filter(
//     (w) => w.phone_type === "feature_phone"
//   );
//   const noPhoneWorkers = allWorkers.filter((w) => w.phone_type === "none");

//   const getWorkerAvatar = (worker) => {
//     if (worker.avatar_url) {
//       return worker.avatar_url;
//     }
    
//     if (!worker.name) return null;
//     const initials = worker.name
//       .split(" ")
//       .map(word => word[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//     return initials;
//   };

//   const formatDate = (isoString) => {
//     if (!isoString) return 'Recently';
//     const date = new Date(isoString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const getExperienceColor = (experience) => {
//     if (!experience) return "bg-gray-100 text-gray-700";
//     const expNum = parseInt(experience) || 0;
//     if (expNum >= 10) return "bg-purple-100 text-purple-800";
//     if (expNum >= 5) return "bg-blue-100 text-blue-800";
//     if (expNum >= 2) return "bg-green-100 text-green-800";
//     return "bg-yellow-100 text-yellow-800";
//   };

//   const filteredWorkers = workers.filter(worker => {
//     const matchesSearch = searchQuery === "" || 
//       worker.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       worker.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
//       worker.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
//     const matchesFilter = selectedFilter === "all" ||
//       (selectedFilter === "available" && worker.available) ||
//       (selectedFilter === "smartphone" && worker.phone_type === "smartphone") ||
//       (selectedFilter === "feature_phone" && worker.phone_type === "feature_phone") ||
//       (selectedFilter === "no_phone" && worker.phone_type === "none");
    
//     return matchesSearch && matchesFilter;
//   });

//   const getPhoneTypeIcon = (type) => {
//     switch(type) {
//       case "smartphone": return "📱";
//       case "feature_phone": return "☎️";
//       case "none": return "📵";
//       default: return "📱";
//     }
//   };

//   const handleImageUpload = (e, isEdit = false) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) { // 5MB limit
//         toast.error("Image size should be less than 5MB");
//         return;
//       }

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         if (isEdit) {
//           setEditWorkerForm({
//             ...editWorkerForm,
//             avatar: file,
//             avatar_preview: reader.result,
//           });
//         } else {
//           setWorkerForm({
//             ...workerForm,
//             avatar: file,
//           });
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const openEditDialog = (worker) => {
//     setWorkerToEdit(worker);
//     setEditWorkerForm({
//       name: worker.name || "",
//       email: worker.email || "",
//       phone: worker.phone || "",
//       phone_type: worker.phone_type || "smartphone",
//       experience: worker.experience || "",
//       skills: Array.isArray(worker.skills) ? worker.skills.join(", ") : worker.skills || "",
//       location: worker.location || "",
//       password: "",
//       avatar: worker.avatar_url || null,
//       avatar_preview: worker.avatar_url || "",
//     });
//     setShowEditWorker(true);
//   };

//   const openDeleteDialog = (worker) => {
//     setWorkerToDelete(worker);
//     setShowDeleteConfirm(true);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div className="flex items-center space-x-4">
//               <div className="hidden md:block p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
//                 <Briefcase className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">
//                   Admin Dashboard
//                 </h1>
//                 <div className="flex items-center gap-2 mt-1">
//                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                   <p className="text-sm text-gray-600">Welcome back, <span className="font-semibold text-gray-900">{user.name}</span></p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border border-indigo-100">
//                 <Calendar className="w-4 h-4 text-indigo-600" />
//                 <span className="text-sm font-medium text-indigo-700">
//                   {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                 </span>
//               </div>
              
//               <Button
//                 onClick={() => navigate("/admin/kiosk")}
//                 className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
//               >
//                 <QrCode className="w-4 h-4 mr-2" />
//                 Open Kiosk
//               </Button>
              
//               <Button
//                 variant="outline"
//                 onClick={onLogout}
//                 className="border-gray-300 hover:bg-gray-50 hover:border-gray-400"
//               >
//                 <LogOut className="w-4 h-4 mr-2" />
//                 Logout
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50 shadow-md">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 mb-2">Total Workers</p>
//                   <p className="text-3xl font-bold text-gray-900">
//                     {stats.total_workers || 0}
//                   </p>
//                   <div className="flex items-center gap-2 mt-2">
//                     <span className="text-sm text-green-600">+12% this month</span>
//                   </div>
//                 </div>
//                 <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
//                   <Users className="w-8 h-8 text-blue-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-emerald-50 shadow-md">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 mb-2">Present Today</p>
//                   <p className="text-3xl font-bold text-emerald-600">
//                     {stats.present_today || 0}
//                   </p>
//                   <div className="mt-2">
//                     <div className="w-full bg-emerald-100 rounded-full h-2">
//                       <div 
//                         className="bg-emerald-500 h-2 rounded-full" 
//                         style={{ width: `${(stats.present_today || 0) / (stats.total_workers || 1) * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
//                   <UserCheck className="w-8 h-8 text-emerald-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50 shadow-md">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 mb-2">Active Jobs</p>
//                   <p className="text-3xl font-bold text-purple-600">
//                     {stats.active_jobs || 0}
//                   </p>
//                   <div className="flex items-center gap-2 mt-2">
//                     <span className="text-sm text-gray-600">Open positions</span>
//                   </div>
//                 </div>
//                 <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
//                   <Briefcase className="w-8 h-8 text-purple-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-orange-50 shadow-md">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 mb-2">Employers</p>
//                   <p className="text-3xl font-bold text-orange-600">
//                     {stats.total_employers || 0}
//                   </p>
//                   <div className="flex items-center gap-2 mt-2">
//                     <span className="text-sm text-gray-600">Registered companies</span>
//                   </div>
//                 </div>
//                 <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl">
//                   <Users className="w-8 h-8 text-orange-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Quick Actions & Phone Type Distribution */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//           {/* Phone Type Cards */}
//           <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-xl">
//                 <Phone className="w-5 h-5 text-indigo-600" />
//                 Device Distribution
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="p-2 bg-emerald-100 rounded-lg">
//                       <span className="text-2xl">📱</span>
//                     </div>
//                     <Badge className="bg-emerald-600 text-white px-3 py-1 text-lg font-bold">
//                       {smartphoneWorkers.length}
//                     </Badge>
//                   </div>
//                   <h3 className="font-semibold text-gray-900 mb-2">Smartphone Users</h3>
//                   <p className="text-sm text-gray-600 mb-4">Full app access & self-service</p>
//                   <div className="flex items-center gap-2 text-sm">
//                     <div className="w-full bg-emerald-100 rounded-full h-2">
//                       <div 
//                         className="bg-emerald-500 h-2 rounded-full" 
//                         style={{ width: `${(smartphoneWorkers.length / allWorkers.length) * 100 || 0}%` }}
//                       ></div>
//                     </div>
//                     <span className="font-medium text-emerald-700">
//                       {allWorkers.length > 0 ? Math.round((smartphoneWorkers.length / allWorkers.length) * 100) : 0}%
//                     </span>
//                   </div>
//                 </div>

//                 <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-100">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="p-2 bg-amber-100 rounded-lg">
//                       <span className="text-2xl">☎️</span>
//                     </div>
//                     <Badge className="bg-amber-600 text-white px-3 py-1 text-lg font-bold">
//                       {featurePhoneWorkers.length}
//                     </Badge>
//                   </div>
//                   <h3 className="font-semibold text-gray-900 mb-2">Feature Phone Users</h3>
//                   <p className="text-sm text-gray-600 mb-4">SMS-based communication</p>
//                   <div className="flex items-center gap-2 text-sm">
//                     <div className="w-full bg-amber-100 rounded-full h-2">
//                       <div 
//                         className="bg-amber-500 h-2 rounded-full" 
//                         style={{ width: `${(featurePhoneWorkers.length / allWorkers.length) * 100 || 0}%` }}
//                       ></div>
//                     </div>
//                     <span className="font-medium text-amber-700">
//                       {allWorkers.length > 0 ? Math.round((featurePhoneWorkers.length / allWorkers.length) * 100) : 0}%
//                     </span>
//                   </div>
//                 </div>

//                 <div className="p-5 rounded-xl bg-gradient-to-br from-rose-50 to-white border border-rose-100">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="p-2 bg-rose-100 rounded-lg">
//                       <span className="text-2xl">📵</span>
//                     </div>
//                     <Badge className="bg-rose-600 text-white px-3 py-1 text-lg font-bold">
//                       {noPhoneWorkers.length}
//                     </Badge>
//                   </div>
//                   <h3 className="font-semibold text-gray-900 mb-2">No Phone Users</h3>
//                   <p className="text-sm text-gray-600 mb-4">Manual assistance required</p>
//                   <div className="flex items-center gap-2 text-sm">
//                     <div className="w-full bg-rose-100 rounded-full h-2">
//                       <div 
//                         className="bg-rose-500 h-2 rounded-full" 
//                         style={{ width: `${(noPhoneWorkers.length / allWorkers.length) * 100 || 0}%` }}
//                       ></div>
//                     </div>
//                     <span className="font-medium text-rose-700">
//                       {allWorkers.length > 0 ? Math.round((noPhoneWorkers.length / allWorkers.length) * 100) : 0}%
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Quick Actions */}
//           <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-xl">
//                 <Briefcase className="w-5 h-5 text-indigo-600" />
//                 Quick Actions
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 <Button 
//                   onClick={() => setShowRegisterWorker(true)}
//                   className="w-full justify-start h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
//                 >
//                   <PlusCircle className="w-4 h-4 mr-3" />
//                   Register New Worker
//                 </Button>
                
//                 <Button 
//                   variant="outline"
//                   className="w-full justify-start h-12 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
//                   onClick={() => navigate("/admin/kiosk")}
//                 >
//                   <QrCode className="w-4 h-4 mr-3" />
//                   Open Attendance Kiosk
//                 </Button>
//               </div>
              
//               <div className="border-t border-gray-200 my-6"></div>
              
//               <div className="space-y-4">
//                 <h4 className="font-semibold text-gray-900 flex items-center gap-2">
//                   <BriefcaseBusiness className="w-4 h-4 text-rose-600" />
//                   Manual Job Assignment
//                 </h4>
                
//                 <div className="space-y-4">
//                   <div>
//                     <Label className="text-sm font-medium mb-2 block">Select Worker</Label>
//                     <Select
//                       value={jobAssignment.workerId}
//                       onValueChange={(value) =>
//                         setJobAssignment({ ...jobAssignment, workerId: value })
//                       }
//                     >
//                       <SelectTrigger className="bg-white">
//                         <SelectValue placeholder="Choose a no-phone worker" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {noPhoneWorkers.map((worker) => (
//                           <SelectItem key={worker.user_id} value={worker.user_id}>
//                             <div className="flex items-center gap-2">
//                               <Avatar className="h-6 w-6">
//                                 {worker.avatar_url ? (
//                                   <AvatarImage src={worker.avatar_url} />
//                                 ) : (
//                                   <AvatarFallback className="text-xs">
//                                     {getWorkerAvatar(worker)}
//                                   </AvatarFallback>
//                                 )}
//                               </Avatar>
//                               {worker.name || `Worker ${worker.user_id.substring(0, 8)}`}
//                             </div>
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <Label className="text-sm font-medium mb-2 block">Select Job</Label>
//                     <Select
//                       value={jobAssignment.jobId}
//                       onValueChange={(value) =>
//                         setJobAssignment({ ...jobAssignment, jobId: value })
//                       }
//                     >
//                       <SelectTrigger className="bg-white">
//                         <SelectValue placeholder="Choose available job" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {jobs.length === 0 ? (
//                           <SelectItem value="no-jobs" disabled>
//                             No jobs available
//                           </SelectItem>
//                         ) : (
//                           jobs.map((job) => (
//                             <SelectItem key={job.id} value={job.id}>
//                               <div className="flex flex-col">
//                                 <span className="font-medium">{job.title || `Job ${job.id}`}</span>
//                                 <span className="text-xs text-gray-500">{job.location} • ₹{job.wage}</span>
//                               </div>
//                             </SelectItem>
//                           ))
//                         )}
//                       </SelectContent>
//                     </Select>
//                   </div>
                  
//                   <Button
//                     onClick={handleManualJobAssignment}
//                     className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-md"
//                     disabled={!jobAssignment.workerId || !jobAssignment.jobId}
//                   >
//                     Assign Job to Worker
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Worker Management Section */}
//         <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 mb-8">
//           <CardHeader className="pb-4">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//               <div>
//                 <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//                   <Users className="w-6 h-6 text-indigo-600" />
//                   Worker Management
//                 </CardTitle>
//                 <p className="text-sm text-gray-600 mt-2">
//                   Manage all registered workers in your system
//                 </p>
//               </div>
              
//               <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//                 <div className="relative flex-1 sm:flex-none">
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400">
//                     🔍
//                   </div>
//                   <Input
//                     placeholder="Search workers..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="pl-10 w-full sm:w-64"
//                   />
//                 </div>
                
//                 <Select value={selectedFilter} onValueChange={setSelectedFilter}>
//                   <SelectTrigger className="w-full sm:w-40">
//                     <span className="mr-2">⚡</span>
//                     <SelectValue placeholder="Filter by" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Workers</SelectItem>
//                     <SelectItem value="available">Available</SelectItem>
//                     <SelectItem value="smartphone">Smartphone</SelectItem>
//                     <SelectItem value="feature_phone">Feature Phone</SelectItem>
//                     <SelectItem value="no_phone">No Phone</SelectItem>
//                   </SelectContent>
//                 </Select>
                
//                 <Dialog open={showRegisterWorker} onOpenChange={setShowRegisterWorker}>
//                   <DialogTrigger asChild>
//                     <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md">
//                       <PlusCircle className="w-4 h-4 mr-2" />
//                       Add Worker
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="max-w-2xl bg-white">
//                     <DialogHeader>
//                       <DialogTitle className="text-2xl font-bold text-gray-900">
//                         Register New Worker
//                       </DialogTitle>
//                     </DialogHeader>
//                     <form onSubmit={handleRegisterWorker} className="space-y-6">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label className="font-medium text-gray-900">Worker Name *</Label>
//                           <Input
//                             value={workerForm.name}
//                             onChange={(e) =>
//                               setWorkerForm({ ...workerForm, name: e.target.value })
//                             }
//                             required
//                             placeholder="Enter full name"
//                             className="bg-gray-50 border-gray-200"
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <Label className="font-medium text-gray-900">Phone Type *</Label>
//                           <Select
//                             value={workerForm.phone_type}
//                             onValueChange={(value) =>
//                               setWorkerForm({ ...workerForm, phone_type: value })
//                             }
//                           >
//                             <SelectTrigger className="bg-gray-50 border-gray-200">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="smartphone">Smartphone</SelectItem>
//                               <SelectItem value="feature_phone">Feature Phone</SelectItem>
//                               <SelectItem value="none">No Phone</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>

//                       {workerForm.phone_type === "smartphone" && (
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div className="space-y-2">
//                             <Label className="font-medium text-gray-900">Email Address *</Label>
//                             <Input
//                               type="email"
//                               value={workerForm.email}
//                               onChange={(e) =>
//                                 setWorkerForm({
//                                   ...workerForm,
//                                   email: e.target.value,
//                                 })
//                               }
//                               required
//                               placeholder="worker@example.com"
//                               className="bg-gray-50 border-gray-200"
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label className="font-medium text-gray-900">Password *</Label>
//                             <Input
//                               type="password"
//                               value={workerForm.password}
//                               onChange={(e) =>
//                                 setWorkerForm({
//                                   ...workerForm,
//                                   password: e.target.value,
//                                 })
//                               }
//                               required
//                               placeholder="Enter password"
//                               className="bg-gray-50 border-gray-200"
//                             />
//                           </div>
//                         </div>
//                       )}

//                       <div className="space-y-2">
//                         <Label className="font-medium text-gray-900">Phone Number *</Label>
//                         <Input
//                           value={workerForm.phone}
//                           onChange={(e) =>
//                             setWorkerForm({ ...workerForm, phone: e.target.value })
//                           }
//                           placeholder="+91 98765 43210"
//                           className="bg-gray-50 border-gray-200"
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label className="font-medium text-gray-900">Profile Picture</Label>
//                         <div className="flex items-center gap-4">
//                           <div className="relative">
//                             <Avatar className="h-20 w-20">
//                               {workerForm.avatar ? (
//                                 <AvatarImage src={URL.createObjectURL(workerForm.avatar)} />
//                               ) : (
//                                 <AvatarFallback className="text-lg">
//                                   <User className="h-10 w-10" />
//                                 </AvatarFallback>
//                               )}
//                             </Avatar>
//                             {workerForm.avatar && (
//                               <Button
//                                 type="button"
//                                 size="sm"
//                                 variant="destructive"
//                                 className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
//                                 onClick={() => setWorkerForm({ ...workerForm, avatar: null })}
//                               >
//                                 <X className="h-3 w-3" />
//                               </Button>
//                             )}
//                           </div>
//                           <div>
//                             <Label htmlFor="avatar-upload" className="cursor-pointer">
//                               <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
//                                 <Upload className="h-4 w-4" />
//                                 <span>Upload Photo</span>
//                               </div>
//                               <Input
//                                 id="avatar-upload"
//                                 type="file"
//                                 accept="image/*"
//                                 className="hidden"
//                                 onChange={(e) => handleImageUpload(e, false)}
//                               />
//                             </Label>
//                             <p className="text-xs text-gray-500 mt-1">Max 5MB. JPG, PNG, or GIF</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <Label className="font-medium text-gray-900">Experience (in years)</Label>
//                         <Input
//                           value={workerForm.experience}
//                           onChange={(e) =>
//                             setWorkerForm({ ...workerForm, experience: e.target.value })
//                           }
//                           placeholder="e.g. 2, 5, 10"
//                           className="bg-gray-50 border-gray-200"
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label className="font-medium text-gray-900">Skills (comma separated) *</Label>
//                         <Input
//                           value={workerForm.skills}
//                           onChange={(e) =>
//                             setWorkerForm({ ...workerForm, skills: e.target.value })
//                           }
//                           placeholder="Construction, Plumbing, Electrical, Carpentry"
//                           required
//                           className="bg-gray-50 border-gray-200"
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label className="font-medium text-gray-900">Location *</Label>
//                         <Input
//                           value={workerForm.location}
//                           onChange={(e) =>
//                             setWorkerForm({
//                               ...workerForm,
//                               location: e.target.value,
//                             })
//                           }
//                           placeholder="e.g. Mumbai, Andheri West"
//                           required
//                           className="bg-gray-50 border-gray-200"
//                         />
//                       </div>

//                       <div className="flex justify-end pt-4">
//                         <Button
//                           type="submit"
//                           className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
//                           disabled={loading}
//                         >
//                           {loading ? (
//                             <>
//                               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                               Registering...
//                             </>
//                           ) : (
//                             <>
//                               <PlusCircle className="w-4 h-4 mr-2" />
//                               Register Worker
//                             </>
//                           )}
//                         </Button>
//                       </div>
//                     </form>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             </div>
            
//             <div className="flex items-center justify-between mt-4">
//               <p className="text-sm text-gray-600">
//                 Showing <span className="font-semibold text-gray-900">{filteredWorkers.length}</span> of <span className="font-semibold text-gray-900">{totalWorkers}</span> workers
//                 {searchQuery && (
//                   <span className="text-indigo-600 ml-2">
//                     • Search: "{searchQuery}"
//                   </span>
//                 )}
//               </p>
//               <div className="flex items-center gap-2">
//                 <Badge variant="outline" className="border-indigo-200 text-indigo-700">
//                   Newest First
//                 </Badge>
//               </div>
//             </div>
//           </CardHeader>

//           <CardContent>
//             {isLoading ? (
//               <div className="flex flex-col items-center justify-center py-16">
//                 <div className="relative">
//                   <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
//                 </div>
//                 <p className="mt-4 text-gray-600 font-medium">Loading worker data...</p>
//                 <p className="text-sm text-gray-500">Please wait while we fetch the latest information</p>
//               </div>
//             ) : filteredWorkers.length === 0 ? (
//               <div className="text-center py-16">
//                 <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
//                   <Users className="w-10 h-10 text-gray-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">No workers found</h3>
//                 <p className="text-gray-600 max-w-md mx-auto">
//                   {searchQuery ? 'No workers match your search criteria. Try adjusting your search.' : 'Start by registering your first worker.'}
//                 </p>
//                 <Button 
//                   onClick={() => setShowRegisterWorker(true)}
//                   className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
//                 >
//                   <PlusCircle className="w-4 h-4 mr-2" />
//                   Add First Worker
//                 </Button>
//               </div>
//             ) : (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredWorkers.map((worker) => (
//                     <Card 
//                       key={worker.id}
//                       className="hover:shadow-xl transition-all duration-300 border hover:border-indigo-200 bg-gradient-to-br from-white to-gray-50"
//                     >
//                       <CardContent className="p-6">
//                         {/* Header with Avatar and Actions */}
//                         <div className="flex justify-between items-start mb-4">
//                           <div className="flex items-center gap-3">
//                             <Avatar className="h-12 w-12 border-2 border-white shadow-md">
//                               {worker.avatar_url ? (
//                                 <AvatarImage src={worker.avatar_url} />
//                               ) : (
//                                 <AvatarFallback className={`text-sm font-bold ${
//                                   worker.phone_type === "smartphone" ? "bg-emerald-100 text-emerald-800" :
//                                   worker.phone_type === "feature_phone" ? "bg-amber-100 text-amber-800" :
//                                   "bg-rose-100 text-rose-800"
//                                 }`}>
//                                   {getWorkerAvatar(worker)}
//                                 </AvatarFallback>
//                               )}
//                             </Avatar>
//                             <div>
//                               <h3 className="font-bold text-gray-900">
//                                 {worker.name || `Worker ${worker.user_id.substring(0, 8)}`}
//                               </h3>
//                               <div className="flex items-center gap-2 mt-1">
//                                 <span className="text-lg">{getPhoneTypeIcon(worker.phone_type)}</span>
//                                 <Badge variant="outline" className={`text-xs border ${
//                                   worker.phone_type === "smartphone" ? "border-emerald-200 text-emerald-700" :
//                                   worker.phone_type === "feature_phone" ? "border-amber-200 text-amber-700" :
//                                   "border-rose-200 text-rose-700"
//                                 }`}>
//                                   {worker.phone_type === "smartphone" ? "Smartphone" :
//                                    worker.phone_type === "feature_phone" ? "Feature Phone" : "No Phone"}
//                                 </Badge>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="flex gap-1">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
//                               onClick={() => openEditDialog(worker)}
//                               title="Edit Worker"
//                             >
//                               <Edit className="h-3 w-3" />
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
//                               onClick={() => openDeleteDialog(worker)}
//                               title="Delete Worker"
//                             >
//                               <Trash2 className="h-3 w-3" />
//                             </Button>
//                           </div>
//                         </div>

//                         {/* Experience Badge */}
//                         <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 ${getExperienceColor(worker.experience)}`}>
//                           <Award className="w-4 h-4" />
//                           <span className="text-sm font-medium">
//                             {worker.experience ? `${worker.experience} years` : 'Experience not specified'}
//                           </span>
//                         </div>

//                         {/* Details Grid */}
//                         <div className="space-y-3">
//                           <div className="grid grid-cols-2 gap-3">
//                             <div className="space-y-1">
//                               <div className="flex items-center gap-2 text-sm text-gray-600">
//                                 <MapPin className="w-4 h-4" />
//                                 <span>Location</span>
//                               </div>
//                               <p className="font-medium text-gray-900 truncate">
//                                 {worker.location || "Not specified"}
//                               </p>
//                             </div>
                            
//                             <div className="space-y-1">
//                               <div className="flex items-center gap-2 text-sm text-gray-600">
//                                 <BriefcaseBusiness className="w-4 h-4" />
//                                 <span>Status</span>
//                               </div>
//                               <Badge 
//                                 className={`${worker.available ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
//                               >
//                                 {worker.available ? "Available" : "Busy"}
//                               </Badge>
//                             </div>
//                           </div>

//                           {/* Skills */}
//                           <div className="space-y-1">
//                             <div className="flex items-center gap-2 text-sm text-gray-600">
//                               <span className="text-lg">🛠️</span>
//                               <span>Skills</span>
//                             </div>
//                             <div className="flex flex-wrap gap-1.5">
//                               {worker.skills?.slice(0, 3).map((skill, index) => (
//                                 <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
//                                   {skill}
//                                 </Badge>
//                               ))}
//                               {worker.skills?.length > 3 && (
//                                 <Badge variant="outline" className="text-xs text-gray-500">
//                                   +{worker.skills.length - 3} more
//                                 </Badge>
//                               )}
//                             </div>
//                           </div>

//                           {/* Stats Row */}
//                           <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
//                             <div className="text-center">
//                               <div className="flex items-center justify-center gap-1 mb-1">
//                                 <Star className="w-3 h-3 text-yellow-500 fill-current" />
//                                 <span className="font-bold text-gray-900">4.5</span>
//                               </div>
//                               <p className="text-xs text-gray-600">Rating</p>
//                             </div>
//                             <div className="text-center">
//                               <p className="font-bold text-gray-900 mb-1">{worker.total_jobs || 0}</p>
//                               <p className="text-xs text-gray-600">Jobs</p>
//                             </div>
//                             <div className="text-center">
//                               <div className="flex items-center justify-center gap-1 mb-1">
//                                 <Calendar className="w-3 h-3 text-gray-500" />
//                                 <span className="font-bold text-gray-900">
//                                   {formatDate(worker.created_at)}
//                                 </span>
//                               </div>
//                               <p className="text-xs text-gray-600">Joined</p>
//                             </div>
//                           </div>

//                           {/* Action Buttons */}
//                           <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               className="h-8 border-gray-200 hover:bg-gray-50"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 copyWorkerId(worker.user_id);
//                               }}
//                             >
//                               {copiedWorkerId === worker.user_id ? (
//                                 <Check className="w-3 h-3 mr-1 text-green-600" />
//                               ) : (
//                                 <Copy className="w-3 h-3 mr-1" />
//                               )}
//                               Copy ID
//                             </Button>
//                             <div className="text-xs text-gray-500">
//                               ID: {worker.user_id.substring(0, 8)}...
//                             </div>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>

//                 {/* Show More/Less Buttons */}
//                 {totalWorkers > 0 && filteredWorkers.length > 0 && (
//                   <div className="flex flex-col items-center gap-4 mt-8">
//                     {totalWorkers > 6 && workers.length < totalWorkers && (
//                       <Button
//                         onClick={handleShowMore}
//                         disabled={isLoadingMore}
//                         className="px-8 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
//                       >
//                         {isLoadingMore ? (
//                           <>
//                             <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                             Loading...
//                           </>
//                         ) : (
//                           <>
//                             <ChevronDown className="w-5 h-5 mr-2" />
//                             Load More Workers ({totalWorkers - workers.length} remaining)
//                           </>
//                         )}
//                       </Button>
//                     )}

//                     {workers.length > 6 && (
//                       <Button
//                         onClick={handleShowLess}
//                         variant="outline"
//                         className="px-8 h-12 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300"
//                       >
//                         <ChevronUp className="w-5 h-5 mr-2" />
//                         Show Less (Back to 6)
//                       </Button>
//                     )}

//                     <div className="text-sm text-gray-600">
//                       Showing {workers.length} of {totalWorkers} workers
//                       {allWorkers.length > 0 && ` • Newest: ${formatDate(allWorkers[0].created_at)}`}
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </CardContent>
//         </Card>

//         {/* Edit Worker Dialog */}
//         <Dialog open={showEditWorker} onOpenChange={setShowEditWorker}>
//           <DialogContent className="max-w-2xl bg-white">
//             <DialogHeader>
//               <DialogTitle className="text-2xl font-bold text-gray-900">
//                 Edit Worker
//               </DialogTitle>
//             </DialogHeader>
//             <form onSubmit={handleEditWorker} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label className="font-medium text-gray-900">Worker Name *</Label>
//                   <Input
//                     value={editWorkerForm.name}
//                     onChange={(e) =>
//                       setEditWorkerForm({ ...editWorkerForm, name: e.target.value })
//                     }
//                     required
//                     placeholder="Enter full name"
//                     className="bg-gray-50 border-gray-200"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="font-medium text-gray-900">Phone Type *</Label>
//                   <Select
//                     value={editWorkerForm.phone_type}
//                     onValueChange={(value) =>
//                       setEditWorkerForm({ ...editWorkerForm, phone_type: value })
//                     }
//                   >
//                     <SelectTrigger className="bg-gray-50 border-gray-200">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="smartphone">Smartphone</SelectItem>
//                       <SelectItem value="feature_phone">Feature Phone</SelectItem>
//                       <SelectItem value="none">No Phone</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               {editWorkerForm.phone_type === "smartphone" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label className="font-medium text-gray-900">Email Address *</Label>
//                     <Input
//                       type="email"
//                       value={editWorkerForm.email}
//                       onChange={(e) =>
//                         setEditWorkerForm({
//                           ...editWorkerForm,
//                           email: e.target.value,
//                         })
//                       }
//                       required
//                       placeholder="worker@example.com"
//                       className="bg-gray-50 border-gray-200"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="font-medium text-gray-900">New Password (Leave empty to keep current)</Label>
//                     <Input
//                       type="password"
//                       value={editWorkerForm.password}
//                       onChange={(e) =>
//                         setEditWorkerForm({
//                           ...editWorkerForm,
//                           password: e.target.value,
//                         })
//                       }
//                       placeholder="Enter new password"
//                       className="bg-gray-50 border-gray-200"
//                     />
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <Label className="font-medium text-gray-900">Phone Number *</Label>
//                 <Input
//                   value={editWorkerForm.phone}
//                   onChange={(e) =>
//                     setEditWorkerForm({ ...editWorkerForm, phone: e.target.value })
//                   }
//                   placeholder="+91 98765 43210"
//                   className="bg-gray-50 border-gray-200"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label className="font-medium text-gray-900">Profile Picture</Label>
//                 <div className="flex items-center gap-4">
//                   <div className="relative">
//                     <Avatar className="h-20 w-20">
//                       {editWorkerForm.avatar_preview ? (
//                         <AvatarImage src={editWorkerForm.avatar_preview} />
//                       ) : (
//                         <AvatarFallback className="text-lg">
//                           <User className="h-10 w-10" />
//                         </AvatarFallback>
//                       )}
//                     </Avatar>
//                     {editWorkerForm.avatar && (
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="destructive"
//                         className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
//                         onClick={() => setEditWorkerForm({ ...editWorkerForm, avatar: null, avatar_preview: "" })}
//                       >
//                         <X className="h-3 w-3" />
//                       </Button>
//                     )}
//                   </div>
//                   <div>
//                     <Label htmlFor="edit-avatar-upload" className="cursor-pointer">
//                       <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
//                         <Upload className="h-4 w-4" />
//                         <span>{editWorkerForm.avatar_preview ? 'Change Photo' : 'Upload Photo'}</span>
//                       </div>
//                       <Input
//                         id="edit-avatar-upload"
//                         type="file"
//                         accept="image/*"
//                         className="hidden"
//                         onChange={(e) => handleImageUpload(e, true)}
//                       />
//                     </Label>
//                     <p className="text-xs text-gray-500 mt-1">Max 5MB. JPG, PNG, or GIF</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label className="font-medium text-gray-900">Experience (in years)</Label>
//                 <Input
//                   value={editWorkerForm.experience}
//                   onChange={(e) =>
//                     setEditWorkerForm({ ...editWorkerForm, experience: e.target.value })
//                   }
//                   placeholder="e.g. 2, 5, 10"
//                   className="bg-gray-50 border-gray-200"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label className="font-medium text-gray-900">Skills (comma separated) *</Label>
//                 <Input
//                   value={editWorkerForm.skills}
//                   onChange={(e) =>
//                     setEditWorkerForm({ ...editWorkerForm, skills: e.target.value })
//                   }
//                   placeholder="Construction, Plumbing, Electrical, Carpentry"
//                   required
//                   className="bg-gray-50 border-gray-200"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label className="font-medium text-gray-900">Location *</Label>
//                 <Input
//                   value={editWorkerForm.location}
//                   onChange={(e) =>
//                     setEditWorkerForm({
//                       ...editWorkerForm,
//                       location: e.target.value,
//                     })
//                   }
//                   placeholder="e.g. Mumbai, Andheri West"
//                   required
//                   className="bg-gray-50 border-gray-200"
//                 />
//               </div>

//               <div className="flex justify-end pt-4 gap-3">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setShowEditWorker(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       Updating...
//                     </>
//                   ) : (
//                     <>
//                       <Edit className="w-4 h-4 mr-2" />
//                       Update Worker
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </DialogContent>
//         </Dialog>

//         {/* Delete Confirmation Dialog */}
//         <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
//           <DialogContent className="max-w-md bg-white">
//             <DialogHeader>
//               <DialogTitle className="text-xl font-bold text-gray-900">
//                 Delete Worker
//               </DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
//                 <div className="p-2 bg-red-100 rounded-full">
//                   <Trash2 className="h-5 w-5 text-red-600" />
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-900">Are you sure you want to delete this worker?</p>
//                   <p className="text-sm text-gray-600 mt-1">
//                     This action cannot be undone. All worker data, attendance records, and job assignments will be permanently removed.
//                   </p>
//                 </div>
//               </div>
              
//               {workerToDelete && (
//                 <div className="p-4 bg-gray-50 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <Avatar className="h-12 w-12">
//                       {workerToDelete.avatar_url ? (
//                         <AvatarImage src={workerToDelete.avatar_url} />
//                       ) : (
//                         <AvatarFallback>
//                           {getWorkerAvatar(workerToDelete)}
//                         </AvatarFallback>
//                       )}
//                     </Avatar>
//                     <div>
//                       <p className="font-semibold text-gray-900">{workerToDelete.name}</p>
//                       <p className="text-sm text-gray-600">{workerToDelete.phone}</p>
//                       <p className="text-xs text-gray-500">ID: {workerToDelete.user_id.substring(0, 12)}...</p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             <DialogFooter className="gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setShowDeleteConfirm(false);
//                   setWorkerToDelete(null);
//                 }}
//                 disabled={loading}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="destructive"
//                 onClick={handleDeleteWorker}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     Deleting...
//                   </>
//                 ) : (
//                   <>
//                     <Trash2 className="w-4 h-4 mr-2" />
//                     Delete Worker
//                   </>
//                 )}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Footer Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-sm">
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg">
//                   <UserCheck className="w-6 h-6 text-emerald-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Today's Attendance</p>
//                   <p className="text-2xl font-bold text-gray-900">{attendance.length || 0}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-sm">
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
//                   <Calendar className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">This Month</p>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {Math.round(allWorkers.length * 0.3) || 0}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-sm">
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
//                   <span className="text-lg">₹</span>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Avg. Wage</p>
//                   <p className="text-2xl font-bold text-gray-900">₹850/day</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;