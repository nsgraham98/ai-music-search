"use client";
import { useEffect } from "react";

export default function ColorblindFilters() {
  useEffect(() => {
    // Load saved settings from localStorage
    if (typeof window !== "undefined") {
      const savedDarkMode = localStorage.getItem("darkMode");
      const savedColorblind = localStorage.getItem("colorblindMode");
      const savedHighContrast = localStorage.getItem("highContrast");
      const savedReducedMotion = localStorage.getItem("reducedMotion");

      // Apply dark mode
      if (savedDarkMode !== null) {
        const isDark = savedDarkMode === "true";
        if (isDark) {
          document.body.classList.remove("light-mode");
          document.body.classList.add("dark-mode");
        } else {
          document.body.classList.remove("dark-mode");
          document.body.classList.add("light-mode");
        }
      }

      // Apply colorblind mode
      if (savedColorblind) {
        document.body.setAttribute("data-colorblind-mode", savedColorblind);
      }

      // Apply high contrast
      if (savedHighContrast !== null) {
        const isEnabled = savedHighContrast === "true";
        if (isEnabled) {
          document.body.classList.add("high-contrast");
        } else {
          document.body.classList.remove("high-contrast");
        }
      }

      // Apply reduced motion
      if (savedReducedMotion !== null) {
        const isEnabled = savedReducedMotion === "true";
        if (isEnabled) {
          document.body.classList.add("reduced-motion");
        } else {
          document.body.classList.remove("reduced-motion");
        }
      }
    }
  }, []);

  return (
    <svg style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        {/* Protanopia (Red-Blind) Filter */}
        <filter id="protanopia-filter">
          <feColorMatrix
            type="matrix"
            values="0.567, 0.433, 0,     0, 0
                    0.558, 0.442, 0,     0, 0
                    0,     0.242, 0.758, 0, 0
                    0,     0,     0,     1, 0"
          />
        </filter>
        {/* Deuteranopia (Green-Blind) Filter */}
        <filter id="deuteranopia-filter">
          <feColorMatrix
            type="matrix"
            values="0.625, 0.375, 0,   0, 0
                    0.7,   0.3,   0,   0, 0
                    0,     0.3,   0.7, 0, 0
                    0,     0,     0,   1, 0"
          />
        </filter>
        {/* Tritanopia (Blue-Blind) Filter */}
        <filter id="tritanopia-filter">
          <feColorMatrix
            type="matrix"
            values="0.95, 0.05,  0,     0, 0
                    0,    0.433, 0.567, 0, 0
                    0,    0.475, 0.525, 0, 0
                    0,    0,     0,     1, 0"
          />
        </filter>
      </defs>
    </svg>
  );
}
