import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import LoadingSpinner from "../components/LoadingSpinner";
import PuffLoader from "react-spinners/PuffLoader";
import { format, formatDistanceToNow } from "date-fns";
import { urlServer } from "../variables";
import CommentSection from "../components/CommentSection";

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFileSelected, setImageFileSelected] = useState(false);
  const [previousImage, setPreviousImage] = useState(""); // New state for previous image
  const navigate = useNavigate();

  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const fetchPost = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset error state
    try {
      const response = await fetch(
        `http://localhost:3000/api/post/post/${postId}`,
        {
          method: "GET",
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }
      const postData = await response.json();
      setPost(postData);
      setEditedTitle(postData.post.title);
      setEditedContent(postData.post.content);
      setImagePreview(postData.post.image);
      setImageFile(postData.post.image);
      setPreviousImage(postData.post.image); // Save previous image URL
    } catch (error) {
      console.error("Error fetching post:", error);
      setError(error.message); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const handleUploadImage = () => {
    if (!imageFile) return;

    const storage = getStorage();
    const fileName = new Date().getTime() + "-" + imageFile.name;
    const storageRef = ref(storage, `images/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    setUploadingImage(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading image:", error);
        setImageUploadError(error.message);
        setUploadingImage(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImagePreview(downloadURL);
          setImageFile(downloadURL);
          setUploadingImage(false);
        });
      }
    );
  };

  const handleEditButtonClick = () => {
    setEditing(!editing);
  };

  const handleSaveButtonClick = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to save the changes?"
      );
      if (!confirmed) return;

      if (imageFile && typeof imageFile === "object") {
        await new Promise((resolve) => {
          handleUploadImage();
          const interval = setInterval(() => {
            if (imageUploadProgress === 100) {
              clearInterval(interval);
              resolve();
            }
          }, 1000);
        });
      }

      const response = await fetch(`${urlServer}/api/post/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
          image:
            typeof imageFile === "string" ? imageFile : imageFile?.name || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      setEditing(false);
      const updatedPostResponse = await fetch(
        `${urlServer}/api/post/post/${postId}`,
        {
          method: "GET",
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      const updatedPostData = await updatedPostResponse.json();
      setPost(updatedPostData);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageFileSelected(true);
    }
  };

  const toggleVisibility = async (postId, isPublic) => {
    const confirmationMessage = isPublic
      ? "Are you sure you want to make this post private?"
      : "Are you sure you want to make this post public?";

    if (window.confirm(confirmationMessage)) {
      try {
        const response = await fetch(
          `${urlServer}/api/post/${postId}/visibility`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify({ isPublic: !isPublic }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update post visibility");
        }

        const updatedPostResponse = await fetch(
          `${urlServer}/api/post/post/${postId}`,
          {
            method: "GET",
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        );
        const updatedPostData = await updatedPostResponse.json();
        setPost(updatedPostData);
      } catch (error) {
        console.error("Error updating post visibility:", error);
      }
    }
  };

  const handleDeleteButtonClick = async () => {
    if (window.confirm("Are you sure you want to delete the image?")) {
      setImageFile(previousImage); // Restore previous image
      try {
        const response = await fetch(`${urlServer}/api/post/${postId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            ...post.post,
            image: "", // Clear image URL
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update post");
        }

        const updatedPostResponse = await fetch(
          `${urlServer}/api/post/post/${postId}`,
          {
            method: "GET",
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        );
        const updatedPostData = await updatedPostResponse.json();
        setPost(updatedPostData);
        setPreviousImage(updatedPostData.post.image); // Update previous image URL
        fetchPost();
      } catch (error) {
        console.error("Error updating post:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="col-span-1 md:col-span-4 flex justify-center h-dvh items-center">
        <PuffLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-red-200">
          <h1 className="text-5xl font-bold text-red-600 mb-4">Oops!</h1>
          <p className="text-lg text-red-800 mb-6">Something went wrong:</p>
          <p className="text-md text-red-600 mb-8">{error}</p>
          <a href="/" className="text-blue-500 underline hover:text-blue-700">
            Go back to Home
          </a>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="col-span-1 md:col-span-4 flex justify-center items-center">
        <p>No post found</p>
      </div>
    );
  }

  const hasImage = imagePreview || post.post.image;

  return (
    <div className="container mx-auto my-20 px-4">
      <div className="w-full md:w-3/4 lg:w-1/2 mx-auto">
        <h1 className="text-7xl text-center mb-2 font-bold border-4 border-gray rounded-lg p-4 shadow-lg bg-gradient-to-r from-gray-300 to-white text-black">
          Post Page
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {editing ? (
              <input
                className="block w-full p-2.5 mb-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                value={editedTitle}
                onChange={(e) => {
                  setEditedTitle(e.target.value);
                  setFormData({ ...formData, title: e.target.value });
                }}
              />
            ) : (
              post.post.title
            )}
          </h2>
          {hasImage && (
            <img
              src={imagePreview || post.post.image}
              alt="post cover"
              className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
            />
          )}
          {editing && (
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {imageUploadProgress !== null && (
                <div className="mt-2 text-gray-600 dark:text-gray-400">
                  Upload Progress: {imageUploadProgress}%
                </div>
              )}
              {imageUploadError && (
                <div className="mt-2 text-red-500 dark:text-red-400">
                  Error: {imageUploadError}
                </div>
              )}
              <button
                onClick={handleUploadImage}
                disabled={uploadingImage || !imageFileSelected}
                className={`mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                  uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Upload Image
              </button>
              <button
                onClick={handleDeleteButtonClick}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Image
              </button>
            </div>
          )}
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {format(new Date(post.post.createdAt), "MMMM d, yyyy")} (
            {formatDistanceToNow(new Date(post.post.createdAt))} ago)
          </p>
          {editing ? (
            <textarea
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={editedContent}
              onChange={(e) => {
                setEditedContent(e.target.value);
                setFormData({ ...formData, content: e.target.value });
              }}
            />
          ) : (
            <p className="text-gray-800 dark:text-gray-300">
              {post.post.content}
            </p>
          )}
          <div className="mt-4 flex justify-between">
            {editing ? (
              <button
                onClick={handleSaveButtonClick}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                  uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={uploadingImage}
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleEditButtonClick}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => toggleVisibility(postId, post.post.isPublic)}
              className={`px-4 py-2 ${
                post.post.isPublic ? "bg-red-500" : "bg-blue-500"
              } text-white rounded hover:bg-opacity-80`}
            >
              {post.post.isPublic ? "Make Private" : "Make Public"}
            </button>
          </div>
          <CommentSection postId={post.post._id} />
        </div>
      </div>
    </div>
  );
};

export default PostPage;
