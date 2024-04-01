import React from "react";

const About = () => {
  return (
    <div className="bg-gradient-to-b  from-gray-600 to-blue-300 h-screen flex justify-center items-center">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>
        <p className="text-lg text-gray-700 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
          finibus libero. Integer id nunc ac eros porttitor fermentum. Donec
          sagittis placerat ex, sit amet tempor elit maximus vel. Integer
          ullamcorper eros eu leo efficitur, id dapibus risus efficitur. Duis
          sed augue id quam interdum pharetra sed nec lorem. Vestibulum in
          lacinia purus, et vehicula mi. Cras congue sem at libero lobortis
          tincidunt.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default About;
