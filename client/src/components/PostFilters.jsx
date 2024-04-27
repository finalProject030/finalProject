import React from "react";

const PostFilters = ({
  filter,
  setFilter,
  visibilityFilter,
  setVisibilityFilter,
  sortBy,
  setSortBy,
}) => {
  return (
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
  );
};

export default PostFilters;
