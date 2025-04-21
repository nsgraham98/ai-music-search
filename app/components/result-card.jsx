"use client";
import React, { useState } from "react";

const ResultCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold">Result Card</h2>
      <p className="mt-2 text-gray-600">This is a result card component.</p>

      <button
        onClick={toggleExpand}
        className="mb-4 text-blue-500 hover:text-blue-700 focus:outline-none"
      >
        {isExpanded ? "Show Less" : "Show More"}
      </button>

      {isExpanded && (
        <div className="mt-4 text-gray-700">
          <p>This is additional content that is shown when expanded.</p>
          <p>You can add more details or information here.</p>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
