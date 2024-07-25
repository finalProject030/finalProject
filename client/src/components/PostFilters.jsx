import React, { useState } from "react";

const PostFilters = ({
  filter,
  setFilter,
  visibilityFilter,
  setVisibilityFilter,
  sortBy,
  setSortBy,
  placeholder,
  isSticky,
  handleToggleSticky,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="">
      {/* Large screens */}
      <div className="hidden md:block h-dvh p-4 bg-white rounded-lg shadow-lg">
        <h2 className=" mb-4 text-4xl font-bold ">Filters</h2>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={placeholder}
          className="w-full p-2 mb-4 border rounded-lg "
        />
        <div className="mb-4">
          <label className="block mb-2 font-bold">Visibility</label>
          <div className="flex flex-col ">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={visibilityFilter === "all"}
                onChange={() => setVisibilityFilter("all")}
                className="mr-2"
              />
              All
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={visibilityFilter === "public"}
                onChange={() => setVisibilityFilter("public")}
                className="mr-2"
              />
              Public
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={visibilityFilter === "private"}
                onChange={() => setVisibilityFilter("private")}
                className="mr-2"
              />
              Private
            </label>
          </div>
        </div>
        <div>
          <label className="block mb-2  text-2xl font-bold">Sort By</label>
          <div className="flex flex-col ">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sortBy === "newest"}
                onChange={() => setSortBy("newest")}
                className="mr-2"
              />
              Newest
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sortBy === "older"}
                onChange={() => setSortBy("older")}
                className="mr-2"
              />
              Oldest
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sortBy === "mostLikes"}
                onChange={() => setSortBy("mostLikes")}
                className="mr-2"
              />
              Most Likes
            </label>
          </div>
        </div>
      </div>

      {/* Small screens */}
      <div className="block md:hidden w-full">
        <button
          onClick={() => setFilterOpen((prev) => !prev)}
          className="bg-gradient-to-r from-gray-300 to-white container     text-black font-bold border-4 border-gray p-3 rounded-lg mb-4 shadow-lg hover:bg-gradient-to-l hover:from-gray-100 hover:to-gray-400 transition duration-300 ease-in-out transform hover:scale-10"
        >
          Filters
        </button>

        {filterOpen && (
          <div className="p-4 bg-white rounded-lg shadow-lg mb-4">
            <h2 className="text-2xl font-bold mb-4">Filters</h2>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={placeholder}
              className="w-full p-2 mb-4 border rounded-lg"
            />
            <div className="mb-4">
              <label className="block mb-2 text-xl font-bold">Visibility</label>
              <select
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">All</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-xl font-bold">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="newest">Newest</option>
                <option value="older">Oldest</option>
                <option value="mostLikes">Most Likes</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostFilters;
