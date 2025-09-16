"use client";

import { createContext, useContext, useState, useRef } from "react";

const AudioPlayerContext = createContext(undefined);

export const AudioPlayerProvider = ({ children }) => {
  const [tracks, setTracks] = useState([]); // my implementation - NOT the tutorial code
  const [trackIndex, setTrackIndex] = useState(0); // my implementation - NOT the tutorial code
  const [currentTrack, setCurrentTrack] = useState(null); // useState(tracks[trackIndex]) - tutorial code
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // my implementation - NOT the tutorial code
  // useRef is used to persist values between renders without causing re-renders
  const audioRef = useRef(null); // create a ref for the <audio> element created in controls.jsx
  const progressBarRef = useRef(null);

  const contextValue = {
    currentTrack,
    setCurrentTrack,
    tracks,
    setTracks,
    timeProgress,
    setTimeProgress,
    isPlaying,
    setIsPlaying,
    duration,
    setDuration,
    setTrackIndex,
    audioRef,
    progressBarRef,
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
