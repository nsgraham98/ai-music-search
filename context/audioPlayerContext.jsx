"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AudioPlayerContext = createContext(undefined);

export const AudioPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null); // Initially null for no track
  const [tracks, setTracks] = useState([]);

  const contextValue = {
    currentTrack,
    setCurrentTrack,
    tracks,
    setTracks,
  };

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const response = await fetch("/assets/testTracks/testTracks.json");
        const data = await response.json();
        console.log("Fetched Data: ", data.tracks); // Log the tracks data for debugging

        if (data.tracks && data.tracks.length > 0) {
          setTracks(data.tracks); // Set the tracks state with the fetched data
          setCurrentTrack(data.tracks[0]); // Set the first track as the current track
          console.log("First Track Set: ", data.tracks[0]); // Confirm the first track data
        } else {
          console.log("No tracks found in data."); // Handle the case where no tracks are found
        }
      } catch (error) {
        console.error("Error fetching tracks: ", error); // Catch and log any errors
      }
    };

    loadTracks();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayerContext = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error(
      "useAudioPlayerContext must be used within an AudioPlayerProvider"
    );
  }
  return context;
};
