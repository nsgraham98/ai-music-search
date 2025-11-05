// AudioPlayerContext to manage global state for the audio player
// tracks array, currentTrack, isPlaying, timeProgress, duration, etc.

"use client";

import { createContext, useContext, useState, useRef } from "react";

const TestingContext = createContext(undefined);

export const TestingContextProvider = ({ children }) => {
  const testTrack = {
    id: "2218470",
    // name: "Christmas Miracles (Instrumental)",
    // duration: 210,
    // artist_id: "486606",
    // artist_name: "Phillip Traum and the Moral Sense",
    // artist_idstr: "Phillip_Traum_and_the_Moral_Sense",
    // album_name: "Welcome Christmas",
    // album_id: "587468",
    // license_ccurl: "http://creativecommons.org/licenses/by-nc-nd/3.0/",
    // position: 2,
    // releasedate: "2024-11-20",
    // album_image:
    //   "https://usercontent.jamendo.com?type=album&id=587468&width=300&trackid=2218470",
    // audio:
    //   "https://prod-1.storage.jamendo.com/?trackid=2218470&format=mp32&from=mzI1ZkxPldb9T37dbx857w%3D%3D%7CyHjwuF6Jf97mY3Z6QUH%2BjA%3D%3D",
    // audiodownload:
    //   "https://prod-1.storage.jamendo.com/download/track/2218470/mp32/",
    // prourl: "",
    // shorturl: "https://jamen.do/t/2218470",
    // shareurl: "https://www.jamendo.com/track/2218470",
    // // waveform: {"peaks": [ ... ]},
    // image:
    //   "https://usercontent.jamendo.com?type=album&id=587468&width=300&trackid=2218470",
    // audiodownload_allowed: true,
    // content_id_free: false,
  };

  const testTrack2 = {
    id: "1534420",
    // name: "EasyCombo - Everythings alright",
    // duration: 169,
    // artist_id: "371193",
    // artist_name: "EASYCOMBO",
    // artist_idstr: "EASYCOMBO",
    // album_name: "Easy Steady Go",
    // album_id: "175724",
    // license_ccurl: "http://creativecommons.org/licenses/by-nd/3.0/",
    // position: 10,
    // releasedate: "2018-04-29",
    // album_image:
    //   "https://usercontent.jamendo.com?type=album&id=175724&width=300&trackid=1534420",
    // audio:
    //   "https://prod-1.storage.jamendo.com/?trackid=1534420&format=mp32&from=IzojeBEyapcWkX0jL2pY8Q%3D%3D%7C0cE5ro9902Q7%2Fs7xsy98kw%3D%3D",
    // audiodownload:
    //   "https://prod-1.storage.jamendo.com/download/track/1534420/mp32/",
    // prourl: "",
    // shorturl: "https://jamen.do/t/1534420",
    // shareurl: "https://www.jamendo.com/track/1534420",
    // // waveform: {"peaks": [ ... ]},
    // image:
    //   "https://usercontent.jamendo.com?type=album&id=175724&width=300&trackid=1534420",
    // audiodownload_allowed: true,
    // content_id_free: false,
  };
  const testTrack3 = {
    id: "1487672",
    // name: "Fun Summer Dance",
    // duration: 158,
    // artist_id: "484797",
    // artist_name: "Alexey Anisimov",
    // artist_idstr: "Alexey_Anisimov_(2)",
    // album_name: "Fun Summer Dance",
    // album_id: "391902",
    // license_ccurl: "http://creativecommons.org/licenses/by-nc-nd/3.0/",
    // position: 1,
    // releasedate: "2017-10-19",
    // album_image:
    //   "https://usercontent.jamendo.com?type=album&id=391902&width=300&trackid=1487672",
    // audio:
    //   "https://prod-1.storage.jamendo.com/?trackid=1487672&format=mp32&from=tQzt4dHvV1PzSfzWRM8sJw%3D%3D%7CJ2l85mKTw%2F5nKJSs9xQsGg%3D%3D",
    // audiodownload:
    //   "https://prod-1.storage.jamendo.com/download/track/1487672/mp32/",
    // prourl: "https://licensing.jamendo.com/track/1487672",
    // shorturl: "https://jamen.do/t/1487672",
    // shareurl: "https://www.jamendo.com/track/1487672",
    // // waveform: {"peaks": [ ... ]},
    // image:
    //   "https://usercontent.jamendo.com?type=album&id=391902&width=300&trackid=1487672",
    // audiodownload_allowed: true,
    // content_id_free: false,
  };

  const testPlaylist = [testTrack];
  const userID = "vtjOLx6Q8MS6fe3tVednOrv7g9I2";
  const testPlaylistID = "0c5yFLIjE8xKH2wbsGg0";

  // context value to be provided to consuming components
  // functions to update state are also provided
  // so that consuming components can update the state
  const contextValue = {
    testTrack,
    testTrack2,
    testTrack3,
    testPlaylist,
    userID,
    testPlaylistID,
  };

  return (
    <TestingContext.Provider value={contextValue}>
      {children}
    </TestingContext.Provider>
  );
};

export const useTestingContext = () => {
  const context = useContext(TestingContext);
  if (context === undefined) {
    throw new Error(
      "useTestingContext must be used within a TestingContextProvider"
    );
  }
  return context;
};
