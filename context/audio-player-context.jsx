// AudioPlayerContext to manage global state for the audio player
// tracks array, currentTrack, isPlaying, timeProgress, duration, etc.

"use client";

import { createContext, useContext, useState, useRef } from "react";

const AudioPlayerContext = createContext(undefined);

export const AudioPlayerProvider = ({ children }) => {
  const [tracks, setTracks] = useState([]); // array of track objects (for the playlist)
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  // useRef is used to persist values between renders without causing re-renders
  const audioRef = useRef(null); // create a ref for the <audio> element created in controls.jsx
  const progressBarRef = useRef(null); // ref for the progress bar <input> element in progress-bar.jsx

  // context value to be provided to consuming components
  // functions to update state are also provided
  // so that consuming components can update the state
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
    audioRef, // ref for the <audio> element
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
