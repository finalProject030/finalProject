import React from "react";
import InstagramIcon from "../../assets/Instagram.png";
import linkdinIcon from "../../assets/LinkdIn.png";
import FacebookIcon from "../../assets/Facebook.png";
import Review from "../components/Review";
import Icons from "../../assets/Icons.png";

const About = () => {
  return (
    <div className="bg-gradient-to-b from-gray-600 to-blue-300 min-h-screen flex flex-col relative">
      {/* Header Section */}
      <div className="text-center bg-white relative overflow-hidden px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Simplify Your Content Creation Process
        </h1>
        <p className="text-lg text-gray-800 leading-relaxed mb-6">
          Our AI-powered tool revolutionizes content creation by leveraging
          StackOverflow data. Say goodbye to time-consuming content crafting and
          hello to engaging posts in seconds!
        </p>
        <h2 className="text-xl text-gray-800 mt-4">
          Craft Posts for All Platforms with Ease
        </h2>
      </div>

      {/* Wave shape */}
      <div className=" left-0 w-full">
        <svg
          className="fill-current text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fillOpacity="1"
            d="M0,64L48,85.3C96,107,192,149,288,170.7C384,192,480,192,576,165.3C672,139,768,85,864,64C960,43,1056,53,1152,74.7C1248,96,1344,128,1392,144L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Icon Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Icon 1 */}
        <div className="flex flex-col items-center">
          <img src={InstagramIcon} className="w-12 h-12 mb-2" alt="Instagram" />
          <h3 className="text-lg font-semibold text-white">Instagram</h3>
          <p className="text-sm text-gray-300">
            Effortlessly create stunning posts
          </p>
        </div>

        {/* Icon 2 */}
        <div className="flex flex-col items-center">
          <img src={linkdinIcon} className="w-12 h-12 mb-2" alt="LinkedIn" />
          <h3 className="text-lg font-semibold text-white">LinkedIn</h3>
          <p className="text-sm text-gray-300">
            Elevate your professional presence
          </p>
        </div>

        {/* Icon 3 */}
        <div className="flex flex-col items-center">
          <img src={FacebookIcon} className="w-12 h-12 mb-2" alt="Facebook" />
          <h3 className="text-lg font-semibold text-white">Facebook</h3>
          <p className="text-sm text-gray-300">
            Engage your audience with captivating content
          </p>
        </div>
      </div>

      {/* Explanation Section */}
      <div className="flex flex-col md:flex-col items-center mb-8">
        <div className="md:w-1/2 mb-4 md:mb-0">
          <img src="{Icons}" alt="Explanation Image" className="w-full" />
        </div>
        <div className="md:w-1/2 text-white">
          <p className="text-lg">
            Easily create captivating content with our AI-powered tool. No more
            struggling with ideas or spending hours crafting posts. Our platform
            streamlines the process, allowing you to focus on what matters
            most—engaging with your audience.
          </p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="flex flex-col md:flex-row m-2 gap-2">
        <Review
          imageSrc={Icons}
          title="Impressive Results from Our Users"
          content="Our engagement doubled within weeks of using this tool!"
        />
        <Review
          imageSrc={InstagramIcon}
          title="Unlock Your Content Potential Today!"
          content="This tool has saved us countless hours of content creation."
        />
      </div>

      {/* Call-to-Action Section */}
      <div className="text-center mb-44">
        <p className="text-lg text-white mb-2">
          Ready to revolutionize your content creation?
        </p>
        <a
          href="/signup"
          className="bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300"
        >
          Sign Up Now
        </a>
      </div>
    </div>
  );
};

export default About;
