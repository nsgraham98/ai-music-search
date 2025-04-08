"use client";

import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query.toLowerCase());
  };

  return (
    <div className="p-4 flex gap-2">
      <input
        type="text"
        className="border p-2 rounded w-full"
        placeholder="Search by title, genre, mood..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
