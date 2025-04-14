"use client";

import React, { useState } from "react";

const SearchBar = () => {
  const [userQuery, setUserQuery] = useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSearch() {
    if (!userQuery) return;
    setIsLoading(true);

    const response = await fetch("/api/openAI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userQuery }), // sends query as a JSON object e.g. { userQuery: "query text here" }
    });

    // maybe add error handling here
    // maybe add alert and/or toast here

    // const data = await response.json();
    // console.log("Response: ", data.output_text);
    setIsLoading(false);
    // send data to result cards
  }

  return (
    <div className="p-4 flex gap-2">
      <input
        type="text"
        className="border p-2 rounded w-full"
        placeholder="Search by title, genre, mood..."
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        onClick={handleSearch}
        disabled={isLoading}
        className="bg-blue-500 text-white p-2 rounded"
      >
        {!isLoading ? <p>Search</p> : <p>Loading...</p>}
      </button>
    </div>
  );
};

export default SearchBar;
