import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const UserPosts = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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
    <div className="grid grid-cols-6  md:grid-flow-row ">
      <div className="col-span-6 md:col-span-6">
        <h1 className="flex justify-center text-5xl">My Posts</h1>
      </div>
      {loading && <p className="col-span-6">Loading...</p>}
      {error && <p className="col-span-6">Error: {error}</p>}
      <div className="col-span-6 m-2 mr-1 md:col-span-1 bg-white rounded-lg shadow-lg shadow-cyan-500/50 dark:bg-gray-900 dark:text-gray-300 p-4">
        <h1 className="mb-4 text-lg font-semibold">Filters</h1>
        <input
          type="text"
          placeholder="Filter by title"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-2 focus:outline-none focus:ring focus:border-blue-300"
        />
        <select
          value={visibilityFilter}
          onChange={(e) => setVisibilityFilter(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-2 focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="all">All</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort by:
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-2 focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="newest">Newest</option>
          <option value="older">Older</option>
          <option value="mostLikes">Most Likes</option>
        </select>
      </div>

      <div className="col-span-6 md:col-span-5">
        {applyFilter().map((post) => (
          <div
            key={post._id}
            className="flex flex-col gap-2 m-2 ml-1 p-4 bg-white rounded-lg shadow-lg shadow-cyan-500/50 dark:bg-gray-900 dark:text-gray-300"
          >
            <div className="row-span-1">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-600">
                {formatDate(post.createdAt)}
              </p>
              {/* Splitting content into paragraphs */}
              {post.content.split("\n").map((paragraph, index) => (
                <p key={index} className="text-base">
                  {paragraph}
                </p>
              ))}
              <p className="text-sm text-gray-600">
                Likes: {post.likes.length}
              </p>
            </div>

            <div className="row-span-1 flex justify-center items-center">
              <button
                onClick={() => toggleVisibility(post._id, post.isPublic)}
                className={`${
                  post.isPublic ? "bg-green-500" : "bg-red-500"
                } hover:bg-opacity-75 text-white font-semibold py-2 px-4 rounded mr-2`}
              >
                {post.isPublic ? "Make Private" : "Make Public"}
              </button>
              <button
                onClick={() => handleDeletePost(post._id)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPosts;
