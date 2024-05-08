import React from "react";
import backgroundVideo from "../../backgroundVideo1.mp4";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative bg-gradient-to-b from-gray-600 to-blue-300 flex flex-col justify-center items-center text-white">
      {/* Video Background */}
      <div
        className="relative w-full overflow-hidden m-0 p-0"
        style={{ height: "70vh" }}
      >
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
          id="video"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-black opacity-50" />

      {/* Content */}
      <div className="relative z-20 text-center flex flex-col justify-center items-center mt-8">
        <h1 className="text-4xl font-extrabold mb-6">Welcome!</h1>
        <p className="text-lg text-center mb-8 mx-4">
          Discover amazing content, connect with our community, and stay up to
          date with the latest trends.
        </p>
        <Link to="/about">
          <button className="bg-white text-blue-600 hover:bg-blue-100 hover:text-blue-600 font-semibold py-3 px-8 mb-8 rounded-full transition duration-300">
            Learn More
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
