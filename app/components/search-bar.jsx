"use client";

import React, { useState } from "react";
import { useAudioPlayerContext } from "../../context/audio-player-context"; // import this from the context

const SearchBar = () => {
  const [userQuery, setUserQuery] = useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { setTracks } = useAudioPlayerContext(); // import this from the context

  async function handleSearch() {
    if (!userQuery) return;
    setIsLoading(true);

    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userQuery }), // sends query as a JSON object e.g. { userQuery: "query text here" }
    });

    if (!response.ok) {
      console.error("Error fetching data:", response.statusText);
      setIsLoading(false);
      return;
    }

    const data = await response.json();
    console.log("In search bar "); // Log the response for debugging
    console.log("Data: ", data);

    setTracks(data.jamendoResults); // set the tracks in the context

    setIsLoading(false);
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
        variant="contained"
        sx={{
          bgcolor: "#E03FD8",
          "&:hover": { bgcolor: "#c133b9" }, // slightly darker for hover
          color: "white",
          minWidth: 100,
          px: 3,
          py: 1.5,
        }}
        disabled={isLoading}
        className="bg-blue-500 text-white p-2 rounded"
      >
        {!isLoading ? <p>Search</p> : <p>Loading...</p>}
      </button>
    </div>
  );
};

export default SearchBar;
