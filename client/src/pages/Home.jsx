import React from "react";

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-gray-600 to-blue-300 min-h-screen flex flex-col justify-center items-center text-white">
      <h1 className="text-4xl font-extrabold mb-6">Welcome to Our Website</h1>
      <p className="text-lg text-center mb-8">
        Discover amazing content, connect with our community, and stay up to
        date with the latest trends.
      </p>
      <button className="bg-white text-blue-600 hover:bg-blue-100 hover:text-blue-600 font-semibold py-3 px-8 rounded-full transition duration-300">
        Get Started
      </button>
    </div>
  );
};

export default Home;
