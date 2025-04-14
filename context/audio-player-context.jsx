"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { testTracks } from "../data/test-tracks/testTracks.js";

const AudioPlayerContext = createContext(undefined);

export const AudioPlayerProvider = ({ children }) => {
  const [tracks, setTracks] = useState(testTracks); // my implementation - NOT the tutorial code
  const [trackIndex, setTrackIndex] = useState(0); // my implementation - NOT the tutorial code
  const [currentTrack, setCurrentTrack] = useState(tracks[trackIndex]); // useState(tracks[trackIndex]) - tutorial code
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // my implementation - NOT the tutorial code
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

  // useEffect(() => {
  //   const loadTracks = async () => {
  //     const response = await fetch("/assets/testTracks/testTracks.json"); // .json file is hard coded for now
  //     const data = await response.json();
  //     setTracks(data.tracks);
  //     // setCurrentTrack(data.tracks[0]); // data.tracks[0] is hard coded for now
  //     console.log("tracks[0]: ", data.tracks[0]);
  //     console.log("currentTrack: ", data.tracks[0]);
  //   };
  //   loadTracks();
  // }, []);

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
