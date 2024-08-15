import React, { useState, useEffect, useRef } from "react";
import backgroundVideo from "../../backgroundVideo1.mp4";
import { Link } from "react-router-dom";
import { scrollToTop } from "../variables";
import ContactForm from "../components/ContactForm";
import logo3 from "../../assets/logo3.png";
import video1 from "../../assets/Dashboard.png";
import MybMA from "../../assets/MybMA.png";
import gemini from "../../assets/gemini.webp";
import ScrollToTop from "../components/ScrollToTop";
import ModalVideo from "react-modal-video";
import "react-modal-video/css/modal-video.min.css";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleScroll = () => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        setIsVisible(true);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check visibility on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Main Content */}
      <div className="relative bg-gradient-to-b from-gray-600 to-blue-300 flex flex-col justify-center items-center text-white">
        {/* Overlay */}
        <div className="absolute w-full h-full skew-y-12 origin-right z-10 bg-white dark:bg-gray-900 inset-0">
          {/* First Span */}
          <span className="w-1/3 h-1/3 bg-gray-100 dark:bg-[#261818] absolute right-0 bottom-0"></span>

          {/* Second Span */}
          <span className="w-1/3 h-1/3 bg-gray-200 dark:bg-[#261818] absolute top-[200px] -left-1/6"></span>

          {/* Placeholder Spans */}
          <span className="absolute w-1/3 h-1/3 bg-gray-50 dark:bg-[#261818]"></span>
        </div>

        {/* Content */}
        <div className="flex flex-col-reverse md:flex-row gap-4 p-4">
          {/* Part 1 */}
          <div className="relative z-20 flex flex-1 justify-center items-center p-4">
            <img
              src={logo3}
              alt="STACK TEXTPRO"
              className="w-48 h-auto rounded-lg shadow-lg md:block hidden always-hover"
            />
          </div>

          {/* Part 2 */}
          <div className="flex-1 p-4 flex justify-center items-center">
            <div className="relative z-20 text-center flex flex-col justify-center items-center mt-9">
              <h1 className="text-4xl text-black font-extrabold mb-6 mt-6 dark:text-white">
                Welcome!
              </h1>
              <p className="text-lg text-black text-center mb-8 mx-4 dark:text-white">
                Discover amazing content, connect with our community, and stay
                up to date with the latest trends.
              </p>
              <Link to="/about" onClick={scrollToTop}>
                <button className="bg-white mb-20 border border-indigo-600 text-blue-600 hover:bg-blue-100 hover:text-blue-600 font-semibold py-3 px-8 rounded-full transition duration-300">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Clickable Image with Modal Video */}
      <div className="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="relative cursor-pointer" onClick={() => setOpen(true)}>
          <img
            ref={imgRef}
            src={video1}
            alt="Video Thumbnail"
            className={`w-54 h-auto transition-opacity duration-1000 ${
              isVisible ? "opacity-100 animate-fadeIn" : "opacity-0"
            }`}
          />
          <h2 className="absolute inset-0 text-black flex items-center justify-center text-4xl font-extrabold opacity-90">
            <svg
              viewBox="10 146.5 980.1 707"
              xmlns="http://www.w3.org/2000/svg"
              className="w-40 h-40 transform transition-transform duration-300 hover:scale-110 hover:text-red-500" // Added hover effect
              fill="currentColor"
            >
              <path d="m818.9 146.5h-637.8c-94.4 0-171.1 76.8-171.1 171.1v364.8c0 94.3 76.7 171.1 171.1 171.1h637.9c94.3 0 171.1-76.8 171.1-171.1v-364.8c-.1-94.3-76.8-171.1-171.2-171.1zm101 535.9c0 55.7-45.3 101-100.9 101h-637.9c-55.7 0-101-45.3-101-101v-364.8c0-55.7 45.3-101 101-101h637.9c55.7 0 100.9 45.3 100.9 101z" />
              <path d="m688.2 470.7-259.9-171.3c-10.8-7.1-24.6-7.7-35.9-1.6-11.4 6.1-18.4 18-18.4 30.9v342.6c0 12.9 7.1 24.7 18.4 30.9 5.2 2.8 10.9 4.2 16.6 4.2 6.7 0 13.5-1.9 19.3-5.8l259.9-171.3c9.8-6.5 15.8-17.5 15.8-29.3-.1-11.8-6-22.8-15.8-29.3zm-244.1 135.5v-212.4l161.1 106.2z" />
            </svg>
          </h2>
        </div>

        {/* Modal Video */}
        <ModalVideo
          channel="youtube"
          youtube={{ mute: 0, autoplay: 0 }}
          isOpen={isOpen}
          videoId="RVVnzM53_CA"
          onClose={() => setOpen(false)}
        />
      </div>

      {/* Diagonal Background */}
      <div className="relative h-96">
        <div
          className={`flex flex-col h-full items-center justify-center  cursor-pointer transition-opacity duration-1000 ${
            isVisible ? "opacity-100 animate-fadeIn" : "opacity-0"
          }`}
        >
          <img
            src={MybMA}
            alt="MybMA"
            className=" h-1/4 object-cover z-10 m-2"
          />
          <img
            src={gemini}
            alt="Gemini"
            className=" h-1/4 object-cover z-10 m-2"
          />
        </div>

        <div className="absolute top-0 right-0 w-full h-full bg-gray-50 dark:bg-gray-900 transform -skew-y-12 z-0"></div>
      </div>

      {/* Additional Content */}
      <div className="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-4">
        <p></p>
      </div>

      {/* Contact Form */}
      <ContactForm />
      <ScrollToTop />
    </div>
  );
};

export default Home;
