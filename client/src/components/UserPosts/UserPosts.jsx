import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { HiDotsVertical } from "react-icons/hi";
import PostFilters from "../PostFilters";
import PostItem from "../PostItem";
import { urlServer } from "../../variables";
import PostPage from "../../pages/PostPage";
import LoadingSpinner from "../../components/LoadingSpinner"; // Import the LoadingSpinner component

const UserPosts = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [dropdownOpen, setDropdownOpen] = useState(null); // State to manage dropdown visibility
  const [selectedPost, setSelectedPost] = useState(null);
  const dropdownRef = useRef(null); // Define dropdownRef using useRef

  useEffect(() => {
    if (currentUser) {
      fetchUserPosts(currentUser._id);
    }
  }, [currentUser]);

  const fetchUserPosts = async (userId) => {
    try {
      const res = await fetch(`${urlServer}/api/post/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(`${urlServer}/api/post/${postId}`, {
        method: "DELETE",
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.filter((post) => post._id !== postId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleVisibility = async (postId, isPublic) => {
    try {
      const res = await fetch(`${urlServer}/api/post/${postId}/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ isPublic: !isPublic }), // Toggle visibility
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.map((post) => (post._id === postId ? data.post : post)));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const copyPost = (title, content) => {
    // Combine title and content with a line break
    const textToCopy = `${title}\n${content}`;
    // Copy text to clipboard
    navigator.clipboard.writeText(textToCopy);
  };

  const applyFilter = () => {
    // Filter posts based on the filter value, visibility filter, and content
    let filteredPosts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(filter.toLowerCase()) ||
        post.content.toLowerCase().includes(filter.toLowerCase())
    );

    if (visibilityFilter === "public") {
      filteredPosts = filteredPosts.filter((post) => post.isPublic);
    } else if (visibilityFilter === "private") {
      filteredPosts = filteredPosts.filter((post) => !post.isPublic);
    }

    // Apply sorting based on filter
    switch (sortBy) {
      case "newest":
        filteredPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "older":
        filteredPosts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "mostLikes":
        filteredPosts.sort((a, b) => b.likes.length - a.likes.length);
        break;
      default:
        break;
    }

    return filteredPosts;
  };

  return (
    <>
      {/* Wave shape */}
      <div className="left-0 w-full -mb-1">
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

      <div className="container mx-auto py-8 px-4">
        <h1 className="text-7xl font-bold text-center mb-8">My Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Filter Section */}
          <div className="col-span-1 md:col-span-2">
            <PostFilters
              filter={filter}
              setFilter={setFilter}
              visibilityFilter={visibilityFilter}
              setVisibilityFilter={setVisibilityFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              placeholder="Search by title or content" // Add placeholder prop
            />
          </div>
          {/* Posts Section */}
          <div className="col-span-1 md:col-span-4">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                {error && (
                  <p className="text-center text-red-500">Error: {error}</p>
                )}
                {applyFilter().map((post) => (
                  <PostItem
                    key={post._id}
                    post={post}
                    dropdownOpen={dropdownOpen}
                    setDropdownOpen={setDropdownOpen}
                    toggleVisibility={toggleVisibility}
                    handleDeletePost={handleDeletePost}
                    copyPost={copyPost}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      {/* Render selected post page if a post is selected */}
      {selectedPost && <PostPage post={selectedPost._id} />}
    </>
  );
};

export default UserPosts;
