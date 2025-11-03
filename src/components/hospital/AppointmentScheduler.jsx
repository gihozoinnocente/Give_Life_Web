import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, Plus, X, Check, AlertCircle } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';

const AppointmentScheduler = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentForm, setAppointmentForm] = useState({
    donorName: '',
    bloodType: '',
    date: '',
    time: '',
    location: '',
    notes: '',
  });

  // Mock appointments data
  const upcomingAppointments = [
    {
      id: 1,
      donorName: 'John Smith',
      bloodType: 'O+',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      time: '10:00 AM',
      status: 'confirmed',
      location: 'Main Building - Room 201',
    },
    {
      id: 2,
      donorName: 'Sarah Johnson',
      bloodType: 'A+',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      time: '11:30 AM',
      status: 'confirmed',
      location: 'Main Building - Room 201',
    },
    {
      id: 3,
      donorName: 'Mike Davis',
      bloodType: 'B+',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: '09:00 AM',
      status: 'pending',
      location: 'Main Building - Room 201',
    },
    {
      id: 4,
      donorName: 'Emily Wilson',
      bloodType: 'AB+',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: '02:00 PM',
      status: 'confirmed',
      location: 'Main Building - Room 201',
    },
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM',
  ];

  const handleScheduleAppointment = (e) => {
    e.preventDefault();
    console.log('Scheduling appointment:', appointmentForm);
    setShowModal(false);
    setAppointmentForm({
      donorName: '',
      bloodType: '',
      date: '',
      time: '',
      location: '',
      notes: '',
    });
    alert('Appointment scheduled successfully!');
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Appointment Scheduler</h3>
          <p className="text-sm text-gray-600 mt-1">Manage donor appointments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-blue-600 mb-1">Today</p>
          <p className="text-2xl font-bold text-blue-900">8</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-green-600 mb-1">This Week</p>
          <p className="text-2xl font-bold text-green-900">32</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3">
          <p className="text-xs text-yellow-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">5</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <p className="text-xs text-purple-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-purple-900">156</p>
        </div>
      </div>

      {/* Mini Calendar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900 text-sm">Week View</h4>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded">
              <span className="text-sm">←</span>
            </button>
            <span className="text-sm font-medium">{format(selectedDate, 'MMM yyyy')}</span>
            <button className="p-1 hover:bg-gray-100 rounded">
              <span className="text-sm">→</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {getWeekDays().map((day, index) => {
            const appointmentCount = upcomingAppointments.filter(
              (apt) => format(apt.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
            ).length;
            return (
              <div
                key={index}
                className={`p-2 rounded-lg text-center cursor-pointer transition ${
                  format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                    ? 'bg-red-100 border-2 border-red-600'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <p className="text-xs text-gray-600">{format(day, 'EEE')}</p>
                <p className="text-lg font-bold text-gray-900">{format(day, 'd')}</p>
                {appointmentCount > 0 && (
                  <p className="text-xs text-red-600 font-medium">{appointmentCount} apt</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 text-sm">Upcoming Appointments</h4>
        {upcomingAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-700 font-bold">{appointment.bloodType}</span>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-semibold text-gray-900">{appointment.donorName}</p>
                  {getStatusBadge(appointment.status)}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(appointment.date, 'MMM dd, yyyy')}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.time}</span>
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{appointment.location}</span>
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                <Check className="w-5 h-5" />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Schedule Appointment</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleScheduleAppointment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donor Name
                  </label>
                  <input
                    type="text"
                    value={appointmentForm.donorName}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, donorName: e.target.value })
                    }
                    placeholder="Enter donor name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Type
                  </label>
                  <select
                    value={appointmentForm.bloodType}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, bloodType: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select blood type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, date: e.target.value })
                    }
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <select
                    value={appointmentForm.time}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, time: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={appointmentForm.location}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, location: e.target.value })
                    }
                    placeholder="e.g., Main Building - Room 201"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={appointmentForm.notes}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, notes: e.target.value })
                    }
                    rows={3}
                    placeholder="Additional notes..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Schedule Appointment
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentScheduler;
