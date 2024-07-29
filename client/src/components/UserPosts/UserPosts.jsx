import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiDotsVertical } from "react-icons/hi";
import PostFilters from "../PostFilters";
import PostItem from "../PostItem";
import { urlServer } from "../../variables";
import PostPage from "../../pages/PostPage";
import PuffLoader from "react-spinners/PuffLoader";
import SocialMediaShare from "../SocialMediaShare";

const UserPosts = () => {
  const { currentUser, error } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const [isSticky, setIsSticky] = useState(true); // State to manage stickiness

  // Toggle function
  const handleToggleSticky = () => {
    setIsSticky((prevIsSticky) => !prevIsSticky);
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserPosts(currentUser._id);
    }
  }, [currentUser]);

  const fetchUserPosts = async (userId) => {
    try {
      setLoading(true);
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
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
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
    }
  };

  const toggleVisibility = async (postId, isPublic) => {
    const message = isPublic
      ? "Are you sure you want to make it private?"
      : "Are you sure you want to make it public?";

    if (window.confirm(message)) {
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
          setPosts(
            posts.map((post) => (post._id === postId ? data.post : post))
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const copyPost = (title, content) => {
    const textToCopy = `${title}\n${content}`;
    navigator.clipboard.writeText(textToCopy);
  };

  const applyFilter = () => {
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
      <div className="container mx-auto py-8 px-4 max-w-screen-lg">
        <h1 className="text-7xl text-center mb-2  font-bold border-4 border-gray rounded-lg p-4 shadow-lg bg-gradient-to-r from-gray-300 to-white text-black">
          My Posts
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-6 ">
          {/* Filter Section */}
          <div className="col-span-1 md:col-span-2 ">
            <PostFilters
              filter={filter}
              setFilter={setFilter}
              visibilityFilter={visibilityFilter}
              setVisibilityFilter={setVisibilityFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              placeholder="Search by title or content"
            />
          </div>
          {/* Posts Section */}
          <div className="col-span-1 md:col-span-4 flex justify-center	items-center	">
            {loading ? (
              <PuffLoader />
            ) : (
              <div className="bg-gray-300 p-3 mx-1 rounded-lg">
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
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedPost && <PostPage post={selectedPost._id} />}
    </>
  );
};

export default UserPosts;
