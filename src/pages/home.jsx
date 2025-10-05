import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Heart, Edit, Facebook, Twitter, Instagram, Menu, X } from 'lucide-react';

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setRegisterDropdownOpen(false);
      }
    };

    if (registerDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [registerDropdownOpen]);

  const collaborators = [
    'RBC',
    'Ministry of Health in Rwanda',
    'African Union'
  ];

  const steps = [
    {
      number: 1,
      title: 'Register Online',
      description: 'Create your account and complete your donor profile in minutes.'
    },
    {
      number: 2,
      title: 'Find Location',
      description: 'Locate the nearest blood donation center or mobile unit.'
    },
    {
      number: 3,
      title: 'Donate Blood',
      description: 'Visit the center and save lives with your generous donation.'
    }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    alert('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-900 font-medium border-b-2 border-red-700 pb-1">
                Home
              </a>
              <Link to="/about" className="text-gray-600 hover:text-gray-900 transition">
                About Us
              </Link>
              <Link to="/find-blood" className="text-gray-600 hover:text-gray-900 transition">
                Find Blood
              </Link>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition"
                >
                  Register Now
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                {registerDropdownOpen && (
                  <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                    <Link 
                      to="/register-donor" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setRegisterDropdownOpen(false)}
                    >
                      Register as Donor
                    </Link>
                    <Link 
                      to="/register-hospital" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setRegisterDropdownOpen(false)}
                    >
                      Register as Hospital
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden md:block">
              <Link to="/login">
                <button className="px-6 py-2 border-2 border-gray-900 text-gray-900 rounded hover:bg-gray-900 hover:text-white transition">
                  Log In
                </button>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-3">
              <a href="#home" className="block text-gray-900 font-medium">Home</a>
              <Link to="/about" className="block text-gray-600">About Us</Link>
              <Link to="/find-blood" className="block text-gray-600">Find Blood</Link>
              <a href="#register" className="block text-gray-600">Register Now</a>
              <Link to="/login" className="w-full">
                <button className="w-full px-6 py-2 border-2 border-gray-900 text-gray-900 rounded">
                  Log In
                </button>
              </Link>
            </div>
          )}
        </nav>
      </header>

      <section className="relative pt-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[600px]">
            <div className="relative lg:absolute lg:left-0 lg:top-0 lg:bottom-0 lg:w-1/2">
              <svg
                viewBox="0 0 500 600"
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0,0 L 500,0 Q 400,300 500,600 L 0,600 Z"
                  fill="#881337"
                />
              </svg>
            </div>

            <div className="lg:col-start-2 lg:pl-12 pt-12 lg:pt-24 pb-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Save Life By Donate Blood
              </h1>
              <p className="text-gray-600 mb-8 leading-relaxed max-w-lg">
                Your donation can save up to three lives. Join thousands of heroes across Africa who are committed to making a difference. Every drop counts in our mission to ensure no patient waits for life-saving blood.
              </p>
              <button className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition shadow-lg">
                Get Blood Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <h3 className="text-2xl text-gray-700 mb-6">Connecting Life Through Blood</h3>
          <p className="text-gray-600 max-w-3xl leading-relaxed">
            Our mission is to bridge the critical gap between blood donors and those in urgent need across Africa. We are committed to transforming blood donation management through innovative technology that saves lives in real-time.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Collaborators</h2>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out">
                {collaborators.map((collab, index) => (
                  <div
                    key={index}
                    className="min-w-full sm:min-w-[50%] lg:min-w-[33.333%] px-4"
                  >
                    <div className="bg-white rounded-xl shadow-md p-12 text-center h-64 flex items-center justify-center">
                      <h3 className="text-2xl font-bold text-gray-300">{collab}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {collaborators.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition ${
                    currentSlide === index ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-16">How to get Blood?</h2>
          
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 transform -translate-y-1/2">
              <svg viewBox="0 0 1200 200" className="w-full h-32">
                <path
                  d="M 0,100 L 200,100 L 250,80 L 280,120 L 310,100 L 400,100 L 450,60 L 480,100 L 510,140 L 540,100 L 690,100 L 740,80 L 770,120 L 800,100 L 900,100 L 950,60 L 980,100 L 1010,140 L 1040,100 L 1200,100"
                  stroke="#881337"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
              <Heart className="w-16 h-16 text-red-900 fill-red-900 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-gray-900 text-3xl font-bold mb-6 bg-white">
                    {step.number}
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <Edit className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                    <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white">
        <div className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-700 rounded-full"></div>
                </div>
                <span className="text-lg">Ready to get started?</span>
              </div>
              <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Donate
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#services" className="hover:text-white transition">Camp Hosting</a></li>
                <li><a href="#services" className="hover:text-white transition">Branding</a></li>
                <li><a href="#services" className="hover:text-white transition">Others</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#story" className="hover:text-white transition">Our Story</a></li>
                <li><a href="#benefits" className="hover:text-white transition">Benefits</a></li>
                <li><a href="#team" className="hover:text-white transition">Team</a></li>
                <li><a href="#careers" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Help</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#faq" className="hover:text-white transition">FAQs</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Subscribe to our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                />
                <button
                  onClick={handleNewsletterSubmit}
                  className="bg-red-700 px-4 py-2 rounded-r-lg hover:bg-red-800 transition"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
            <div className="flex gap-6">
              <a href="#terms" className="hover:text-white transition">Terms & Conditions</a>
              <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
            </div>
            <div className="flex gap-4">
              <a href="#facebook" className="hover:text-white transition" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#twitter" className="hover:text-white transition" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#instagram" className="hover:text-white transition" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;