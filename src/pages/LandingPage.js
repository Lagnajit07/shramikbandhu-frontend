
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import {
//   Users,
//   Briefcase,
//   UserCheck,
//   ArrowRight,
//   CheckCircle2,
//   Phone,
//   TrendingUp,
//   Smartphone,
//   Shield,
//   MessageSquare,
//   QrCode,
//   Cpu,
//   Bell,
//   Sparkles,
//   Zap,
//   Target,
//   BarChart3,
//   Heart,
//   Star,
//   ChevronRight,
//   PlayCircle
// } from 'lucide-react';

// const LandingPage = ({ user }) => {
//   const navigate = useNavigate();
//   const [activeFeature, setActiveFeature] = useState(0);
//   const [scrollY, setScrollY] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrollY(window.scrollY);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const features = [
//     {
//       icon: <Phone />,
//       title: "Truly Inclusive",
//       description: "Works for smartphone, feature phone, and no-phone users through SMS, IVR, and admin kiosk",
//       color: "from-[#667eea] to-[#764BA2]",
//       stats: "100% Coverage"
//     },
//     {
//       icon: <TrendingUp />,
//       title: "Smart Matching",
//       description: "AI-powered algorithm ensures fair job distribution based on skills, ratings, and rotation",
//       color: "from-[#764BA2] to-[#667eea]",
//       stats: "95% Match Rate"
//     },
//     {
//       icon: <Smartphone />,
//       title: "Instant Notifications",
//       description: "Real-time job alerts via app, SMS, or IVR calls based on worker's phone type",
//       color: "from-[#667eea] to-[#8b5cf6]",
//       stats: "< 30s Response"
//     },
//     {
//       icon: <Shield />,
//       title: "Transparent & Secure",
//       description: "Track job history, ratings, and payments. Build trust through verified feedback",
//       color: "from-[#764BA2] to-[#8b5cf6]",
//       stats: "0% Fraud"
//     }
//   ];

//   const methods = [
//     {
//       icon: <Smartphone className="w-8 h-8" />,
//       title: "Smartphone App",
//       description: "Workers with smartphones get instant job notifications, can apply directly, and manage their work history.",
//       features: [
//         "Real-time job alerts",
//         "Easy job application",
//         "Work history tracking",
//         "Digital payment tracking"
//       ],
//       color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
//       iconColor: "text-emerald-100"
//     },
//     {
//       icon: <MessageSquare className="w-8 h-8" />,
//       title: "SMS & IVR",
//       description: "Feature phone users receive job offers via SMS and can respond with simple text messages or IVR calls.",
//       features: [
//         "SMS job notifications",
//         "Simple text responses",
//         "IVR call confirmation",
//         "Voice-based interface"
//       ],
//       color: "bg-gradient-to-br from-blue-500 to-blue-600",
//       iconColor: "text-blue-100"
//     },
//     {
//       icon: <QrCode className="w-8 h-8" />,
//       title: "QR ID Cards",
//       description: "Workers without phones get digital QR cards. Admins scan at labor stands to mark attendance and assign jobs.",
//       features: [
//         "Digital QR ID cards",
//         "Admin-assisted job matching",
//         "Quick attendance marking",
//         "No phone required"
//       ],
//       color: "bg-gradient-to-br from-purple-500 to-purple-600",
//       iconColor: "text-purple-100"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div 
//           className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#667eea]/10 to-[#764BA2]/10 rounded-full blur-3xl"
//           style={{ transform: `translateY(${scrollY * 0.1}px)` }}
//         />
//         <div 
//           className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#764BA2]/10 to-[#667eea]/10 rounded-full blur-3xl"
//           style={{ transform: `translateY(-${scrollY * 0.1}px)` }}
//         />
//       </div>

//       {/* Header - Interactive */}
//       <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 hover:shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
//             <div className="relative">
//               <div className="w-10 h-10 bg-gradient-to-r from-[#667eea] to-[#764BA2] rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
//                 <Users className="w-6 h-6 text-white" />
//               </div>
//               <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900 group-hover:text-[#667eea] transition-colors duration-300">
//                 ShramikBandhu
//               </h1>
//               <p className="text-xs text-gray-500 group-hover:text-[#764BA2] transition-colors duration-300">
//                 Connecting Every Worker
//               </p>
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <nav className="hidden md:flex space-x-6">
//               {['Features', 'How It Works', 'Testimonials', 'Pricing'].map((item) => (
//                 <a
//                   key={item}
//                   href={`#${item.toLowerCase().replace(' ', '-')}`}
//                   className="text-gray-600 hover:text-[#667eea] font-medium transition-colors duration-300 relative group"
//                 >
//                   {item}
//                   <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764BA2] group-hover:w-full transition-all duration-300" />
//                 </a>
//               ))}
//             </nav>
            
//             <div className="flex space-x-3">
//               {user ? (
//                 <Button 
//                   onClick={() => navigate('/dashboard')} 
//                   data-testid="dashboard-btn"
//                   className="bg-gradient-to-r from-[#667eea] to-[#764BA2] hover:from-[#764BA2] hover:to-[#667eea] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group"
//                 >
//                   <span className="flex items-center">
//                     Dashboard 
//                     <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                   </span>
//                 </Button>
//               ) : (
//                 <>
//                   <Button 
//                     variant="outline" 
//                     onClick={() => navigate('/auth')} 
//                     data-testid="login-btn"
//                     className="border-gray-300 text-gray-700 hover:border-[#667eea] hover:text-[#667eea] hover:shadow-md transition-all duration-300"
//                   >
//                     Login
//                   </Button>
//                   <Button 
//                     onClick={() => navigate('/auth')} 
//                     data-testid="signup-btn"
//                     className="bg-gradient-to-r from-[#667eea] to-[#764BA2] hover:from-[#764BA2] hover:to-[#667eea] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
//                   >
//                     <span className="relative z-10 flex items-center">
//                       Sign Up Free
//                       <Zap className="ml-2 w-4 h-4 group-hover:animate-pulse" />
//                     </span>
//                     <div className="absolute inset-0 bg-gradient-to-r from-[#764BA2] to-[#8b5cf6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section - Enhanced */}
//       <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
//         {/* Floating Elements */}
//         <div className="absolute top-10 left-10 animate-float">
//           <div className="w-20 h-20 bg-gradient-to-r from-[#667eea]/20 to-[#764BA2]/20 rounded-full blur-xl" />
//         </div>
//         <div className="absolute bottom-10 right-10 animate-float" style={{ animationDelay: '1s' }}>
//           <div className="w-16 h-16 bg-gradient-to-r from-[#764BA2]/20 to-[#667eea]/20 rounded-full blur-xl" />
//         </div>
        
//         <div className="text-center space-y-8 relative z-10">
//           <div className="inline-block animate-fade-in">
//             <div className="bg-gradient-to-r from-[#667eea] to-[#764BA2] text-white px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300 inline-flex items-center group cursor-pointer">
//               <Heart className="w-4 h-4 mr-2 group-hover:animate-pulse" />
//               Connecting Workers & Employers Across India
//               <Star className="w-4 h-4 ml-2 group-hover:rotate-180 transition-transform duration-500" />
//             </div>
//           </div>
          
//           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight animate-fade-in-up">
//             <span className="block">Inclusive Labor Hiring</span>
//             <span className="bg-gradient-to-r from-[#667eea] via-[#764BA2] to-[#8b5cf6] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
//               For Every Worker
//             </span>
//           </h1>
          
//           <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
//             Bridging the gap between daily wage workers and employers through
//             smartphone apps, SMS, and digital ID cards. <span className="font-semibold text-[#764BA2]">No worker left behind.</span>
//           </p>
          
//           {/* Interactive Stats */}
//           <div className="flex flex-wrap justify-center gap-6 pt-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
//             {[
//               { value: "50K+", label: "Active Workers", icon: <Users className="w-4 h-4" /> },
//               { value: "10K+", label: "Employers", icon: <Briefcase className="w-4 h-4" /> },
//               { value: "95%", label: "Satisfaction", icon: <Star className="w-4 h-4" /> },
//               { value: "24/7", label: "Support", icon: <Phone className="w-4 h-4" /> }
//             ].map((stat, idx) => (
//               <div 
//                 key={idx}
//                 className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default group"
//               >
//                 <div className="flex items-center space-x-3">
//                   <div className="p-2 bg-gradient-to-r from-[#667eea]/10 to-[#764BA2]/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
//                     <div className="text-[#667eea]">{stat.icon}</div>
//                   </div>
//                   <div>
//                     <div className="text-2xl font-bold text-gray-900 group-hover:text-[#764BA2] transition-colors duration-300">
//                       {stat.value}
//                     </div>
//                     <div className="text-sm text-gray-600">{stat.label}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
//             <Button
//               size="lg"
//               onClick={() => navigate('/auth')}
//               className="text-lg px-10 py-7 bg-gradient-to-r from-[#667eea] to-[#764BA2] hover:from-[#764BA2] hover:to-[#667eea] text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
//               data-testid="get-started-btn"
//             >
//               <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
//               <span className="relative flex items-center">
//                 Get Started Free
//                 <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
//               </span>
//             </Button>
            
//             <Button
//               size="lg"
//               variant="outline"
//               onClick={() => navigate('/demo')}
//               className="text-lg px-10 py-7 border-2 border-gray-300 hover:border-[#667eea] text-gray-700 hover:text-[#667eea] hover:shadow-lg transition-all duration-300 group"
//               data-testid="demo-btn"
//             >
//               <span className="flex items-center">
//                 <PlayCircle className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
//                 Watch Demo
//               </span>
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* Interactive Features Section */}
//       <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="text-center mb-16 animate-fade-in-up">
//           <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#667eea]/10 to-[#764BA2]/10 px-4 py-2 rounded-full mb-4">
//             <Target className="w-5 h-5 text-[#667eea]" />
//             <span className="text-sm font-medium text-[#764BA2]">KEY FEATURES</span>
//           </div>
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//             Why <span className="text-[#667eea]">ShramikBandhu</span>?
//           </h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Designed for <span className="font-semibold text-[#764BA2]">every worker</span>, regardless of their technology access
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className={`relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer group border ${
//                 activeFeature === index 
//                   ? 'border-[#667eea] ring-2 ring-[#667eea]/20' 
//                   : 'border-gray-200 hover:border-[#667eea]/50'
//               }`}
//               onMouseEnter={() => setActiveFeature(index)}
//               onClick={() => setActiveFeature(index)}
//             >
//               {/* Animated Background */}
//               <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
              
//               {/* Feature Icon */}
//               <div className={`relative w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
//                 <div className="text-white">
//                   {React.cloneElement(feature.icon, { className: "w-7 h-7" })}
//                 </div>
//                 <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
//                   <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#667eea] to-[#764BA2]" />
//                 </div>
//               </div>
              
//               {/* Feature Content */}
//               <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#667eea] transition-colors duration-300">
//                 {feature.title}
//               </h3>
//               <p className="text-gray-600 mb-4">
//                 {feature.description}
//               </p>
              
//               {/* Stats Badge */}
//               <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-[#667eea]/10 to-[#764BA2]/10 text-[#764BA2] group-hover:from-[#667eea]/20 group-hover:to-[#764BA2]/20 transition-all duration-300">
//                 <BarChart3 className="w-3 h-3 mr-1" />
//                 {feature.stats}
//               </div>
              
//               {/* Learn More Link */}
//               <div className="mt-4 flex items-center text-sm font-medium text-[#667eea] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                 Learn more
//                 <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Feature Indicator */}
//         <div className="flex justify-center space-x-2 mt-12">
//           {features.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setActiveFeature(index)}
//               className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                 activeFeature === index 
//                   ? 'w-8 bg-gradient-to-r from-[#667eea] to-[#764BA2]' 
//                   : 'bg-gray-300 hover:bg-gray-400'
//               }`}
//               aria-label={`Go to feature ${index + 1}`}
//             />
//           ))}
//         </div>
//       </section>

//       {/* Three Ways to Connect - Interactive */}
//       <section id="how-it-works" className="bg-gradient-to-b from-white to-gray-50 py-24">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16 animate-fade-in-up">
//             <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#667eea]/10 to-[#764BA2]/10 px-4 py-2 rounded-full mb-4">
//               <Cpu className="w-5 h-5 text-[#667eea]" />
//               <span className="text-sm font-medium text-[#764BA2]">TECHNOLOGY INCLUSION</span>
//             </div>
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//               Three Ways to Connect
//             </h2>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               No matter what device you have, <span className="font-semibold text-[#764BA2]">we've got you covered</span>
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {methods.map((method, index) => (
//               <div
//                 key={index}
//                 className="relative group"
//               >
//                 {/* Card */}
//                 <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 h-full border border-gray-200 hover:border-transparent">
//                   {/* Icon with Animation */}
//                   <div className="relative mb-8">
//                     <div className={`w-20 h-20 ${method.color} rounded-2xl flex items-center justify-center transform group-hover:rotate-[360deg] transition-transform duration-700`}>
//                       <div className={method.iconColor}>
//                         {method.icon}
//                       </div>
//                     </div>
//                     <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
//                       <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#667eea] to-[#764BA2] flex items-center justify-center">
//                         <span className="text-xs font-bold text-white">{index + 1}</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Content */}
//                   <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#764BA2] transition-colors duration-300">
//                     {method.title}
//                   </h3>
//                   <p className="text-gray-600 mb-6 leading-relaxed">
//                     {method.description}
//                   </p>
                  
//                   {/* Features List */}
//                   <ul className="space-y-3 mb-8">
//                     {method.features.map((feature, idx) => (
//                       <li key={idx} className="flex items-start group/item">
//                         <CheckCircle2 className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${method.iconColor.replace('100', '600')} group-hover/item:scale-110 transition-transform duration-300`} />
//                         <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-300">
//                           {feature}
//                         </span>
//                       </li>
//                     ))}
//                   </ul>
                  
//                   {/* Interactive Button */}
//                   <div className="mt-auto">
//                     <button className="w-full py-3 bg-gradient-to-r from-gray-50 to-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:text-[#667eea] hover:border-[#667eea] hover:shadow-md transition-all duration-300 group/btn">
//                       <span className="flex items-center justify-center">
//                         Learn More
//                         <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
//                       </span>
//                     </button>
//                   </div>
//                 </div>
                
//                 {/* Floating Animation */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-[#667eea] to-[#764BA2] rounded-2xl opacity-0 group-hover:opacity-10 blur-xl -z-10 transition-opacity duration-500" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Add these styles to your global CSS for animations */}
//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-20px); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         @keyframes gradient {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }
//         .animate-fade-in {
//           animation: fadeIn 1s ease-out;
//         }
//         .animate-fade-in-up {
//           animation: fadeInUp 0.8s ease-out forwards;
//         }
//         .animate-gradient {
//           animation: gradient 3s ease infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default LandingPage;





import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Users,
  Briefcase,
  UserCheck,
  ArrowRight,
  CheckCircle2,
  Phone,
  TrendingUp,
  Smartphone,
  Shield,
  MessageSquare,
  QrCode,
  Cpu,
  Bell,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Heart,
  Star,
  ChevronRight,
  PlayCircle,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Download,
  Award,
  ShieldCheck,
  Clock,
  Users as UsersIcon,
  Building,
  FileText,
  HelpCircle,
  MessageCircle,
  Send,
  ArrowUpRight,
  PhoneCall
} from 'lucide-react';

const LandingPage = ({ user }) => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
    }
  };

  const features = [
    {
      icon: <Phone />,
      title: "Truly Inclusive",
      description: "Works for smartphone, feature phone, and no-phone users through SMS, IVR, and admin kiosk",
      color: "from-[#667eea] to-[#764BA2]",
      stats: "100% Coverage"
    },
    {
      icon: <TrendingUp />,
      title: "Smart Matching",
      description: "AI-powered algorithm ensures fair job distribution based on skills, ratings, and rotation",
      color: "from-[#764BA2] to-[#667eea]",
      stats: "95% Match Rate"
    },
    {
      icon: <Smartphone />,
      title: "Instant Notifications",
      description: "Real-time job alerts via app, SMS, or IVR calls based on worker's phone type",
      color: "from-[#667eea] to-[#8b5cf6]",
      stats: "< 30s Response"
    },
    {
      icon: <Shield />,
      title: "Transparent & Secure",
      description: "Track job history, ratings, and payments. Build trust through verified feedback",
      color: "from-[#764BA2] to-[#8b5cf6]",
      stats: "0% Fraud"
    }
  ];

  const methods = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Smartphone App",
      description: "Workers with smartphones get instant job notifications, can apply directly, and manage their work history.",
      features: [
        "Real-time job alerts",
        "Easy job application",
        "Work history tracking",
        "Digital payment tracking"
      ],
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      iconColor: "text-emerald-100"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "SMS & IVR",
      description: "Feature phone users receive job offers via SMS and can respond with simple text messages or IVR calls.",
      features: [
        "SMS job notifications",
        "Simple text responses",
        "IVR call confirmation",
        "Voice-based interface"
      ],
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      iconColor: "text-blue-100"
    },
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "QR ID Cards",
      description: "Workers without phones get digital QR cards. Admins scan at labor stands to mark attendance and assign jobs.",
      features: [
        "Digital QR ID cards",
        "Admin-assisted job matching",
        "Quick attendance marking",
        "No phone required"
      ],
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      iconColor: "text-purple-100"
    }
  ];

  const footerLinks = {
    Product: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'API', href: '#api' },
      { label: 'Download App', href: '#download', icon: <Download className="w-4 h-4 ml-1" /> }
    ],
    Company: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Press', href: '#press' },
      { label: 'Blog', href: '#blog' },
      { label: 'Partners', href: '#partners' }
    ],
    Resources: [
      { label: 'Documentation', href: '#docs' },
      { label: 'Help Center', href: '#help' },
      { label: 'Community', href: '#community' },
      { label: 'Legal', href: '#legal' },
      { label: 'Privacy Policy', href: '#privacy' }
    ],
    Contact: [
      { label: 'support@shramikbandhu.com', href: 'mailto:support@shramikbandhu.com', icon: <Mail className="w-4 h-4 mr-2" /> },
      { label: '+91 1800-123-4567', href: 'tel:+9118001234567', icon: <PhoneCall className="w-4 h-4 mr-2" /> },
      { label: 'Bhubaneswar, Odisha', href: '#location', icon: <MapPin className="w-4 h-4 mr-2" /> },
      { label: 'Contact Sales', href: '#sales', icon: <MessageCircle className="w-4 h-4 mr-2" /> }
    ]
  };

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, label: 'Facebook', href: '#' },
    { icon: <Twitter className="w-5 h-5" />, label: 'Twitter', href: '#' },
    { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn', href: '#' },
    { icon: <Instagram className="w-5 h-5" />, label: 'Instagram', href: '#' },
    { icon: <Youtube className="w-5 h-5" />, label: 'YouTube', href: '#' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#667eea]/10 to-[#764BA2]/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#764BA2]/10 to-[#667eea]/10 rounded-full blur-3xl"
          style={{ transform: `translateY(-${scrollY * 0.1}px)` }}
        />
      </div>

      {/* Header - Interactive */}
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 hover:shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-[#667eea] to-[#764BA2] rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 group-hover:text-[#667eea] transition-colors duration-300">
                ShramikBandhu
              </h1>
              <p className="text-xs text-gray-500 group-hover:text-[#764BA2] transition-colors duration-300">
                Connecting Every Worker
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              {['Features', 'How It Works','Pricing','Contact'].map((item) => (
                <a
                  key={item}
                  href={`${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-600 hover:text-[#667eea] font-medium transition-colors duration-300 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764BA2] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>
            
            <div className="flex space-x-3">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  data-testid="dashboard-btn"
                  className="bg-gradient-to-r from-[#667eea] to-[#764BA2] hover:from-[#764BA2] hover:to-[#667eea] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <span className="flex items-center">
                    Dashboard 
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/auth')} 
                    data-testid="login-btn"
                    className="border-gray-300 text-gray-700 hover:border-[#667eea] hover:text-[#667eea] hover:shadow-md transition-all duration-300"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/auth')} 
                    data-testid="signup-btn"
                    className="bg-gradient-to-r from-[#667eea] to-[#764BA2] hover:from-[#764BA2] hover:to-[#667eea] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center">
                      Sign Up Free
                      <Zap className="ml-2 w-4 h-4 group-hover:animate-pulse" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#764BA2] to-[#8b5cf6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Enhanced */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 animate-float">
          <div className="w-20 h-20 bg-gradient-to-r from-[#667eea]/20 to-[#764BA2]/20 rounded-full blur-xl" />
        </div>
        <div className="absolute bottom-10 right-10 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-16 h-16 bg-gradient-to-r from-[#764BA2]/20 to-[#667eea]/20 rounded-full blur-xl" />
        </div>
        
        <div className="text-center space-y-8 relative z-10">
          <div className="inline-block animate-fade-in">
            <div className="bg-gradient-to-r from-[#667eea] to-[#764BA2] text-white px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300 inline-flex items-center group cursor-pointer">
              <Heart className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              Connecting Workers & Employers Across India
              <Star className="w-4 h-4 ml-2 group-hover:rotate-180 transition-transform duration-500" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight animate-fade-in-up">
            <span className="block">Inclusive Labor Hiring</span>
            <span className="bg-gradient-to-r from-[#667eea] via-[#764BA2] to-[#8b5cf6] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              For Every Worker
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Bridging the gap between daily wage workers and employers through
            smartphone apps, SMS, and digital ID cards. <span className="font-semibold text-[#764BA2]">No worker left behind.</span>
          </p>
          
          {/* Interactive Stats */}
          <div className="flex flex-wrap justify-center gap-6 pt-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {[
              { value: "50K+", label: "Active Workers", icon: <Users className="w-4 h-4" /> },
              { value: "10K+", label: "Employers", icon: <Briefcase className="w-4 h-4" /> },
              { value: "95%", label: "Satisfaction", icon: <Star className="w-4 h-4" /> },
              { value: "24/7", label: "Support", icon: <Phone className="w-4 h-4" /> }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-[#667eea]/10 to-[#764BA2]/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="text-[#667eea]">{stat.icon}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-[#764BA2] transition-colors duration-300">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="text-lg px-10 py-7 bg-gradient-to-r from-[#667eea] to-[#764BA2] hover:from-[#764BA2] hover:to-[#667eea] text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              data-testid="get-started-btn"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center">
                Get Started Free
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/demo')}
              className="text-lg px-10 py-7 border-2 border-gray-300 hover:border-[#667eea] text-gray-700 hover:text-[#667eea] hover:shadow-lg transition-all duration-300 group"
              data-testid="demo-btn"
            >
              <span className="flex items-center">
                <PlayCircle className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#667eea]/10 to-[#764BA2]/10 px-4 py-2 rounded-full mb-4">
            <Target className="w-5 h-5 text-[#667eea]" />
            <span className="text-sm font-medium text-[#764BA2]">KEY FEATURES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why <span className="text-[#667eea]">ShramikBandhu</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Designed for <span className="font-semibold text-[#764BA2]">every worker</span>, regardless of their technology access
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer group border ${
                activeFeature === index 
                  ? 'border-[#667eea] ring-2 ring-[#667eea]/20' 
                  : 'border-gray-200 hover:border-[#667eea]/50'
              }`}
              onMouseEnter={() => setActiveFeature(index)}
              onClick={() => setActiveFeature(index)}
            >
              {/* Animated Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
              
              {/* Feature Icon */}
              <div className={`relative w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <div className="text-white">
                  {React.cloneElement(feature.icon, { className: "w-7 h-7" })}
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#667eea] to-[#764BA2]" />
                </div>
              </div>
              
              {/* Feature Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#667eea] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              
              {/* Stats Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-[#667eea]/10 to-[#764BA2]/10 text-[#764BA2] group-hover:from-[#667eea]/20 group-hover:to-[#764BA2]/20 transition-all duration-300">
                <BarChart3 className="w-3 h-3 mr-1" />
                {feature.stats}
              </div>
              
              {/* Learn More Link */}
              <div className="mt-4 flex items-center text-sm font-medium text-[#667eea] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Feature Indicator */}
        <div className="flex justify-center space-x-2 mt-12">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeFeature === index 
                  ? 'w-8 bg-gradient-to-r from-[#667eea] to-[#764BA2]' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to feature ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Three Ways to Connect - Interactive */}
      <section id="how-it-works" className="bg-gradient-to-b from-white to-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#667eea]/10 to-[#764BA2]/10 px-4 py-2 rounded-full mb-4">
              <Cpu className="w-5 h-5 text-[#667eea]" />
              <span className="text-sm font-medium text-[#764BA2]">TECHNOLOGY INCLUSION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Three Ways to Connect
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No matter what device you have, <span className="font-semibold text-[#764BA2]">we've got you covered</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {methods.map((method, index) => (
              <div
                key={index}
                className="relative group"
              >
                {/* Card */}
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 h-full border border-gray-200 hover:border-transparent">
                  {/* Icon with Animation */}
                  <div className="relative mb-8">
                    <div className={`w-20 h-20 ${method.color} rounded-2xl flex items-center justify-center transform group-hover:rotate-[360deg] transition-transform duration-700`}>
                      <div className={method.iconColor}>
                        {method.icon}
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#667eea] to-[#764BA2] flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#764BA2] transition-colors duration-300">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {method.description}
                  </p>
                  
                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {method.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start group/item">
                        <CheckCircle2 className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${method.iconColor.replace('100', '600')} group-hover/item:scale-110 transition-transform duration-300`} />
                        <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Interactive Button */}
                  <div className="mt-auto">
                    <button className="w-full py-3 bg-gradient-to-r from-gray-50 to-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:text-[#667eea] hover:border-[#667eea] hover:shadow-md transition-all duration-300 group/btn">
                      <span className="flex items-center justify-center">
                        Learn More
                        <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>
                </div>
                
                {/* Floating Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#667eea] to-[#764BA2] rounded-2xl opacity-0 group-hover:opacity-10 blur-xl -z-10 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#667eea] to-[#764BA2] py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Workforce Connectivity?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of workers and employers building better futures together
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-white text-[#667eea] hover:bg-gray-100 text-lg px-10 py-7 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 group"
              data-testid="cta-signup-btn"
            >
              <span className="flex items-center">
                Start Free Trial 
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/demo')}
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-7 font-bold group"
            >
              <span className="flex items-center">
                <PhoneCall className="mr-3 w-6 h-6" />
                Schedule Demo
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 relative overflow-hidden">
        {/* Footer Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#667eea] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#764BA2] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#667eea] to-[#764BA2] rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">ShramikBandhu</h2>
                  <p className="text-sm text-gray-400">Connecting Every Worker</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering millions of workers across India with inclusive technology. 
                No matter your device or location, we connect you to opportunities.
              </p>
              
              {/* Newsletter Subscription */}
              <div className="mb-8">
                <h3 className="text-white font-semibold mb-3">Stay Updated</h3>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#667eea] text-white placeholder-gray-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764BA2] hover:from-[#764BA2] hover:to-[#667eea] text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Subscribe
                  </button>
                </form>
                {isSubscribed && (
                  <p className="mt-2 text-green-400 text-sm animate-fade-in">
                    Thank you for subscribing! 🎉
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-white font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                      aria-label={social.label}
                    >
                      <div className="text-gray-400 group-hover:text-white transition-colors duration-300">
                        {social.icon}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-white font-semibold mb-6 text-lg">{category}</h3>
                <ul className="space-y-3">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="flex items-center text-gray-400 hover:text-white transition-colors duration-300 group"
                      >
                        {link.icon && React.cloneElement(link.icon, { className: "w-4 h-4 mr-2" })}
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.label}
                        </span>
                        {!link.icon && <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <ShieldCheck className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <p className="text-sm font-medium text-white">Secure & Verified</p>
                  <p className="text-xs text-gray-400">ISO 27001 Certified</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group cursor-pointer">
                <Award className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <p className="text-sm font-medium text-white">Award Winning</p>
                  <p className="text-xs text-gray-400">Digital India Award 2024</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group cursor-pointer">
                <Clock className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <p className="text-sm font-medium text-white">24/7 Support</p>
                  <p className="text-xs text-gray-400">Always Here to Help</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group cursor-pointer">
                <UsersIcon className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <p className="text-sm font-medium text-white">500K+ Users</p>
                  <p className="text-xs text-gray-400">Trusted Community</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-400">
                  © {new Date().getFullYear()} ShramikBandhu. All rights reserved.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Empowering workers across India • Made with ❤️ for every worker
                </p>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Globe className="w-4 h-4" />
                  <span>English</span>
                </div>
                <div className="flex space-x-6">
                  <a href="#privacy" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                    Privacy Policy
                  </a>
                  <a href="#terms" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                    Terms of Service
                  </a>
                  <a href="#cookies" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>

            {/* Back to Top Button */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-[#667eea] to-[#764BA2] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 z-40"
              aria-label="Back to top"
            >
              <ArrowRight className="w-6 h-6 text-white transform -rotate-90" />
            </button>
          </div>
        </div>
      </footer>

      {/* Add these styles to your global CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;