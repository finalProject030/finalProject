import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const PostPage = () => {
  const { postId } = useParams(); // Get postId from URL params
  const [post, setPost] = useState(null);
  const [editing, setEditing] = useState(false); // State to track editing mode
  const [editedContent, setEditedContent] = useState(""); // State to store edited content
  const [editedTitle, setEditedTitle] = useState(""); // State to store edited title

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/post/post/${postId}`, {
          method: "GET",
          headers: {
            authorization: localStorage.getItem("token"),
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const postData = await response.json();
        setPost(postData);
        // Initialize edited title with the original post title
        setEditedTitle(postData.post.title);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleEditButtonClick = () => {
    // Toggle editing mode
    setEditing(!editing);
    // Initialize edited content with the original post content
    setEditedContent(post.post.content);
  };

  const handleSaveButtonClick = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to save the changes?"
      );
      if (!confirmed) return; // If the user cancels, do nothing

      // Update both title and content
      const response = await fetch(`/api/post/${postId}`, {
        method: "PUT", // Change method to PATCH
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }
      // Disable editing mode after saving
      setEditing(false);
      // Fetch updated post data
      const updatedPostResponse = await fetch(`/api/post/post/${postId}`, {
        method: "GET",
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      const updatedPostData = await updatedPostResponse.json();
      setPost(updatedPostData);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const toggleVisibility = async (postId, isPublic) => {
    const confirmationMessage = isPublic
      ? "Are you sure you want to make this post private?"
      : "Are you sure you want to make this post public?";

    if (window.confirm(confirmationMessage)) {
      try {
        // Update post visibility
        const response = await fetch(`/api/post/${postId}/visibility`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ isPublic: !isPublic }),
        });

        if (!response.ok) {
          throw new Error("Failed to update post visibility");
        }

        // Fetch updated post data
        const updatedPostResponse = await fetch(`/api/post/post/${postId}`, {
          method: "GET",
          headers: {
            authorization: localStorage.getItem("token"),
          },
        });
        const updatedPostData = await updatedPostResponse.json();
        setPost(updatedPostData);
      } catch (error) {
        console.error("Error updating post visibility:", error);
      }
    }
  };

  const handleDeleteButtonClick = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        // Delete post
        const response = await fetch(`/api/post/${postId}`, {
          method: "DELETE",
          headers: {
            authorization: localStorage.getItem("token"),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete post");
        }

        // Redirect to the home page after deletion
        history.push("/");
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  if (!post) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto my-20 ">
      <h1 className="text-4xl font-bold mb-4 text-center">Post Page</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          {editing ? (
            <input
              className="block w-full p-2.5 mb-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          ) : (
            post.post.title
          )}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Date: {post.post.createdAt}
        </p>

        {editing ? (
          <textarea
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none overflow-auto"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={20} // Adjust this value as needed
            placeholder="Enter your content here..."
          />
        ) : (
          post.post.content.split("\n").map((paragraph, index) => (
            <p key={index} className="text-gray-800 dark:text-white mb-2">
              {paragraph}
            </p>
          ))
        )}
        <div className="flex items-center justify-between mt-4">
          <div>
            <button
              onClick={() =>
                toggleVisibility(post.post._id, post.post.isPublic)
              }
              className={`${
                post.post.isPublic ? "bg-green-500" : "bg-red-500"
              } hover:bg-opacity-75 text-white font-semibold py-2 px-2 rounded mr-2`}
            >
              {post.post.isPublic ? "Make Private" : "Make Public"}
            </button>

            <button
              onClick={handleDeleteButtonClick}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
          <div className="flex items-center">
            <p className="text-gray-600 dark:text-gray-400 mr-2">
              Likes: {post.post.likes.length}
            </p>
            {editing ? (
              <button
                onClick={handleSaveButtonClick}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleEditButtonClick}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
