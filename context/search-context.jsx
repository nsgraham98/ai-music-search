// AudioPlayerContext to manage global state for the audio player
// tracks array, currentTrack, isPlaying, timeProgress, duration, etc.

"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SearchContext = createContext(undefined);

export const SearchContextProvider = ({ children }) => {
  const [userQuery, setUserQuery] = useState(""); // latest user search input
  const [searchResults, setSearchResults] = useState([]); // latest search results
  const [conversationHistory, setConversationHistory] = useState([
    // { id: "someID", role: "user", content: "example", tracks: [] },
    // { id: "someID", role: "assistant", content: "response", tracks: [searchResults] }, etc.
    // maintains context for multi-turn conversations with AI
  ]);
  const [isReplying, setIsReplying] = useState(false);
  // cleanup on unmount
  useEffect(() => {
    return () => {
      setSearchResults([]);
      setUserQuery("");
      setConversationHistory([]);
    };
  }, []);

  const contextValue = {
    userQuery,
    setUserQuery,
    conversationHistory,
    setConversationHistory,
    searchResults,
    setSearchResults,
    isReplying,
    setIsReplying,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error(
      "useSearchContext must be used within a SearchContextProvider"
    );
  }
  return context;
};
