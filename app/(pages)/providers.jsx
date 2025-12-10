// File for all the context providers used in the app
// Use this file in the root layout to wrap the app in all providers
// This avoids having client-side code in the root layout file
"use client";

import { AudioPlayerProvider } from "@/context/audio-player-context.jsx";
import { AuthContextProvider } from "@/context/auth-context.jsx";
import { UserProfileContextProvider } from "@/context/user-profile-context.jsx";
import ClientErrorBoundary from "@/app/components/error-boundary-client.jsx";
// import { AudioPlayer } from "@/app/components/audio/audio-player.jsx";
import { AudioPlayer } from "@/app/components/mobile/audio-player-mobile.jsx";
import { SearchContextProvider } from "@/context/search-context";

export function Providers({ children }) {
  return (
    <ClientErrorBoundary>
      <AudioPlayerProvider>
        <AuthContextProvider>
          <UserProfileContextProvider>
            <AudioPlayer />
            <SearchContextProvider>{children}</SearchContextProvider>
          </UserProfileContextProvider>
        </AuthContextProvider>
      </AudioPlayerProvider>
    </ClientErrorBoundary>
  );
}
