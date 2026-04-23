import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import { getUserBloodRequests } from '../services/bloodRequestService';

/**
 * Profile Page Component
 * Displays user profile information
 */
const Profile = () => {
  const { user } = useAuth();
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsRes = await getUserBloodRequests();
        setMyRequests(requestsRes.data || []);
      } catch (error) {
        console.error('Error fetching blood requests:', error);
        setMyRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const activeRequests = myRequests.filter(req => req.status === 'active').length;
  const fulfilledRequests = myRequests.filter(req => req.status === 'fulfilled').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white px-6 py-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-primary-100 mt-2">View and manage your account information</p>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Profile Card */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group
                  </label>
                  <div className="bg-white px-4 py-2 rounded-md border border-gray-300">
                    <span className="font-semibold text-primary-600 text-lg">{user.bloodGroup}</span>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="bg-white px-4 py-2 rounded-md border border-gray-300">
                    <span className="text-gray-900">{user.phone}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="bg-white px-4 py-2 rounded-md border border-gray-300">
                    <span className="text-gray-900">
                      {user.location?.city}, {user.location?.state}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="bg-white px-4 py-2 rounded-md border border-gray-300">
                    <span className="text-gray-900">{user.location?.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary-600">{myRequests.length}</div>
                <div className="text-sm text-gray-600 mt-1">Blood Requests Created</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600">{fulfilledRequests}</div>
                <div className="text-sm text-gray-600 mt-1">Requests Fulfilled</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{activeRequests}</div>
                <div className="text-sm text-gray-600 mt-1">Active Requests</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
