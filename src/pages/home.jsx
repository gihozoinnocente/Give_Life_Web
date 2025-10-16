import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Heart, Edit, Facebook, Twitter, Instagram, Menu, X, MapPin, Phone, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';

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
      description: 'Locate the nearest hospital.'
    },
    {
      number: 3,
      title: 'Donate Blood',
      description: 'Visit the hospital and save lives with your generous donation.'
    }
  ];

  const hospitals = [
    {
      name: 'King Faisal Hospital',
      location: 'Kigali, Gasabo',
      phone: '+250 788 123 456',
      hours: '24/7 Emergency',
      bloodTypes: ['A+', 'B+', 'O+', 'AB+'],
      image: '/images/hospital1.jpg'
    },
    {
      name: 'CHUK Hospital',
      location: 'Kigali, Nyarugenge',
      phone: '+250 788 234 567',
      hours: 'Mon-Fri: 8AM-5PM',
      bloodTypes: ['A-', 'B-', 'O-', 'AB-'],
      image: '/images/hospital2.jpg'
    },
    {
      name: 'Rwanda Military Hospital',
      location: 'Kigali, Kicukiro',
      phone: '+250 788 345 678',
      hours: '24/7 Emergency',
      bloodTypes: ['A+', 'O+', 'B+', 'O-'],
      image: '/images/hospital3.jpg'
    },
    {
      name: 'Kibagabaga Hospital',
      location: 'Kigali, Gasabo',
      phone: '+250 788 456 789',
      hours: 'Mon-Sat: 7AM-6PM',
      bloodTypes: ['AB+', 'A+', 'B-', 'O+'],
      image: '/images/hospital4.jpg'
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
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

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
                Explore Our Web
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

      {/* Hospitals Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Partner Hospitals</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find a hospital near you and make your life-saving donation today. Our partner hospitals are equipped and ready to receive your generous contribution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hospitals.map((hospital, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                {/* Hospital Image */}
                <div className="h-48 bg-gradient-to-br from-red-900 to-pink-700 flex items-center justify-center">
                  <div className="text-white text-center p-6">
                    <Heart className="w-16 h-16 mx-auto mb-2 fill-white" />
                    <p className="text-sm font-medium">Blood Donation Center</p>
                  </div>
                </div>

                {/* Hospital Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{hospital.name}</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{hospital.location}</span>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{hospital.phone}</span>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{hospital.hours}</span>
                    </div>
                  </div>

                  {/* Blood Types */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Available Blood Types:</p>
                    <div className="flex flex-wrap gap-2">
                      {hospital.bloodTypes.map((type, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to="/find-blood"
                    className="block w-full text-center bg-red-700 text-white py-2 rounded-lg font-medium hover:bg-red-800 transition"
                  >
                    Visit Hospital
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              to="/find-blood"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              View All Hospitals
            </Link>
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