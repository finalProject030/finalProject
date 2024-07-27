import React from "react";

const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">Page not found</p>
      <a href="/" className="text-blue-500 underline hover:text-blue-700">
        Go back to Home
      </a>
    </div>
  </div>
);

export default NotFound;
