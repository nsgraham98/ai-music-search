"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";

const AudioPlayerContext = createContext(undefined);

export const AudioPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null); // my implementation - NOT the tutorial code
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const [tracks, setTracks] = useState([]); // my implementation - NOT the tutorial code
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const contextValue = {
    currentTrack,
    setCurrentTrack,
    tracks,
    setTracks,
    audioRef,
    progressBarRef,
    timeProgress,
    setTimeProgress,
    duration,
    setDuration,
  };

  // Tutorial code: added logic for switching tracks... not sure if this implementation
  // is correct for us so leaving it commented out for now (would replace the above code)
  // https://blog.logrocket.com/building-audio-player-react/
  // in the "Handling the next track" section
  // const contextValue = {
  //   currentTrack,
  //   setCurrentTrack,
  //   tracks,
  //   setTracks,
  //   audioRef,
  //   progressBarRef,
  //   timeProgress,
  //   setTimeProgress,
  //   duration,
  //   setDuration,
  //   setTrackIndex,
  // };
  // const [currentTrack, setCurrentTrack] = useState(null);
  // const audioRef = useRef < HTMLAudioElement > null; // create a ref for the audio element
  // const progressBarRef = useRef < HTMLInputElement > null; // create a ref for the progress bar
  // const [tracks, setTracks] = useState([]);
  // const [timeProgress, setTimeProgress] = useState < number > 0;
  // const [duration, setDuration] = useState < number > 0;
  // const [trackIndex,setTrackIndex] = useState(0);
  // const [currentTrack,setCurrentTrack] = useState(tracks[trackIndex]);

  useEffect(() => {
    const loadTracks = async () => {
      const response = await fetch("/assets/testTracks/testTracks.json");
      const data = await response.json();
      setTracks(data.tracks); // 1. set tracks
      setCurrentTrack(data.tracks[1]); // 2. then set the first track
      console.log("tracks[0]: ", data.tracks[1]);
      console.log("currentTrack: ", data.tracks[1]);
    };

    loadTracks();
  }, []);

  // const track = {
  //   id,
  //   name,
  //   artist,
  //   album,
  //   path,
  //   descriptors: [
  //     {
  //       description,
  //       instruments,
  //       feel,
  //       genre,
  //       duration,
  //       bpm,
  //     },
  //   ],
  //   credits: [
  //     {
  //       url,
  //       license,
  //       full_credits,
  //     },
  //   ],
  // };

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
