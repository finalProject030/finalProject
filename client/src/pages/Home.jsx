import React, { useState, useEffect, useRef } from "react";
import backgroundVideo from "../../backgroundVideo1.mp4";
import { Link } from "react-router-dom";
import { scrollToTop } from "../variables";
import ContactForm from "../components/ContactForm";
import logo3 from "../../assets/logo3.png";
import video1 from "../../assets/Dashboard.png";
import MybMA from "../../assets/MybMA.png";
import gemini from "../../assets/gemini.webp";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

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
        {/* Video Background */}

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

      {/* Clickable Image with Animation */}
      <div className="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-4">
        <h2 className="text-4xl text-black font-extrabold mb-6 mt-6 dark:text-white">
          Click On Me!
        </h2>
        <a
          href="https://drive.google.com/file/d/1-rInqCt2Rh2RvF9SPOpgnRmBFhUUTdpB/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            ref={imgRef}
            src={video1}
            alt="Video Thumbnail"
            className={`w-54 h-auto cursor-pointer transition-opacity duration-1000 ${
              isVisible ? "opacity-100 animate-fadeIn" : "opacity-0"
            }`}
          />
        </a>
      </div>

      {/* Diagonal Background */}
      <div className="relative h-96">
        <div
          className={`flex flex-col h-full items-center justify-center  cursor-pointer transition-opacity duration-1000 ${
            isVisible ? "opacity-100 animate-fadeIn" : "opacity-0"
          }`}
        >
          <img src={MybMA} alt="?" className=" h-1/4 object-cover z-10 m-2" />
          <img src={gemini} alt="?" className=" h-1/4 object-cover z-10 m-2" />
        </div>

        <div className="absolute top-0 right-0 w-full h-full bg-gray-50 dark:bg-gray-900 transform -skew-y-12 z-0"></div>
      </div>

      {/* Additional Content */}
      <div className="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-4">
        <p></p>
      </div>

      {/* Contact Form (if needed) */}
      <ContactForm />
    </div>
  );
};

export default Home;
