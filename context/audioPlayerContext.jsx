"use client";

import { createContext, useContext, useState } from "react";

const AudioPlayerContext = createContext(undefined);

export const AudioPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(tracks[0]); // tracks[0] could be changed

  const [tracks, setTracks] = useState([]);
  const contextValue = {
    currentTrack,
    setCurrentTrack,
  };

  useEffect(() => {
    // loads ALL the tracks from the JSON file
    const loadTracks = async () => {
      const response = await fetch("/assets/testTracks.json");
      const data = await response.json();
      console.log(data.tracks); // Logs the tracks data
      setTracks(data.tracks); // Set the tracks state with the fetched data
    };

    loadTracks();
  }, []);

  const track = {
    id,
    name,
    artist,
    album,
    path,
    descriptors: [
      {
        description,
        instruments,
        feel,
        genre,
        duration,
        bpm,
      },
    ],
    credits: [
      {
        url,
        license,
        full_credits,
      },
    ],
  };

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
