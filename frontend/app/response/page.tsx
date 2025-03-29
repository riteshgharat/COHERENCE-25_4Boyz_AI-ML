"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { saveApplicantData } from "../../firebase/firestore"; // Adjust the import path as necessary

function page() {
  const searchParams = useSearchParams();

  // Convert dob from DD-MM-YYYY to YYYY-MM-DD
  const formatDate = (dob: string | null) => {
    if (!dob) return "";
    const [day, month, year] = dob.split("-");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    firstName: searchParams.get("fname")?.split("_")[0] ?? "",
    lastName: searchParams.get("lname")?.split("_")[1] ?? "",
    dateOfBirth: formatDate(searchParams.get("dob")), // Format the dob
    governmentId: searchParams.get("govId") ?? "",
    email: searchParams.get("email") ?? "",
    phoneNumber: searchParams.get("phone") ?? "",
    jobRole: searchParams.get("jobRole") ?? "",
    interviewMode: searchParams.get("interviewMode") ?? "online", // Default to online
    venue: searchParams.get("venue") ?? "",
    meetingLink: searchParams.get("meetingLink") ?? "",
    isConfirmed: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Reset error state
    setError(null);

    // Validate confirmation and Gmail
    if (!formData.isConfirmed) {
      alert("Please confirm your details before submitting.");
      return;
    }

    // Basic Gmail validation
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!formData.email || !gmailRegex.test(formData.email)) {
      alert("Please enter a valid Gmail address.");
      return;
    }

    // Validate interview details based on mode
    if (formData.interviewMode === "online" && !formData.meetingLink) {
      alert("Please enter a meeting link for the online interview.");
      return;
    }

    if (formData.interviewMode === "offline" && !formData.venue) {
      alert("Please enter a venue for the offline interview.");
      return;
    }

    // Set submitting state to show loading indicator
    setSubmitting(true);

    try {
      // Data to be submitted to Firestore (excluding isConfirmed flag)
      const dataToSubmit = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        governmentId: formData.governmentId,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        jobRole: formData.jobRole,
        interviewMode: formData.interviewMode,
        // Include either venue or meetingLink based on the interview mode
        ...(formData.interviewMode === "offline"
          ? { venue: formData.venue }
          : { meetingLink: formData.meetingLink }),
      };

      // Save to Firestore using our imported function
      const docId = await saveApplicantData(dataToSubmit);
      console.log("Document written with ID: ", docId);
      console.log("Personal details submitted:", dataToSubmit);

      // Show success state
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting form: ", err);
      setError("Failed to submit your application. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      governmentId: "",
      email: "",
      phoneNumber: "",
      jobRole: "",
      interviewMode: "online",
      venue: "",
      meetingLink: "",
      isConfirmed: false,
    });
    setSubmitted(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Personal Details
            </h2>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
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
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700"
              >
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
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                pattern="[a-zA-Z0-9._%+-]+@gmail\.com$"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="example@gmail.com"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
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
              <label
                htmlFor="jobRole"
                className="block text-sm font-medium text-gray-700"
              >
                Job Role
              </label>
              <textarea
                id="jobRole"
                name="jobRole"
                rows={3}
                value={formData.jobRole}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Job role you are applying for"
              />
            </div>

            <div>
              <label
                htmlFor="governmentId"
                className="block text-sm font-medium text-gray-700"
              >
                Government ID
              </label>
              <input
                type="text"
                id="governmentId"
                name="governmentId"
                value={formData.governmentId}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter Government ID (PAN/Adhaar/Voter ID)"
              />
            </div>

            <div>
              <label
                htmlFor="interviewMode"
                className="block text-sm font-medium text-gray-700"
              >
                Interview Mode
              </label>
              <select
                id="interviewMode"
                name="interviewMode"
                value={formData.interviewMode}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            {formData.interviewMode === "online" ? (
              <div>
                <label
                  htmlFor="meetingLink"
                  className="block text-sm font-medium text-gray-700"
                >
                  Meeting Link
                </label>
                <input
                  type="url"
                  id="meetingLink"
                  name="meetingLink"
                  value={formData.meetingLink}
                  readOnly
                  required={formData.interviewMode === "online"}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter meeting link (e.g., Zoom, Google Meet)"
                />
              </div>
            ) : (
              <div>
                <label
                  htmlFor="venue"
                  className="block text-sm font-medium text-gray-700"
                >
                  Venue
                </label>
                <textarea
                  id="venue"
                  name="venue"
                  rows={2}
                  value={formData.venue}
                  readOnly
                  required={formData.interviewMode === "offline"}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter interview venue address"
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="confirm"
                name="isConfirmed"
                checked={formData.isConfirmed}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="confirm"
                className="ml-2 block text-sm text-gray-900"
              >
                I confirm my details are correct
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={!formData.isConfirmed || submitting}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Details"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Details Submitted!
            </h2>
            <p className="text-gray-700">
              Your personal information has been recorded.
            </p>
            <p className="text-gray-700 mt-2">
              {formData.interviewMode === "online"
                ? `You'll be interviewed online. Check your email for the meeting link.`
                : `Your interview will be held at the provided venue. Please arrive on time.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
