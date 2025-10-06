import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, CheckCircle } from 'lucide-react';

function RegisterHospital() {
  const [formData, setFormData] = useState({
    hospitalName: '',
    address: '',
    headOfHospital: '',
    phoneNumber: ''
  });

  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Hospital registration submitted:', formData);
    alert('Hospital registration submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-900 font-medium hover:text-gray-700 transition">
                Home
              </Link>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition">
                About Us
              </a>
              <Link to="/find-blood" className="text-gray-600 hover:text-gray-900 transition">
                Find Blood
              </Link>
              <div className="relative">
                <button
                  onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                  className="flex items-center text-gray-900 font-medium border-b-2 border-gray-900 pb-1"
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
              <button className="px-6 py-2 border-2 border-gray-900 text-gray-900 rounded hover:bg-gray-900 hover:text-white transition">
                Log In
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section with Gradient */}
      <div className="relative bg-gradient-to-r from-pink-900 via-pink-700 to-pink-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">Register As An Hospital</h1>
        </div>
      </div>

      {/* Registration Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Hospital Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <label className="text-gray-700 font-medium pt-2">
              Hospital Name
            </label>
            <div className="md:col-span-2">
              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                placeholder="Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <label className="text-gray-700 font-medium pt-2">
              Address
            </label>
            <div className="md:col-span-2">
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Type Here"
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                required
              />
            </div>
          </div>

          {/* Head of Hospital */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <label className="text-gray-700 font-medium pt-2">
              Head of Hospital
            </label>
            <div className="md:col-span-2">
              <input
                type="text"
                name="headOfHospital"
                value={formData.headOfHospital}
                onChange={handleChange}
                placeholder="Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <label className="text-gray-700 font-medium pt-2">
              Phone Number
            </label>
            <div className="md:col-span-2">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-white border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition"
            >
              <span>Submit</span>
              <CheckCircle className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterHospital;
