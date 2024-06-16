import React from "react";
import { FaMarker } from "react-icons/fa";
import { PiTargetBold } from "react-icons/pi";
import { BsCheckCircleFill } from "react-icons/bs";

const Toolbar = ({ currentStep }) => {
  const getStepClass = (step) => {
    if (currentStep === step) {
      console.log("1");

      return "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300";
    }
    if (
      step === "posts" ||
      (step === "selectedPosts" &&
        (currentStep === "selectedPosts" || currentStep === "postCreationForm"))
    ) {
      console.log("2");
      return "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300";
    }
    return "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-100";
  };

  const getLineClass = (step) => {
    if (
      (step === "posts" &&
        (currentStep === "selectedPosts" ||
          currentStep === "postCreationForm")) ||
      (step === "selectedPosts" && currentStep === "postCreationForm")
    ) {
      return "bg-blue-100 dark:bg-blue-800";
    }
    return "bg-gray-100 dark:bg-gray-700";
  };

  return (
    <div className="flex justify-center lg:mx-50 mx-4">
      <ol className="flex justify-center w-full">
        {/* Step 1: Posts */}
        <li className="relative flex  items-center">
          <span
            className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${getStepClass(
              "posts"
            )}`}
          >
            <FaMarker className="lg:w-5 lg:h-5" />
          </span>
          <div className={` left-1/2 h-1 w-full `} style={{ zIndex: -1 }} />
        </li>

        {/* Step 2: Selected Posts */}
        <li className="relative flex w-full items-center">
          <div
            className={` left-1/2 h-1 w-full ${getLineClass("selectedPosts")}`}
            style={{ zIndex: -1 }}
          />
          <span
            className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${getStepClass(
              "selectedPosts"
            )}`}
          >
            <PiTargetBold className="lg:w-5 lg:h-5" />
          </span>
          <div
            className={` left-1/2 h-1 w-full ${getLineClass("selectedPosts")}`}
            style={{ zIndex: -1 }}
          />
        </li>

        {/* Step 3: Post Creation Form */}
        <li className="relative flex items-center">
          <span
            className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${getStepClass(
              "postCreationForm"
            )}`}
          >
            <BsCheckCircleFill className="lg:w-5 lg:h-5" />
          </span>
        </li>
      </ol>
    </div>
  );
};

export default Toolbar;
