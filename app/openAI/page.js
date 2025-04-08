"use client";
import React, { useState } from "react";
import Results from "./components/Results"; // Adjust path as needed
import trackData from "./assets/TestTracks.json"; // Adjust path to your JSON file

function App() {
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [matchedTracks, setMatchedTracks] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    // Filter local JSON data
    const lowerQuery = query.toLowerCase();
    const filtered = trackData.filter(
      (track) =>
        track.title.toLowerCase().includes(lowerQuery) ||
        track.genre.toLowerCase().includes(lowerQuery) ||
        track.description.toLowerCase().includes(lowerQuery)
    );
    setMatchedTracks(filtered);

    // Fetch from OpenAI
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: `You are a music assistant helping users search for royalty-free tracks. Here is the track list: ${JSON.stringify(
                  tracks
                )}.\n\nUser query: "${query}".\n\nPlease provide a summary of the best matching tracks.`,
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
            className="w-full md:w-2/3 px-4 py-2 text-white rounded-md bg-gray-700 focus:outline-none"
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
            <h2 className="text-xl font-semibold mb-3">🎤 AI Response:</h2>
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {aiResponse}
            </pre>
          </div>
        )}

        {/* Matching Tracks Display */}
        <Results tracks={matchedTracks} />
      </div>
    </div>
  );
}

export default App;
