"use client";
import React, { useState } from "react";

const ResultCard = ({ title, artist, albumImage, audioUrl, description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600">By {artist}</p>

      {albumImage && (
        <img
          src={albumImage}
          alt={`${title} album art`}
          className="my-2 rounded-lg w-32 h-32 object-cover"
        />
      )}

      <audio controls className="w-full my-2">
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <button
        onClick={toggleExpand}
        className="mb-2 text-blue-500 hover:text-blue-700 focus:outline-none"
      >
        {isExpanded ? "Show Less" : "Show More"}
      </button>

      {isExpanded && (
        <div className="mt-2 text-gray-700 text-sm text-center">
          <p>{description}</p>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
