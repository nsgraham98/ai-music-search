// This file is the root layout.
// i.e. UI that is shared among ALL pages in the app.
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "/styles/globals.css";
import "/styles/customize-progress-bar.css";
import "/styles/accessibility.css";

import { AudioPlayerProvider } from "@/context/audio-player-context.jsx";
import { AuthContextProvider } from "@/context/auth-context.jsx";
import { UserProfileContextProvider } from "@/context/user-profile-context.jsx";
import { AppInitializer } from "@/app/components/app-initializer.jsx";
import ColorblindFilters from "@/app/components/settings/colorblind-filters";
import ClientErrorBoundary from "@/app/components/error-boundary-client.jsx";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TUTTi.",
  description: "Music discovery and playlist management",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <ClientErrorBoundary>
          <AudioPlayerProvider>
            <AuthContextProvider>
              <UserProfileContextProvider>
                {/* Global accessibility filters */}
                <ColorblindFilters />

                <div
                  style={{
                    backgroundColor: "#1e1e1e",
                    color: "white",
                    minHeight: "100vh",
                  }}
                >
                  <AppInitializer />
                  {children}

                  <nav style={{ marginBottom: "1rem" }}>
                    <Link href="/spotify-test">
                      <button
                        style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
                      >
                        Test Spotify Connection
                      </button>
                    </Link>
                  </nav>
                </div>
              </UserProfileContextProvider>
            </AuthContextProvider>
          </AudioPlayerProvider>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
