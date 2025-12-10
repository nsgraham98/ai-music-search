// IMPROVED LAYOUT.JSX - Mobile Responsive Version
// This file is the root layout with better mobile responsiveness

import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "/styles/globals.css";
import "/styles/customize-progress-bar.css";
import { Providers } from "./providers.jsx";
import { Box, Typography, Container, useMediaQuery } from "@mui/material";
import SignedInAs from "@/app/components/login/signed-in-as";
import { LogoutButton } from "@/app/components/login/logout-button";
import Navigation from "@/app/components/navigation/nav-bar.jsx";
import LoginPopup from "@/app/components/login/login-popup.jsx";
import ColorblindFilters from "@/app/components/settings/colorblind-filters.jsx";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TUTTi - AI Music Search",
  description: "AI-powered royalty-free music search",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body className="dark-mode">
        <Providers>
          <Box
            sx={{
              backgroundColor: "#1e1e1e",
              color: "white",
              minHeight: "100vh",
              pb: {
                xs: "120px", // More space on mobile for audio player
                sm: "120px",
                md: "30vh",
              },
              pt: { xs: 2, sm: 3, md: 4 },
              width: "100%",
            }}
          >
            <Container
              maxWidth="lg"
              sx={{
                px: { xs: 1, sm: 2, md: 3 }, // Less padding on mobile
              }}
            >
              <LoginPopup />
              <ColorblindFilters />

              {/* Header and Logout */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={{ xs: 2, sm: 3, md: 4 }}
                flexWrap="wrap"
                gap={{ xs: 1, sm: 2 }}
              >
                <Link href="/" passHref>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "white",
                      fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                    }}
                  >
                    TUTTi.
                  </Typography>
                </Link>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={{ xs: 0.5, sm: 1, md: 2 }}
                  sx={{
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                    justifyContent: { xs: "flex-end", sm: "flex-start" },
                  }}
                >
                  <SignedInAs />
                  <LogoutButton />
                </Box>
              </Box>

              {/* Navigation Bar */}
              <Navigation />

              {/* Main Content */}
              <Box
                sx={{
                  width: "100%",
                  overflowX: "hidden", // Prevent horizontal scroll
                }}
              >
                {children}
              </Box>
            </Container>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
