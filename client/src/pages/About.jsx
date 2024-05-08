import React from "react";
import InstagramIcon from "../../assets/Instagram.png";
import linkdinIcon from "../../assets/LinkdIn.png";
import FacebookIcon from "../../assets/Facebook.png";
import Review from "../components/Review";
import Icons from "../../assets/Icons.png";
import ClockIcon from "../../assets/Clock.png";
import FeaturesIcon from "../../assets/Features.png";
import TwitterIcon from "../../assets/Twitter.png";
import SocialAIIcon from "../../assets/SocialAi.png";
import { Link } from "react-router-dom";
import "./About.css"; // Import CSS file for animations
import LinkedInPage from "../components/LinkedInPage";




const About = () => {
  return (
    <div className="bg-gradient-to-b from-gray-600 to-blue-300 min-h-screen flex flex-col relative">
      {/* Header Section */}
      <div className="text-center bg-white relative overflow-hidden px-4 py-8 dark:bg-gray-800">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-white">
          Simplify Your Content Creation Process
        </h1>
        <p className="text-lg text-gray-800 leading-relaxed mb-6 dark:text-gray-300">
          Our AI-powered tool revolutionizes content creation by leveraging
          StackOverflow data. Say goodbye to time-consuming content crafting and
          hello to engaging posts in seconds!
        </p>
        <h2 className="text-xl text-gray-800 mt-4 dark:text-gray-300">
          Craft Posts for All Platforms with Ease
        </h2>
      </div>
      {/* Wave shape */}
      <div className="left-0 w-full">
        <svg
          className="fill-current text-white dark:text-gray-800"
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 fade-in">
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

        {/* Icon 4 */}
        <div className="flex flex-col items-center">
          <img src={TwitterIcon} className="w-12 h-12 mb-2" alt="Twitter" />
          <h3 className="text-lg font-semibold text-white">Twitter</h3>
          <p className="text-sm text-gray-300">
            Stay connected and share your thoughts
          </p>
        </div>
      </div>
      {/* Explanation Section */}
      <div className="flex flex-col items-center md:flex-row pb-10 pt-10 mb-8 bg-white dark:bg-gray-800 text-black dark:text-white fade-in">
        <div className="md:w-full text-black dark:text-white">
          <h2 className="text-4xl font-semibold mb-6 p-4 text-center">
            How it Works
          </h2>
          <div className="flex flex-col md:flex-row-reverse items-center justify-center">
            <div className="md:w-2/5 mb-4 md:mb-0">
              <img
                src={SocialAIIcon}
                alt="Explanation Image"
                className="w-full rounded-lg shadow-md"
              />
            </div>
            <div className="md:w-3/5 p-4">
              <p className="text-lg leading-relaxed font-medium mb-4">
                Easily create captivating content with our AI-powered tool. No
                more struggling with ideas or spending hours crafting posts. Our
                platform streamlines the process, allowing you to focus on what
                matters most—engaging with your audience.
              </p>
              <p className="text-lg leading-relaxed font-medium">
                Here's how it works:
              </p>
              <ul className="list-disc list-inside mt-2">
                <li className="text-gray-600 dark:text-gray-400">
                  Enter your topic or idea
                </li>
                <li className="text-gray-600 dark:text-gray-400">
                  Our AI analyzes StackOverflow data
                </li>
                <li className="text-gray-600 dark:text-gray-400">
                  Generate engaging content instantly
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* User Reviews */}
      <div className="text-center w-full mb-10 mt-10">
        <h2 className="text-3xl font-semibold mb-4 dark:text-white">
          User Reviews
        </h2>
      </div>
      {/* Reviews Section */}
      <div className="flex flex-col lg:flex-row justify-center m-2 gap-2">
        <Review
          imageSrc={Icons}
          title="Impressive Results from Our Users"
          content="Our engagement doubled within weeks of using this tool!"
        />
        <Review
          imageSrc={ClockIcon}
          title="Unlock Your Content Potential Today!"
          content="This tool has saved us countless hours of content creation."
        />
        <Review
          imageSrc={FeaturesIcon}
          title="Amazing Features"
          content="The features provided by this tool are exceptional and have greatly enhanced our content creation process."
        />
      </div>
      {/* Call-to-Action Section */}
      <div className="text-center mt-16 mb-24">
        <h2 className="text-3xl font-semibold text-white mb-4">
          Ready to revolutionize your content creation?
        </h2>
        <p className="text-lg text-gray-200 mb-6">
          Join thousands of creators already using our platform!
        </p>

        <Link
          to="/sign-up"
          className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out mr-4"
        >
          Sign Up Now
        </Link>

        <Link
          to="/sign-in"
          className="inline-block bg-gray-600 text-white py-3 px-8 rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out"
        >
          Sign In
        </Link>
      </div>

      <LinkedInPage/>






    </div>
  );
};

export default About;
