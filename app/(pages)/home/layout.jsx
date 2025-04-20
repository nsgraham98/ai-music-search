"use client";

import { useUserAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AudioPlayerProvider } from "@/context/audio-player-context";

export default function DashboardLayout({ children }) {
  const { user, loading } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <AudioPlayerProvider>{children}</AudioPlayerProvider>
    </>
  );
}
