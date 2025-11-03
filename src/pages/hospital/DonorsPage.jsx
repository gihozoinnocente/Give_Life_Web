import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Phone, MapPin, Calendar, Award, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';

function DonorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState('all');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [expandedDonorId, setExpandedDonorId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Close modal when clicking backdrop or pressing Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setExpandedDonorId(null);
      }
    };

    if (expandedDonorId) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [expandedDonorId]);

  // Fetch donors from API
  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/donors`);
      const data = await response.json();
      
      if (data.status === 'success') {
        // Transform API data to match component format
        const transformedDonors = data.data.map(donor => {
          // Handle different field name formats from API
          const firstName = donor.firstName || donor.first_name || '';
          const lastName = donor.lastName || donor.last_name || '';
          const fullName = `${firstName} ${lastName}`.trim() || 'Unknown Donor';
          
          // Calculate last donation from month and year
          const lastDonation = calculateLastDonationFromMonthYear(
            donor.lastDonationMonth || donor.last_donation_month,
            donor.lastDonationYear || donor.last_donation_year
          );
          
          // Determine eligibility (can donate if last donation was 3+ months ago)
          const isEligible = checkEligibility(
            donor.lastDonationMonth || donor.last_donation_month,
            donor.lastDonationYear || donor.last_donation_year
          );
          
          return {
            id: donor.id,
            name: fullName,
            bloodType: donor.bloodGroup || donor.blood_group || 'Unknown',
            phone: donor.phoneNumber || donor.phone_number || 'N/A',
            location: `${donor.district || 'Unknown'}, ${donor.state || 'Rwanda'}`,
            lastDonation: lastDonation,
            totalDonations: 0, // Can be calculated from donations table
            status: isEligible ? 'eligible' : 'not_eligible',
            distance: 'N/A',
            email: donor.email
          };
        });
        setDonors(transformedDonors);
      }
    } catch (err) {
      console.error('Error fetching donors:', err);
      setError('Failed to load donors');
    } finally {
      setLoading(false);
    }
  };

  const calculateLastDonationFromMonthYear = (month, year) => {
    if (!month || !year) return 'Never';
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 0-indexed
    
    const monthsDiff = (currentYear - year) * 12 + (currentMonth - month);
    
    if (monthsDiff < 1) return 'This month';
    if (monthsDiff === 1) return '1 month ago';
    if (monthsDiff < 12) return `${monthsDiff} months ago`;
    
    const years = Math.floor(monthsDiff / 12);
    if (years === 1) return '1 year ago';
    return `${years} years ago`;
  };

  const checkEligibility = (lastDonationMonth, lastDonationYear) => {
    if (!lastDonationMonth || !lastDonationYear) return true; // Never donated, eligible
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    const monthsSinceLastDonation = (currentYear - lastDonationYear) * 12 + (currentMonth - lastDonationMonth);
    
    // Can donate if 3+ months since last donation
    return monthsSinceLastDonation >= 3;
  };

  const mockDonors = [
    {
      id: 1,
      name: 'John Doe',
      bloodType: 'O+',
      phone: '+250 788 123 456',
      location: 'Kigali, Gasabo',
      lastDonation: '2 months ago',
      totalDonations: 12,
      status: 'eligible',
      distance: '2.5 km'
    },
    {
      id: 2,
      name: 'Jane Smith',
      bloodType: 'A+',
      phone: '+250 788 234 567',
      location: 'Kigali, Kicukiro',
      lastDonation: '4 months ago',
      totalDonations: 8,
      status: 'eligible',
      distance: '5.1 km'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      bloodType: 'B+',
      phone: '+250 788 345 678',
      location: 'Kigali, Nyarugenge',
      lastDonation: '1 month ago',
      totalDonations: 15,
      status: 'not_eligible',
      distance: '3.8 km'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      bloodType: 'AB+',
      phone: '+250 788 456 789',
      location: 'Kigali, Gasabo',
      lastDonation: '6 months ago',
      totalDonations: 5,
      status: 'eligible',
      distance: '1.2 km'
    },
    {
      id: 5,
      name: 'David Brown',
      bloodType: 'O-',
      phone: '+250 788 567 890',
      location: 'Kigali, Kicukiro',
      lastDonation: '3 months ago',
      totalDonations: 20,
      status: 'eligible',
      distance: '4.5 km'
    },
    {
      id: 6,
      name: 'Emily Davis',
      bloodType: 'A-',
      phone: '+250 788 678 901',
      location: 'Kigali, Nyarugenge',
      lastDonation: '5 months ago',
      totalDonations: 10,
      status: 'eligible',
      distance: '6.2 km'
    }
  ];

  const bloodTypes = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Use real donors if available, otherwise use mock data
  const displayDonors = donors.length > 0 ? donors : mockDonors;

  const filteredDonors = displayDonors.filter(donor => {
    if (selectedBloodType !== 'all' && donor.bloodType !== selectedBloodType) return false;
    if (searchTerm && !donor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !donor.location.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDonors = filteredDonors.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const stats = {
    total: displayDonors.length,
    eligible: displayDonors.filter(d => d.status === 'eligible').length,
    notEligible: displayDonors.filter(d => d.status === 'not_eligible').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading donors...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchDonors}
          className="mt-2 text-red-600 hover:text-red-700 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registered Donors</h1>
          <p className="text-gray-600 mt-1">Find and connect with blood donors</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Donors</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Eligible Now</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.eligible}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Not Eligible</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.notEligible}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Donors Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredDonors.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No donors found matching your criteria</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Donor Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Blood Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedDonors.map((donor) => (
                    <tr key={donor.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {donor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{donor.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                          {donor.bloodType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {donor.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {donor.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setExpandedDonorId(donor.id)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                  <span className="font-semibold">{Math.min(endIndex, filteredDonors.length)}</span> of{' '}
                  <span className="font-semibold">{filteredDonors.length}</span> results
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded text-sm font-medium transition ${
                          currentPage === page
                            ? 'bg-red-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Popup Card */}
      {expandedDonorId && (() => {
        const selectedDonor = displayDonors.find(d => d.id === expandedDonorId);
        if (!selectedDonor) return null;
        
        return (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div 
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative transform transition-all pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setExpandedDonorId(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              <div className="space-y-4">
                {/* Header */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {selectedDonor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedDonor.name}</h3>
                      <p className="text-sm text-gray-500">{selectedDonor.location}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                      {selectedDonor.bloodType}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">Phone:</span>
                    <span className="text-sm text-gray-900 font-semibold">{selectedDonor.phone}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">Last Donation:</span>
                    <span className="text-sm text-gray-900">{selectedDonor.lastDonation}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">Total Donations:</span>
                    <span className="text-sm text-gray-900 font-semibold">{selectedDonor.totalDonations}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600 font-medium">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedDonor.status === 'eligible' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedDonor.status === 'eligible' ? 'Eligible' : 'Not Eligible'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-200 flex space-x-3">
                  <button className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm">
                    Contact
                  </button>
                  <button className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default DonorsPage;
