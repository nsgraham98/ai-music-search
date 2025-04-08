import Image from "next/image";
import ExamplePage from "./components/page.js";
import { Controls } from "./components/audio/controls.js";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Home Page</h1>
      <Controls />
    </div>
  );
}
