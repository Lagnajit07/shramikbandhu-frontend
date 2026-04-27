import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  User,
  PhoneCall,
  Clock,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  XCircle,
  Home,
  ArrowLeft, 
  MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.mobile.trim()) errors.mobile = 'Mobile number is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) errors.message = 'Message is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Reset errors
    setFormErrors({});
    
    // Simulate form submission
    setFormSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        mobile: '',
        email: '',
        message: ''
      });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center text-gray-700 hover:text-[#667eea]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Contact Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Contact <span className="text-[#667eea]">Us</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch with us. We're here to help you with any questions about ShramikBandhu.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#667eea] to-[#764BA2] rounded-lg flex items-center justify-center mr-4">
                  <PhoneCall className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Call Us</h3>
                  <p className="text-sm text-gray-600">Available 24/7</p>
                </div>
              </div>
              <a 
                href="tel:+9118001234567" 
                className="text-xl font-bold text-gray-900 hover:text-[#667eea] transition-colors duration-300 block"
              >
                +91 8658758951
              </a>
            </div>

            {/* Contact Card 2 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#764BA2] to-[#8b5cf6] rounded-lg flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Email Us</h3>
                  <p className="text-sm text-gray-600">Response within 24 hours</p>
                </div>
              </div>
              <a 
                href="mailto:support@shramikbandhu.com" 
                className="text-lg font-medium text-gray-900 hover:text-[#667eea] transition-colors duration-300 block truncate"
              >
                support@shramikbandhu.com
              </a>
            </div>

            {/* Contact Card 3 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#667eea] to-[#764BA2] rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Visit Us</h3>
                  <p className="text-sm text-gray-600">Our Headquarters</p>
                </div>
              </div>
              <p className="text-gray-700">
                Bhubaneswar, Odisha, India
              </p>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>Mon-Fri: 9:00 AM - 6:00 PM</span>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gradient-to-r from-[#667eea] to-[#764BA2] rounded-xl p-6 text-white">
              <div className="flex items-center mb-4">
                <HelpCircle className="w-6 h-6 mr-3" />
                <h3 className="text-lg font-bold">Quick Help</h3>
              </div>
              <div className="space-y-3">
                <p className="text-white/90">
                  Check our FAQ section for quick answers to common questions.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/faq')}
                >
                  View FAQs
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>



            {/* WhatsApp Support Card */}
<Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 mt-4">
  <CardContent className="p-6">
    <div className="text-center">
      <div className="flex justify-center mb-3">
        <div className="bg-green-100 p-3 rounded-full">
          <MessageCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
      <p className="text-sm text-gray-600 mb-4">
        Scan the QR code below to chat with our support team on WhatsApp
      </p>
      <div className="flex justify-center">
        <img 
          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/919876543210" 
          alt="WhatsApp QR"
          className="w-32 h-32 border-2 border-green-200 rounded-lg"
        />
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Or message us directly at <span className="font-mono">+91 98765 43210</span>
      </p>
    </div>
  </CardContent>
</Card>
          </div>







          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent Successfully!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <Button
                    onClick={() => setFormSubmitted(false)}
                    className="bg-gradient-to-r from-[#667eea] to-[#764BA2] text-white"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form 
  action="https://api.web3forms.com/submit"
  method="POST"
  className="space-y-6"
>
  {/* Web3Forms Access Key */}
  <input type="hidden" name="access_key" value="974d77af-a98f-4224-9e75-c61ae64c9950" />

  {/* Name Field */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
      <User className="w-4 h-4 mr-2 text-[#667eea]" />
      Your Name
    </label>
    <input
      type="text"
      name="name"
      required
      placeholder="Enter your name"
      className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2
                 focus:ring-[#667eea]/50 focus:border-[#667eea]"
    />
  </div>

  {/* Mobile Field */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
      <Phone className="w-4 h-4 mr-2 text-[#667eea]" />
      Mobile Number
    </label>
    <input
      type="tel"
      name="mobile"
      required
      placeholder="Enter your mobile number"
      className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2
                 focus:ring-[#667eea]/50 focus:border-[#667eea]"
    />
  </div>

  {/* Email Field */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
      <Mail className="w-4 h-4 mr-2 text-[#667eea]" />
      Email Address
    </label>
    <input
      type="email"
      name="email"
      required
      placeholder="Enter your email"
      className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2
                 focus:ring-[#667eea]/50 focus:border-[#667eea]"
    />
  </div>

  {/* Message Field */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
      <MessageSquare className="w-4 h-4 mr-2 text-[#667eea]" />
      Message
    </label>
    <textarea
      name="message"
      required
      rows="6"
      placeholder="Write your message here..."
      className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2
                 focus:ring-[#667eea]/50 focus:border-[#667eea]"
    />
  </div>

  {/* Submit Button */}
  <div className="pt-4">
    <button
      type="submit"
      className="w-full py-4 bg-gradient-to-r from-[#667eea] to-[#764BA2]
                 hover:from-[#764BA2] hover:to-[#667eea] text-white font-bold rounded-lg
                 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all
                 duration-300 flex items-center justify-center group"
    >
      <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
      Send Message
    </button>
  </div>
</form>

              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} ShramikBandhu. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Connecting Every Worker • Empowering India's Workforce
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;