// AudioPlayerContext to manage global state for the audio player
// tracks array, currentTrack, isPlaying, timeProgress, duration, etc.

"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react";

const AudioPlayerContext = createContext(undefined);

export const AudioPlayerProvider = ({ children }) => {
  // Initialize isMinimized - always start false to match server render
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // After hydration, load from localStorage
  useEffect(() => {
    setIsHydrated(true);
    const saved = localStorage.getItem("audioPlayerMinimized");
    if (saved === "true") {
      setIsMinimized(true);
    }
  }, []);

  const [currentPlaylist, setCurrentPlaylist] = useState({
    id: null,
    userID: null,
    name: null,
    public: null,
    description: null,
    timeCreated: null,
    timeUpdated: null,
    tracks: [],
  });
  const [playlists, setPlaylists] = useState([]); // array of playlist objects
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  // useRef is used to persist values between renders without causing re-renders
  const audioRef = useRef(null); // create a ref for the <audio> element created in controls.jsx
  const progressBarRef = useRef(null); // ref for the progress bar <input> element in progress-bar.jsx

  // Save isMinimized to localStorage whenever it changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("audioPlayerMinimized", isMinimized.toString());
    }
  }, [isMinimized, isHydrated]);

  const testTrack = {
    id: "2218470",
    name: "Christmas Miracles (Instrumental)",
    duration: 210,
    artist_id: "486606",
    artist_name: "Phillip Traum and the Moral Sense",
    artist_idstr: "Phillip_Traum_and_the_Moral_Sense",
    album_name: "Welcome Christmas",
    album_id: "587468",
    license_ccurl: "http://creativecommons.org/licenses/by-nc-nd/3.0/",
    position: 2,
    releasedate: "2024-11-20",
    album_image:
      "https://usercontent.jamendo.com?type=album&id=587468&width=300&trackid=2218470",
    audio:
      "https://prod-1.storage.jamendo.com/?trackid=2218470&format=mp32&from=mzI1ZkxPldb9T37dbx857w%3D%3D%7CyHjwuF6Jf97mY3Z6QUH%2BjA%3D%3D",
    audiodownload:
      "https://prod-1.storage.jamendo.com/download/track/2218470/mp32/",
    prourl: "",
    shorturl: "https://jamen.do/t/2218470",
    shareurl: "https://www.jamendo.com/track/2218470",
    // waveform: {"peaks": [ ... ]},
    image:
      "https://usercontent.jamendo.com?type=album&id=587468&width=300&trackid=2218470",
    audiodownload_allowed: true,
    content_id_free: false,
  };
  const testPlaylist = {
    id: "testPlaylist",
    tracks: [testTrack, testTrack, testTrack],
  };

  // context value to be provided to consuming components
  // functions to update state are also provided
  // so that consuming components can update the state
  const contextValue = {
    currentTrack,
    setCurrentTrack,
    currentPlaylist,
    setCurrentPlaylist,
    timeProgress,
    setTimeProgress,
    isPlaying,
    setIsPlaying,
    duration,
    setDuration,
    setTrackIndex,
    audioRef, // ref for the <audio> element
    progressBarRef,
    testTrack,
    testPlaylist,
    isMinimized,
    setIsMinimized,
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
