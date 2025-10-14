import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    email: user?.email || '',
    address: user?.address || '',
    age: user?.age || '',
    bloodGroup: user?.bloodGroup || '',
    district: user?.district || '',
    state: user?.state || '',
    pinCode: user?.pinCode || '',
    lastDonationMonth: '',
    lastDonationYear: '',
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const districts = ['Gasabo', 'Kicukiro', 'Nyarugenge', 'Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Rwamagana'];
  const states = ['Kigali City', 'Eastern Province', 'Northern Province', 'Southern Province', 'Western Province'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement update profile API call
    console.log('Updated profile data:', formData);
    alert('Profile updated successfully!');
    navigate('/profile');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-700 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Full Name */}
          <div className="grid grid-cols-12 gap-6 items-center">
            <label className="col-span-2 text-gray-700 text-right">
              Full Name
            </label>
            <div className="col-span-10 grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-gray-500 placeholder-gray-300"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-gray-500 placeholder-gray-300"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="grid grid-cols-12 gap-6 items-center">
            <label className="col-span-2 text-gray-700 text-right">
              Phone Number
            </label>
            <div className="col-span-10">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Number"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-gray-500 placeholder-gray-300"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-12 gap-6 items-center">
            <label className="col-span-2 text-gray-700 text-right">
              E mail
            </label>
            <div className="col-span-10">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Mail_Id"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-gray-500 placeholder-gray-300 bg-gray-50"
                required
                disabled
              />
            </div>
          </div>

          {/* Address and Age/Blood Group */}
          <div className="grid grid-cols-12 gap-6 items-start">
            <label className="col-span-2 text-gray-700 text-right pt-3">
              Address
            </label>
            <div className="col-span-10 grid grid-cols-2 gap-4">
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Type Here"
                rows="5"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-none text-gray-500 placeholder-gray-300"
                required
              />
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <label className="col-span-4 text-gray-700 text-right text-sm">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Age"
                    min="18"
                    max="65"
                    className="col-span-8 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-gray-500 placeholder-gray-300"
                    required
                  />
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <label className="col-span-4 text-gray-700 text-right text-sm">Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="col-span-8 w-full px-4 py-3 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white text-gray-500"
                    required
                  >
                    <option value="">Select</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* District and State */}
          <div className="grid grid-cols-12 gap-6 items-center">
            <label className="col-span-2 text-gray-700 text-right">
              District
            </label>
            <div className="col-span-10 grid grid-cols-2 gap-4">
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="District"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-gray-500 placeholder-gray-300"
                required
              />
              <div className="grid grid-cols-12 gap-2 items-center">
                <label className="col-span-3 text-gray-700 text-right text-sm">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="col-span-9 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-gray-500 placeholder-gray-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* PinCode */}
          <div className="grid grid-cols-12 gap-6 items-center">
            <label className="col-span-2 text-gray-700 text-right">
              PinCode
            </label>
            <div className="col-span-10">
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="Enter Pin Code"
                className="w-full max-w-md px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-gray-500 placeholder-gray-300"
                required
              />
            </div>
          </div>

          {/* Last Donation */}
          <div className="grid grid-cols-12 gap-6 items-center">
            <label className="col-span-2 text-gray-700 text-right">
              Last Donation
            </label>
            <div className="col-span-10 grid grid-cols-2 gap-4">
              <input
                type="text"
                name="lastDonationMonth"
                value={formData.lastDonationMonth}
                onChange={handleChange}
                placeholder="Month"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-gray-500 placeholder-gray-300"
              />
              <input
                type="text"
                name="lastDonationYear"
                value={formData.lastDonationYear}
                onChange={handleChange}
                placeholder="Year"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-gray-500 placeholder-gray-300"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-8">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
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

export default EditProfile;
