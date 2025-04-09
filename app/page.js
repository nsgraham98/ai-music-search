// Our apps home page

import Image from "next/image";
import { AudioPlayer } from "./components/audio/audio-player.jsx";
import SearchBar from "./components/search-bar.jsx";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Home Page</h1>
      <AudioPlayer />
      <SearchBar />
    </div>
  );
}
