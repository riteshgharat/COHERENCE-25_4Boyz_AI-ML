"use client";

import React, { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function page() {
    const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    firstName: searchParams.get('fname') ?? '',
    lastName: searchParams.get('lname') ?? '',
    dateOfBirth: searchParams.get('dob') ?? '',
    governmentId: null,
    email: searchParams.get('email') ?? '',
    phoneNumber: searchParams.get('phone') ?? '',
    jobRole: searchParams.get('jobRole') ?? '',
    isConfirmed: false
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' 
        ? checked 
        : (type === 'file' 
          ? files[0] 
          : value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate confirmation and Gmail
    if (!formData.isConfirmed) {
      alert('Please confirm your details before submitting.');
      return;
    }

    // Basic Gmail validation
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!formData.email || !gmailRegex.test(formData.email)) {
      alert('Please enter a valid Gmail address.');
      return;
    }

    // Simulate form submission
    console.log('Personal details submitted:', formData);
    setSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      governmentId: null,
      email: '',
      phoneNumber: '',
      jobRole: '',
      isConfirmed: false
    });
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800">Personal Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="gmail" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="gmail"
                name="gmail"
                value={formData.email}
                onChange={handleChange}
                required
                pattern="[a-zA-Z0-9._%+-]+@gmail\.com$"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="example@gmail.com"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="10-digit phone number"
              />
            </div>

            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
                Job Role
              </label>
              <textarea
                id="interests"
                name="interests"
                rows={3}
                value={formData.jobRole}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Job role you are applying for"
              />
            </div>

            <div>
              <label htmlFor="governmentId" className="block text-sm font-medium text-gray-700 mb-2">
                Government ID (Passport/Driver's License/National ID)
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex-grow">
                  <input
                    type="file"
                    id="governmentId"
                    name="governmentId"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleChange}
                    required
                    className="hidden"
                  />
                  <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    {formData.governmentId ? formData.governmentId.name : 'Upload Government ID'}
                  </span>
                </label>
                {formData.governmentId && (
                  <CheckCircle className="text-green-500 h-6 w-6" />
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Accepted formats: JPEG, PNG, PDF. Max size 5MB.
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="confirm"
                name="isConfirmed"
                checked={formData.isConfirmed}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="confirm" className="ml-2 block text-sm text-gray-900">
                I confirm my details are correct
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={!formData.isConfirmed}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Details
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Details Submitted!</h2>
            <p className="text-gray-700">Your personal information has been recorded.</p>
            <div className="mt-4 space-y-2 text-left">
              <p className="text-sm text-gray-600">
                <strong>Submitted Details:</strong>
              </p>
              <p className="text-sm text-gray-600">Name: {formData.firstName} {formData.lastName}</p>
              <p className="text-sm text-gray-600">Date of Birth: {formData.dateOfBirth}</p>
              <p className="text-sm text-gray-600">Gmail: {formData.email}</p>
              <p className="text-sm text-gray-600">Phone: {formData.phoneNumber}</p>
              {formData.governmentId && (
                <p className="text-sm text-gray-600">Government ID: {formData.governmentId.name}</p>
              )}
              {formData.jobRole && (
                <p className="text-sm text-gray-600">Interests: {formData.jobRole}</p>
              )}
              <button
                onClick={resetForm}
                className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Submit New Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default page;