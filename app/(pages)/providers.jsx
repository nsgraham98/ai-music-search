// File for all the context providers used in the app
// Use this file in the root layout to wrap the app in all providers
// This avoids having client-side code in the root layout file
"use client";

import { AudioPlayerProvider } from "@/context/audio-player-context.jsx";
import { AuthContextProvider } from "@/context/auth-context.jsx";
import { UserProfileContextProvider } from "@/context/user-profile-context.jsx";
import ClientErrorBoundary from "@/app/components/error-boundary-client.jsx";
import { TestingContextProvider } from "@/context/testing-context";
import { AudioPlayer } from "@/app/components/audio/audio-player.jsx";
import { SearchContextProvider } from "@/context/search-context";

export function Providers({ children }) {
  return (
    <ClientErrorBoundary>
      <AudioPlayerProvider>
        <AuthContextProvider>
          <UserProfileContextProvider>
            <TestingContextProvider>
              <AudioPlayer />
              <SearchContextProvider>{children}</SearchContextProvider>
            </TestingContextProvider>
          </UserProfileContextProvider>
        </AuthContextProvider>
      </AudioPlayerProvider>
    </ClientErrorBoundary>
  );
}
