import React from "react";
import { Link } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";

// Define formatDate function
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const PostItem = ({
  post,
  setSelectedPost,
  dropdownOpen,
  setDropdownOpen,
  toggleVisibility,
  handleDeletePost,
  copyPost,
}) => {
  return (
    <Link to={`/post/${post._id}`}>
      <div className="relative flex flex-col gap-2 m-2 ml-1 p-4 bg-white rounded-lg shadow-lg shadow-cyan-500/50 dark:bg-white dark:text-black-300 hover:bg-opacity-70">
        <div className="row-span-1">
          <h3 className="text-lg m-4 font-semibold">{post.title}</h3>
          <p className="text-sm text-gray-600">{formatDate(post.createdAt)}</p>
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index} className="text-base">
              {paragraph}
            </p>
          ))}
          <p className="text-sm text-gray-600">Likes: {post.likes.length}</p>
        </div>
        <div className="absolute top-0 right-0">
          <button
            type="button"
            className="inline-flex justify-center w-full  px-4 py-2 text-sm font-medium text-gray-700  dark:text-gray-300 "
            onClick={() =>
              setDropdownOpen(post._id === dropdownOpen ? null : post._id)
            }
          >
            <HiDotsVertical />
          </button>
          {dropdownOpen === post._id && (
            <PostDropdown
              post={post}
              toggleVisibility={toggleVisibility}
              handleDeletePost={handleDeletePost}
              copyPost={copyPost}
              setDropdownOpen={setDropdownOpen}
            />
          )}
        </div>
        <div className="row-span-1 flex justify-center items-center">
          <button
            onClick={() => toggleVisibility(post._id, post.isPublic)}
            className={`${
              post.isPublic ? "bg-green-500" : "bg-red-500"
            } hover:bg-opacity-75 text-white font-semibold py-2 px-2 rounded mr-2`}
          >
            {post.isPublic ? "Make Private" : "Make Public"}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default PostItem;
