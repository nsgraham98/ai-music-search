// AudioPlayerContext to manage global state for the audio player
// tracks array, currentTrack, isPlaying, timeProgress, duration, etc.

"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SearchContext = createContext(undefined);

export const SearchContextProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      setSearchResults([]);
    };
  }, []);

  const contextValue = {
    searchResults,
    setSearchResults,
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
