import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const UserPosts = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);

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
        // Update the posts list to reflect the change
        setPosts(posts.map((post) => (post._id === postId ? data.post : post)));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Your Posts</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="mt-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-lg p-6 mb-4 flex"
          >
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-700">{post.content}</p>
            </div>
            <div>
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
