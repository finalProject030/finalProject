import React from "react";
import { FaMarker } from "react-icons/fa";
import { PiTargetBold } from "react-icons/pi";
import { BsCheckCircleFill } from "react-icons/bs";
import { FaFileWaveform } from "react-icons/fa6";
import { IoIosInformationCircle } from "react-icons/io";

const Toolbar = ({ currentStep }) => {
  console.log(currentStep);

  return (
    <div className="flex justify-center lg:mx-50 mx-4 ">
      <ol className="flex justify-center w-full">
        <li
          className={`flex w-full items-center ${
            currentStep === "posts"
              ? "content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-blue-800"
              : "after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-blue-800"
          }`}
        >
          <span className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full lg:h-12 lg:w-12 dark:bg-blue-800 shrink-0">
            <FaMarker
              className={`${
                currentStep === "selectedPosts" ||
                currentStep === "postCreationForm"
                  ? "text-blue-600 lg:w-4 lg:h-4 dark:text-blue-300"
                  : "text-gray-500 lg:w-5 lg:h-5 dark:text-gray-100"
              }`}
            />
          </span>
        </li>

        <li
          className={`flex w-full items-center ${
            currentStep === "selectedPosts" ||
            currentStep === "postCreationForm"
              ? "text-blue-600 dark:text-blue-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-blue-800"
              : "after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700"
          }`}
        >
          <span className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full lg:h-12 lg:w-12 dark:bg-blue-800 shrink-0">
            <PiTargetBold
              className={`${
                currentStep === "selectedPosts" ||
                currentStep === "postCreationForm"
                  ? "text-blue-600 lg:w-4 lg:h-4 dark:text-blue-300"
                  : "text-gray-500 lg:w-5 lg:h-5 dark:text-gray-100"
              }`}
            />
          </span>
        </li>
        <li className="flex  items-center">
          <span className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full lg:h-12 lg:w-12 dark:bg-blue-800 shrink-0">
            <BsCheckCircleFill
              className={`${
                currentStep === "selectedPosts" ||
                currentStep === "postCreationForm"
                  ? "text-blue-600 lg:w-4 lg:h-4 dark:text-blue-300"
                  : "text-gray-500 lg:w-5 lg:h-5 dark:text-gray-100"
              }`}
            />
          </span>
        </li>
      </ol>
    </div>
  );
};

export default Toolbar;
