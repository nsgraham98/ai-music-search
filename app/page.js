// Our apps home page

import Image from "next/image";
import { AudioPlayer } from "./components/audio/audio-player.jsx";
import SearchBar from "./components/search-bar.jsx";
import Login from "./components/login.jsx";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Home Page</h1>
      <AudioPlayer />
      <SearchBar />
      {/* <Login /> */}
    </div>
  );
}
