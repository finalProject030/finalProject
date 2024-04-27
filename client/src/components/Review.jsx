// Review.js
import InstagramIcon from "../../assets/Instagram.png";
import linkdinIcon from "../../assets/LinkdIn.png";
import FacebookIcon from "../../assets/Facebook.png";
import React from "react";

const Review = ({ imageSrc, title, content }) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch mb-8">
      <a
        href="#"
        className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <img
          className="object-cover w-full md:w-48 h-48 md:h-auto rounded-t-lg md:rounded-none md:rounded-l-lg"
          src={imageSrc}
          alt=""
        />
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
