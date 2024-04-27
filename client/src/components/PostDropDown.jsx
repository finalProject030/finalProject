import React from "react";

const PostDropdown = ({
  post,
  toggleVisibility,
  handleDeletePost,
  copyPost,
  setDropdownOpen,
}) => {
  return (
    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="py-1" role="none">
        <button
          onClick={() => {
            toggleVisibility(post._id, post.isPublic);
            setDropdownOpen(null);
          }}
          className={`${
            post.isPublic ? "text-red-600" : "text-green-600"
          } block px-4 py-2 text-sm text-left`}
          role="menuitem"
        >
          {post.isPublic ? "Make Private" : "Make Public"}
        </button>
        <button
          onClick={() => {
            handleDeletePost(post._id);
            setDropdownOpen(null);
          }}
          className="block px-4 py-2 text-sm text-left text-red-600"
          role="menuitem"
        >
          Delete
        </button>
        <button
          onClick={() => {
            copyPost(post.title, post.content);
            setDropdownOpen(null);
          }}
          className="block px-4 py-2 text-sm text-left text-blue-600"
          role="menuitem"
        >
          Copy
        </button>
      </div>
    </div>
  );
};

export default PostDropdown;
