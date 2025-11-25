"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@mui/material";
import React from "react";

export function NavButton({ href, label, icon, isActiveOverride }) {
  const pathname = usePathname();

  const isActive = isActiveOverride
    ? isActiveOverride(pathname)
    : pathname === href;

  return (
    <Button
      component={Link}
      href={href}
      startIcon={icon}
      variant={isActive ? "contained" : "outlined"}
      sx={{
        color: isActive ? "white" : "#888",
        borderColor: isActive ? "#E03FD8" : "#444",
        bgcolor: isActive ? "#E03FD8" : "transparent",
        "&:hover": {
          bgcolor: isActive ? "#c133b9" : "#3a3a3a",
          borderColor: isActive ? "#c133b9" : "#888",
          transform: "translateY(-2px)",
          boxShadow: isActive
            ? "0 4px 12px rgba(224, 63, 216, 0.4)"
            : "0 2px 8px rgba(0, 0, 0, 0.3)",
        },
        textTransform: "none",
        fontSize: "0.95rem",
        fontWeight: isActive ? "bold" : "normal",
        px: 2.5,
        py: 1,
        transition: "all 0.2s",
        minWidth: { xs: "100px", sm: "120px" },
      }}
    >
      {label}
    </Button>
  );
}
