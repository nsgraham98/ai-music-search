import Image from "next/image";
import ExamplePage from "./components/page.js";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Home Page</h1>
      <ExamplePage />
    </div>
  );
}
