import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BiLike, BiDislike } from "react-icons/bi";

const Feed = () => {
  const [publicPosts, setPublicPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      fetchPublicPosts();
    }
  }, [currentUser]);

  const fetchPublicPosts = async () => {
    try {
      const response = await fetch("/api/post/public/postslikes");
      const data = await response.json();

      if (data.success) {
        const currentUserId = currentUser._id;
        const postsWithUserLiked = data.posts.map((post) => {
          const userLiked = post.likes.some(
            (like) => like.user === currentUserId
          );
          return {
            ...post,
            userLiked,
          };
        });

        setPublicPosts(postsWithUserLiked);
        setLoading(false);
      } else {
        setError(data.message);
        setLoading(false);
      }
    } catch (error) {
      setError("Error fetching public posts.");
      setLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await fetch(`/api/post/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setPublicPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, likes: data.post.likes, userLiked: true }
              : post
          )
        );
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error liking/disliking the post.");
    }
  };

  const handleDislikePost = async (postId) => {
    try {
      const response = await fetch(`/api/post/${postId}/dislike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setPublicPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, likes: data.post.likes, userLiked: false }
              : post
          )
        );
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error disliking the post.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Public Posts</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="mt-8 flex flex-wrap ">
        {publicPosts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-lg p-6 mb-4 flex flex-col justify-between items-start md:items-center transition duration-300 hover:shadow-xl"
          >
            <div className="mb-4 md:mb-0 md:pr-8 flex-grow">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-700 break-words">{post.content}</p>{" "}
              {/* Apply word-wrap to content */}
            </div>
            <div className="flex items-center">
              <p className="text-gray-700 mr-4">{post.likes.length} Likes</p>
              {post.userLiked ? (
                <button
                  onClick={() => handleDislikePost(post._id)}
                  className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300 transform hover:scale-105"
                >
                  <BiDislike className="mr-2" />
                  Dislike
                </button>
              ) : (
                <button
                  onClick={() => handleLikePost(post._id)}
                  className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 transform hover:scale-105"
                >
                  <BiLike className="mr-2" />
                  Like
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
