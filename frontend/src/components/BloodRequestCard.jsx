import React from 'react';
import { Link } from 'react-router-dom';

/**
 * BloodRequestCard Component
 * Displays a single blood request with key information
 */
const BloodRequestCard = ({ request, onExpressInterest }) => {
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      {/* Header with blood group and urgency */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl font-bold text-primary-600">
            {request.bloodGroup}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getUrgencyColor(request.urgency)}`}>
            {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
          </span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </div>

      {/* Patient Information */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="font-medium">{request.patientName}</span>
          <span className="mx-2">•</span>
          <span>{request.patientAge} years</span>
        </div>

        <div className="flex items-center text-gray-600">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>{request.hospitalName}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{request.location.city}, {request.location.state}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Posted: {formatDate(request.createdAt)}</span>
        </div>
      </div>

      {/* Units needed */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="font-semibold text-primary-600">
            {request.unitsNeeded} unit{request.unitsNeeded > 1 ? 's' : ''} needed
          </span>
        </div>
        
        {request.interestedDonors && request.interestedDonors.length > 0 && (
          <span className="text-sm text-gray-500">
            {request.interestedDonors.length} interested
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex space-x-3">
        <Link
          to={`/requests/${request._id}`}
          className="flex-1 bg-primary-600 text-white text-center py-2 rounded-md hover:bg-primary-700 transition font-semibold"
        >
          View Details
        </Link>
        
        {request.status === 'active' && onExpressInterest && (
          <button
            onClick={() => onExpressInterest(request._id)}
            className="flex-1 border-2 border-primary-600 text-primary-600 py-2 rounded-md hover:bg-primary-50 transition font-semibold"
          >
            I Can Help
          </button>
        )}
      </div>
    </div>
  );
};

export default BloodRequestCard;
