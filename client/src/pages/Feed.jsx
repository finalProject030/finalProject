import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BiLike, BiDislike } from "react-icons/bi";
import { urlServer } from "../variables";
import { format, formatDistanceToNow } from "date-fns";
import PuffLoader from "react-spinners/PuffLoader";

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
      const response = await fetch(`${urlServer}/api/post/public/postslikes`, {
        method: "GET",
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      console.log(data);

      if (data.success) {
        const currentUserId = currentUser._id;
        const postsWithUserLiked = await Promise.all(
          data.posts.map(async (post) => {
            const userLiked = post.likes.some(
              (like) => like.user === currentUserId
            );
            const userResponse = await fetch(
              `${urlServer}/api/user/${post.author}`,
              // `/api/user/${post.author}`,

              {
                method: "GET",
                headers: {
                  authorization: localStorage.getItem("token"),
                },
              }
            );
            const userData = await userResponse.json();
            const profilePictureURL = userData.avatar; // The avatar URL is stored in the `avatar` field of user data
            const userName = userData.username;
            return {
              ...post,
              userLiked,
              profilePictureURL,
              userName,
              loading: false, // Add loading state for each post
            };
          })
        );

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
      // Find the index of the post being liked
      const postIndex = publicPosts.findIndex((post) => post._id === postId);

      // Set loading state to true for the liked post
      setPublicPosts((prevPosts) => [
        ...prevPosts.slice(0, postIndex),
        { ...prevPosts[postIndex], loading: true },
        ...prevPosts.slice(postIndex + 1),
      ]);

      const response = await fetch(`${urlServer}/api/post/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });

      const data = await response.json();

      if (data.success) {
        setPublicPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: data.post.likes,
                  userLiked: true,
                  loading: false,
                }
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
      // Find the index of the post being disliked
      const postIndex = publicPosts.findIndex((post) => post._id === postId);

      // Set loading state to true for the disliked post
      setPublicPosts((prevPosts) => [
        ...prevPosts.slice(0, postIndex),
        { ...prevPosts[postIndex], loading: true },
        ...prevPosts.slice(postIndex + 1),
      ]);

      const response = await fetch(`${urlServer}/api/post/${postId}/dislike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });

      const data = await response.json();

      if (data.success) {
        setPublicPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: data.post.likes,
                  userLiked: false,
                  loading: false,
                }
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
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <h2 className="text-4xl md:text-7xl font-bold mb-4 flex justify-center items-center">
          Public Posts
        </h2>
        {loading && <PuffLoader />}
        {error && <p className="text-red-500">Error: {error}</p>}

        <div className="mt-8 grid gap-8">
          {publicPosts.map((post) => (
            <div
              key={post._id}
              className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-5 text-gray-500">
                <span className="text-sm">
                  {format(new Date(post.createdAt), "MMMM d, yyyy")} (
                  {formatDistanceToNow(new Date(post.createdAt))} ago)
                </span>
              </div>
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <a>{post.title}</a>
              </h2>
              <div className="mb-5 font-light text-gray-500 dark:text-gray-400">
                {post.content.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <div className="flex flex-col lg:flex-row items-center lg:justify-between mb-3">
                <div className="flex items-center mb-2 lg:mb-0">
                  <img
                    className="w-7 h-7 rounded-full mr-2"
                    src={post.profilePictureURL}
                    alt="Profile"
                  />
                  <span className="font-medium dark:text-white">
                    {post.userName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-gray-400 mr-4 lg:mb-0 lg:mr-0">
                    {post.likes.length} Likes
                  </p>
                  {post.loading ? (
                    <button
                      className="flex ml-3 items-center bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded transition duration-300 transform hover:scale-105 mb-2 lg:mb-0"
                      disabled
                    >
                      Loading...
                    </button>
                  ) : post.userLiked ? (
                    <button
                      onClick={() => handleDislikePost(post._id)}
                      className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                      <BiDislike className="" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleLikePost(post._id)}
                      className="text-white bg-gradient-to-r mt-4 from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                      <BiLike className="" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Feed;
