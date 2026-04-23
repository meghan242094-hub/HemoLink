import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserBloodRequests } from '../services/bloodRequestService';
import { getUserConversations } from '../services/messageService';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Dashboard Page Component
 * Main dashboard showing user's requests and messages
 */
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myRequests, setMyRequests] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's blood requests
        const requestsRes = await getUserBloodRequests();
        setMyRequests(requestsRes.data || []);
      } catch (error) {
        console.error('Error fetching blood requests:', error);
        setMyRequests([]);
      }

      try {
        // Fetch conversations (optional - don't fail if this errors)
        const convRes = await getUserConversations();
        setConversations(convRes.data || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const activeRequests = myRequests ? myRequests.filter(req => req.status === 'active').length : 0;
  const fulfilledRequests = myRequests ? myRequests.filter(req => req.status === 'fulfilled').length : 0;
  const unreadMessages = conversations ? conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-primary-100">
            Blood Group: <span className="font-semibold">{user?.bloodGroup}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full">
                <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Requests</p>
                <p className="text-2xl font-bold text-gray-900">{activeRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Fulfilled Requests</p>
                <p className="text-2xl font-bold text-gray-900">{fulfilledRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900">{unreadMessages}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigate('/create-request')}
            className="bg-primary-600 text-white p-6 rounded-lg shadow-md hover:bg-primary-700 active:bg-primary-800 transition text-left cursor-pointer"
          >
            <div className="flex items-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Create Blood Request</h3>
                <p className="text-sm text-primary-100">Post a new blood donation request</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/requests')}
            className="bg-white text-gray-800 p-6 rounded-lg shadow-md hover:bg-gray-50 active:bg-gray-100 transition text-left border-2 border-primary-600 cursor-pointer"
          >
            <div className="flex items-center">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Find Blood Requests</h3>
                <p className="text-sm text-gray-600">Browse and help nearby requests</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">My Recent Requests</h2>
            <button
              onClick={() => navigate('/my-requests')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </button>
          </div>
          
          {myRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              You haven't created any blood requests yet.
            </p>
          ) : (
            <div className="space-y-4">
              {myRequests.slice(0, 3).map((request) => (
                <div key={request._id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {request.bloodGroup} - {request.unitsNeeded} unit{request.unitsNeeded > 1 ? 's' : ''} needed
                      </p>
                      <p className="text-sm text-gray-600">{request.hospitalName}</p>
                      <p className="text-sm text-gray-500">{request.location.city}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      request.status === 'active' ? 'bg-green-100 text-green-800' :
                      request.status === 'fulfilled' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Conversations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Conversations</h2>
            <button
              onClick={() => navigate('/chat')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </button>
          </div>
          
          {conversations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No conversations yet.
            </p>
          ) : (
            <div className="space-y-4">
              {conversations.slice(0, 3).map((conv) => (
                <div key={conv.bloodRequest._id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {conv.otherUser.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {conv.bloodRequest.bloodGroup} - {conv.bloodRequest.urgency}
                      </p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {conv.lastMessage.content}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
