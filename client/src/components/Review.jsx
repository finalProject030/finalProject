import React from "react";

const Review = ({ imageSrc, title, content }) => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch mb-8 md:flex-1">
      <a
        href="#"
        className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-full hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <div className="w-48 md:w-72">
          {/* Set fixed width and maximum height for the image container */}
          <img
            className="object-cover w-full h-48 md:h-72 max-h-72 rounded-t-lg md:rounded-none md:rounded-l-lg"
            src={imageSrc}
            alt=""
          />
        </div>
        <div className="flex flex-col justify-between p-4 leading-normal flex-grow">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {content}
          </p>
        </div>
      </a>
    </div>
  );
};

export default Review;
