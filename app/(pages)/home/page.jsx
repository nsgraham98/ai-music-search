// Our apps home page
"use client";
import { AudioPlayer } from "@/app/components/audio/audio-player.jsx";
import SearchBar from "@/app/components/search-bar.jsx";
import { useRouter } from "next/navigation";
import { LogoutButton } from "@/app/components/logout-button";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Home Page</h1>
      <LogoutButton />
      <SearchBar />
      <AudioPlayer />
    </div>
  );
}
