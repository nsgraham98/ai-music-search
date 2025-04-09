"use client";
import React, { useState } from "react";
//import { getHaiku } from "../api/openai/generatehaiku";

function App() {
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: `Write a poetic description of "${query}" as a song or artist.`,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const message = data.choices?.[0]?.message?.content;
      setAiResponse(message || "No response from AI.");
    } catch (error) {
      console.error("Fetch error:", error);
      setAiResponse("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-6 py-10">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">🎶 AI Music Search</h1>
        <div className="flex gap-2 items-center justify-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a song or artist..."
            className="w-full md:w-2/3 px-4 py-2 text-white rounded-md focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
          >
            {loading ? "Loading..." : "Ask AI"}
          </button>
        </div>

        {aiResponse && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-md text-left">
            <h2 className="text-xl font-semibold mb-3">🎤 AIs Response:</h2>
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {aiResponse}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
