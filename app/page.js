import Image from "next/image";
import ExamplePage from "./components/page.js";
import { Controls } from "./components/audio/controls.js";
import { AudioPlayer } from "./components/audio/audioPlayer.js";
import { SearchBar } from "./components/searchBar.jsx";
import { Results } from "./components/Results.jsx";
export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Home Page</h1>
      <Controls />
      <SearchBar />
      <Results />
    </div>
  );
}
