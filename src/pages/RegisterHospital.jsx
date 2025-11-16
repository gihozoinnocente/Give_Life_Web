import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '../components/ToastProvider.jsx';
import { registerHospital, reset } from '../features/auth/authSlice';
import Navbar from '../components/Navbar';

function RegisterHospital() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    hospitalName: '',
    address: '',
    headOfHospital: '',
    phoneNumber: '',
    email: '',
    password: ''
  });

  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);

  // Hospital list organized by province
  const hospitals = {
    'Kigali City': [
      'University Teaching Hospital of Kigali (CHUK)',
      'Hopital la Croix du Sud (HCS)',
      'Kacyiru Police Hospital',
      'Frontier Diagnostic Center',
      'Muhima Hospital',
      'Kibagabaga Hospital',
      'Rwanda Military Referral and Teaching Hospital',
      'King Faisal Hospital Kigali',
      'Ndera Neuropsychiatric Teaching Hospital',
      'Masaka Hospital',
      'Nyarugenge Hospital',
      'WIWO Specialized Hospital',
      'BAHO International hospital'
    ],
    'Eastern Province': [
      'Rwinkwavu Hospital',
      'Kirehe Hospital',
      'Kibungo Hospital',
      'Nyagatare Hospital',
      'Gatunda Hospital',
      'Gahini Hospital',
      'Rilima Pediatric Orthopedic Hospital',
      'Nyamata Hospital',
      'Ngarama District Hospital',
      'Kiziguro Hospital',
      'Rwamagana Hospital'
    ],
    'Western Province': [
      'Kirinda Hospital',
      'Kibuye Hospital',
      'Shyira Hospital',
      'Murunda Hospital',
      'Kabaya Hospital',
      'Gisenyi Hospital',
      'Mibilizi Hospital',
      'Kibogora Hospital',
      'Muhororo Hospital',
      'Gihundwe Hospital',
      'Bushenge Hospital',
      'Mugonero Hospital'
    ],
    'Northern Province': [
      'Ruhengeri Hospital',
      'Rutongo Hospital',
      'Butaro Hospital',
      'Byumba Hospital',
      'Ruli Hospital',
      'Nemba Hospital',
      'Kinihira Hospital',
      'Gatonde Hospital'
    ],
    'Southern Province': [
      'Kabgayi Hospital',
      'Kaduha Hospital',
      'Kibilizi Hospital',
      'Gitwe Hospital',
      'Nyabikenke Hospital',
      'Nyanza Hospital',
      'Munini Hospital',
      'Kigeme Hospital',
      'Gakoma Hospital',
      'Kabutare Hospital',
      'Remera-Rukoma Hospital',
      'University Teaching Hospital of Butare (CHUB)',
      'Ruhango Hospital',
      'HVP Gatagara Orthopedic and Rehabilitation Hospital'
    ]
  };

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const toast = useToast();

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success('Hospital registered successfully. You can now log in.');
      navigate('/login');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const hospitalData = {
      email: formData.email,
      password: formData.password,
      hospitalName: formData.hospitalName,
      address: formData.address,
      headOfHospital: formData.headOfHospital,
      phoneNumber: formData.phoneNumber,
    };

    dispatch(registerHospital(hospitalData));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section with Gradient */}
      <div className="relative bg-gradient-to-r from-pink-900 via-pink-700 to-pink-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">Register As An Hospital</h1>
        </div>
      </div>

      {/* Registration Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Toasts handle error/success messages */}
          {/* Email */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <label className="text-gray-700 font-medium pt-2">
              Email
            </label>
            <div className="md:col-span-2">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hospital@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <label className="text-gray-700 font-medium pt-2">
              Password
            </label>
            <div className="md:col-span-2">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a secure password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
                minLength="6"
              />
            </div>
          </div>

          {/* Hospital Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <label className="text-gray-700 font-medium pt-2">
              Hospital Name
            </label>
            <div className="md:col-span-2">
              <select
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
                required
              >
                <option value="">Select a hospital</option>
                {Object.entries(hospitals).map(([province, hospitalList]) => (
                  <optgroup key={province} label={province}>
                    {hospitalList.map((hospital) => (
                      <option key={hospital} value={hospital}>
                        {hospital}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
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
          <div className="flex justify-start pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Submit</span>
                  <CheckCircle className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterHospital;
