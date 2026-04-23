import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBloodRequest } from '../services/bloodRequestService';
import toast from 'react-hot-toast';

/**
 * CreateRequest Page Component
 * Form to create a new blood donation request
 */
const CreateRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: '',
    unitsNeeded: 1,
    urgency: 'normal',
    hospitalName: '',
    location: {
      address: '',
      city: '',
      state: '',
      coordinates: [0, 0]
    },
    patientName: '',
    patientAge: '',
    contactPerson: '',
    contactPhone: '',
    additionalNotes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For demo purposes, using default coordinates
      const requestData = {
        ...formData,
        location: {
          type: 'Point',
          ...formData.location,
          coordinates: [77.2090, 28.6139]
        },
        patientAge: parseInt(formData.patientAge)
      };

      await createBloodRequest(requestData);
      toast.success('Blood request created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error(error.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Blood Request</h1>
          <p className="mt-2 text-gray-600">
            Fill in the details to post a blood donation request
          </p>
        </div>

        {/* Form */}
        <form className="bg-white shadow-lg rounded-lg p-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blood Group */}
            <div>
              <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group Required *
              </label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                required
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            {/* Units Needed */}
            <div>
              <label htmlFor="unitsNeeded" className="block text-sm font-medium text-gray-700 mb-1">
                Units Needed *
              </label>
              <input
                id="unitsNeeded"
                name="unitsNeeded"
                type="number"
                min="1"
                max="10"
                required
                value={formData.unitsNeeded}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Urgency */}
            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
                Urgency Level *
              </label>
              <select
                id="urgency"
                name="urgency"
                required
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Hospital Name */}
            <div>
              <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 mb-1">
                Hospital Name *
              </label>
              <input
                id="hospitalName"
                name="hospitalName"
                type="text"
                required
                value={formData.hospitalName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="City Hospital"
              />
            </div>

            {/* Patient Name */}
            <div>
              <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name *
              </label>
              <input
                id="patientName"
                name="patientName"
                type="text"
                required
                value={formData.patientName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="John Doe"
              />
            </div>

            {/* Patient Age */}
            <div>
              <label htmlFor="patientAge" className="block text-sm font-medium text-gray-700 mb-1">
                Patient Age *
              </label>
              <input
                id="patientAge"
                name="patientAge"
                type="number"
                min="0"
                max="120"
                required
                value={formData.patientAge}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="35"
              />
            </div>

            {/* Contact Person */}
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person *
              </label>
              <input
                id="contactPerson"
                name="contactPerson"
                type="text"
                required
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Jane Doe"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone *
              </label>
              <input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                required
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="+91 9876543210"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label htmlFor="location.address" className="block text-sm font-medium text-gray-700 mb-1">
                Hospital Address *
              </label>
              <input
                id="location.address"
                name="location.address"
                type="text"
                required
                value={formData.location.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="123 Main Street"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="location.city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                id="location.city"
                name="location.city"
                type="text"
                required
                value={formData.location.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="New Delhi"
              />
            </div>

            {/* State */}
            <div>
              <label htmlFor="location.state" className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                id="location.state"
                name="location.state"
                type="text"
                required
                value={formData.location.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Delhi"
              />
            </div>

            {/* Additional Notes */}
            <div className="md:col-span-2">
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                rows="3"
                maxLength="500"
                value={formData.additionalNotes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Any additional information about the request..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.additionalNotes.length}/500 characters
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating Request...' : 'Create Request'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequest;
