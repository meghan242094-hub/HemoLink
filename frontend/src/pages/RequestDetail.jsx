import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBloodRequestById } from '../services/bloodRequestService';
import { createConversation } from '../services/messageService';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

/**
 * RequestDetail Page Component
 * Displays detailed information about a specific blood request
 */
const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await getBloodRequestById(id);
        setRequest(response.data);
      } catch (error) {
        toast.error('Failed to fetch request details');
        navigate('/requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id, navigate]);

  const handleExpressInterest = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to express interest');
      navigate('/login');
      return;
    }
    toast.success('Interest expressed! You can now contact the recipient.');
    // In a real app, this would call an API to express interest
  };

  const handleContactRecipient = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to contact the recipient');
      navigate('/login');
      return;
    }

    try {
      // Create a conversation with the request recipient
      await createConversation({
        recipient: request.recipient._id,
        bloodRequest: request._id
      });
      toast.success('Conversation started!');
      navigate('/chat');
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to start conversation');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Request not found</div>
      </div>
    );
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'urgent':
        return 'bg-orange-500 text-white';
      case 'normal':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'fulfilled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/requests')}
          className="mb-6 text-primary-600 hover:text-primary-700 font-semibold flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Requests
        </button>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white px-6 py-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">Blood Request Details</h1>
                <p className="text-primary-100">Request ID: {request._id}</p>
              </div>
              <div className="flex space-x-2">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getUrgencyColor(request.urgency)}`}>
                  {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Blood Group */}
            <div className="mb-8">
              <div className="flex items-center justify-between p-6 bg-primary-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Blood Group Required</p>
                  <p className="text-4xl font-bold text-primary-600">{request.bloodGroup}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Units Needed</p>
                  <p className="text-4xl font-bold text-primary-600">{request.unitsNeeded}</p>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Patient Name</p>
                  <p className="font-semibold text-gray-900">{request.patientName}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Age</p>
                  <p className="font-semibold text-gray-900">{request.patientAge} years</p>
                </div>
              </div>
            </div>

            {/* Hospital Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Hospital Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Hospital Name</p>
                <p className="font-semibold text-gray-900">{request.hospitalName}</p>
              </div>
            </div>

            {/* Location */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Address</p>
                <p className="font-semibold text-gray-900">{request.location?.address}</p>
                <p className="text-gray-600 mt-2">{request.location?.city}, {request.location?.state}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Contact Person</p>
                  <p className="font-semibold text-gray-900">{request.contactPerson}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                  <p className="font-semibold text-gray-900">{request.contactPhone}</p>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Request Details</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Posted On</p>
                    <p className="font-semibold text-gray-900">{formatDate(request.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Expires On</p>
                    <p className="font-semibold text-gray-900">{formatDate(request.expiresAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {request.notes && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Notes</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">{request.notes}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {request.status === 'active' && (
              <div className="flex space-x-4">
                <button
                  onClick={handleExpressInterest}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  I Can Help
                </button>
                <button
                  onClick={handleContactRecipient}
                  className="flex-1 border-2 border-primary-600 text-primary-600 py-3 rounded-lg hover:bg-primary-50 transition font-semibold"
                >
                  Contact Recipient
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
