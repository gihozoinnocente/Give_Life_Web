import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Heart, Users, Target, Award, TrendingUp, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

function AboutUs() {
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const [activeTeamMember, setActiveTeamMember] = useState(null);
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

  const stats = [
    { number: '10,000+', label: 'Lives Saved', icon: Heart },
    { number: '5,000+', label: 'Active Donors', icon: Users },
    { number: '50+', label: 'Partner Hospitals', icon: Target },
    { number: '98%', label: 'Success Rate', icon: Award }
  ];

  const values = [
    {
      title: 'Compassion',
      description: 'We believe in the power of human kindness and the impact of giving.',
      icon: Heart,
      color: 'bg-red-100 text-red-700'
    },
    {
      title: 'Reliability',
      description: 'Available 24/7 to connect donors with those in urgent need.',
      icon: Target,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: 'Innovation',
      description: 'Using technology to make blood donation more accessible and efficient.',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-700'
    },
    {
      title: 'Community',
      description: 'Building a network of life-savers across Africa.',
      icon: Users,
      color: 'bg-purple-100 text-purple-700'
    }
  ];

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Medical Officer',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
      bio: '15+ years in healthcare management and blood donation services.'
    },
    {
      name: 'Michael Chen',
      role: 'Technology Director',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      bio: 'Expert in healthcare technology and digital transformation.'
    },
    {
      name: 'Amina Okonkwo',
      role: 'Community Outreach Lead',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
      bio: 'Passionate about building donor communities across Africa.'
    },
    {
      name: 'James Mutua',
      role: 'Operations Manager',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      bio: 'Ensuring smooth operations and donor satisfaction.'
    }
  ];

  const milestones = [
    { year: '2020', event: 'Give Life Platform Launched', description: 'Started our journey to save lives' },
    { year: '2021', event: 'Reached 1,000 Donors', description: 'Growing community of life-savers' },
    { year: '2022', event: 'Expanded to 5 Countries', description: 'Taking our mission across Africa' },
    { year: '2023', event: '10,000 Lives Saved', description: 'Milestone achievement in our mission' },
    { year: '2024', event: 'AI-Powered Matching', description: 'Introducing smart donor-recipient matching' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition">
                Home
              </Link>
              <Link to="/about" className="text-gray-900 font-medium border-b-2 border-gray-900 pb-1">
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
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-900 via-red-700 to-pink-600 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Give Life</h1>
            <p className="text-xl md:text-2xl text-red-100 leading-relaxed">
              Connecting donors with those in need, one drop at a time. We're on a mission to ensure no patient waits for life-saving blood.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
              >
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-red-600" />
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-2xl">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                To bridge the critical gap between blood donors and those in urgent need across Africa through innovative technology, 
                ensuring timely access to safe blood and saving lives in real-time.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                A future where every person in need has immediate access to safe blood, and every willing donor can easily contribute 
                to saving lives, creating a sustainable ecosystem of hope and health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer"
              >
                <div className={`w-14 h-14 ${value.color} rounded-lg flex items-center justify-center mb-4`}>
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">Key milestones in our mission to save lives</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-red-200"></div>

            {milestones.map((milestone, index) => (
              <div key={index} className={`relative mb-12 ${index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2'}`}>
                <div className={`flex items-center ${index % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''}`}>
                  <div className="flex-1">
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
                      <div className="text-red-600 font-bold text-2xl mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.event}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">Dedicated professionals committed to saving lives</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer"
                onMouseEnter={() => setActiveTeamMember(index)}
                onMouseLeave={() => setActiveTeamMember(null)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover transition transform hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition ${activeTeamMember === index ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-sm">{member.bio}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-red-600 font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-900 to-pink-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
          <p className="text-xl text-red-100 mb-8">
            Have questions or want to partner with us? We'd love to hear from you.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Phone className="w-7 h-7" />
              </div>
              <div className="font-semibold mb-1">Phone</div>
              <div className="text-red-100">+250 XXX XXX XXX</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Mail className="w-7 h-7" />
              </div>
              <div className="font-semibold mb-1">Email</div>
              <div className="text-red-100">info@givelife.org</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <MapPin className="w-7 h-7" />
              </div>
              <div className="font-semibold mb-1">Location</div>
              <div className="text-red-100">Kigali, Rwanda</div>
            </div>
          </div>

          <Link to="/register-donor">
            <button className="bg-white text-red-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg inline-flex items-center space-x-2">
              <span>Join Our Community</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
