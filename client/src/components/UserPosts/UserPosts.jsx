import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { HiDotsVertical } from "react-icons/hi";
import PostFilters from "../PostFilters";
import PostItem from "../PostItem";

const UserPosts = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [dropdownOpen, setDropdownOpen] = useState(null); // State to manage dropdown visibility
  const dropdownRef = useRef(null); // Define dropdownRef using useRef

  useEffect(() => {
    if (currentUser) {
      fetchUserPosts(currentUser._id);
    }
  }, [currentUser]);

  const fetchUserPosts = async (userId) => {
    try {
      const res = await fetch(`/api/post/${userId}`);
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
      const res = await fetch(`/api/post/${postId}`, {
        method: "DELETE",
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
      const res = await fetch(`/api/post/${postId}/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
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
    // Filter posts based on the filter value and visibility filter
    let filteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(filter.toLowerCase())
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
    <div className="grid grid-cols-6 md:grid-flow-row">
      <div className="col-span-6 md:col-span-6">
        <h1 className="flex justify-center text-5xl">My Posts</h1>
      </div>
      {loading && <p className="col-span-6">Loading...</p>}
      {error && <p className="col-span-6">Error: {error}</p>}
      <PostFilters
        filter={filter}
        setFilter={setFilter}
        visibilityFilter={visibilityFilter}
        setVisibilityFilter={setVisibilityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <div className="col-span-6 md:col-span-5">
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
      </div>
    </div>
  );
};

export default UserPosts;
