"use client";

import { Box, Container, useMediaQuery, useTheme } from "@mui/material";

/**
 * Mobile-optimized layout wrapper
 * Use this to wrap page content for better mobile responsiveness
 */
export const MobileLayoutWrapper = ({ children, noPadding = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        // Add bottom padding for fixed audio player
        paddingBottom: {
          xs: "140px", // Mobile - more space for stacked player
          sm: "120px", // Tablet
          md: "100px", // Desktop
        },
        // Prevent horizontal scroll
        overflowX: "hidden",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: noPadding ? 0 : 2, // Mobile
            sm: noPadding ? 0 : 3, // Tablet
            md: noPadding ? 0 : 4, // Desktop
          },
          py: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

/**
 * Responsive Grid for search results or track listings
 */
export const ResponsiveGrid = ({ children, spacing = 2 }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr", // Mobile - single column
          sm: "repeat(2, 1fr)", // Tablet - 2 columns
          md: "repeat(3, 1fr)", // Desktop - 3 columns
          lg: "repeat(4, 1fr)", // Large desktop - 4 columns
        },
        gap: spacing,
        width: "100%",
      }}
    >
      {children}
    </Box>
  );
};

/**
 * Mobile-friendly Card component
 */
export const MobileCard = ({ children, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: "#2e2d2d",
        borderRadius: 2,
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:active": {
          transform: onClick ? "scale(0.98)" : "none",
        },
        // Light mode
        ".light-mode &": {
          bgcolor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        },
        // Touch feedback
        "@media (hover: none)": {
          "&:active": {
            opacity: 0.9,
          },
        },
      }}
    >
      {children}
    </Box>
  );
};

/**
 * Mobile-optimized Button
 */
export const MobileButton = ({
  children,
  onClick,
  variant = "contained",
  fullWidth = false,
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        minHeight: "48px",
        padding: "12px 24px",
        fontSize: "16px",
        fontWeight: 600,
        borderRadius: "8px",
        border: variant === "outlined" ? "2px solid #E03FD8" : "none",
        bgcolor: variant === "contained" ? "#E03FD8" : "transparent",
        color: variant === "contained" ? "#fff" : "#E03FD8",
        cursor: "pointer",
        transition: "all 0.2s",
        width: fullWidth ? "100%" : "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        "&:active": {
          transform: "scale(0.98)",
          opacity: 0.9,
        },
        "&:disabled": {
          opacity: 0.5,
          cursor: "not-allowed",
        },
        // Light mode
        ".light-mode &": {
          bgcolor: variant === "contained" ? "#E03FD8" : "#fff",
          border: variant === "outlined" ? "2px solid #E03FD8" : "none",
        },
        // Remove tap highlight
        WebkitTapHighlightColor: "transparent",
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * Mobile-optimized Input Field
 */
export const MobileInput = ({
  placeholder,
  value,
  onChange,
  type = "text",
  ...props
}) => {
  return (
    <Box
      component="input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      sx={{
        width: "100%",
        minHeight: "48px",
        padding: "12px 16px",
        fontSize: "16px", // Prevents zoom on iOS
        borderRadius: "8px",
        border: "2px solid #444",
        bgcolor: "#2e2d2d",
        color: "#fff",
        outline: "none",
        transition: "border-color 0.2s",
        "&:focus": {
          borderColor: "#E03FD8",
        },
        // Light mode
        ".light-mode &": {
          bgcolor: "#ffffff",
          color: "#000",
          border: "2px solid #cccccc",
          "&:focus": {
            borderColor: "#E03FD8",
          },
        },
        // Disable iOS styling
        WebkitAppearance: "none",
        MozAppearance: "none",
        appearance: "none",
        ...props.sx,
      }}
      {...props}
    />
  );
};

/**
 * Mobile-optimized Section Header
 */
export const MobileSectionHeader = ({ title, action }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        px: { xs: 0, sm: 0 },
      }}
    >
      <Box
        component="h2"
        sx={{
          fontSize: { xs: "20px", sm: "24px", md: "28px" },
          fontWeight: 700,
          margin: 0,
          color: "#fff",
          ".light-mode &": {
            color: "#000",
          },
        }}
      >
        {title}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
};

/**
 * Mobile Bottom Sheet / Modal
 */
export const MobileBottomSheet = ({ open, onClose, children, title }) => {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <Box
        onClick={onClose}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1300,
          display: { xs: "block", md: "none" },
        }}
      />

      {/* Bottom Sheet */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "#2e2d2d",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          zIndex: 1400,
          maxHeight: "80vh",
          overflowY: "auto",
          display: { xs: "block", md: "none" },
          animation: "slideUp 0.3s ease-out",
          "@keyframes slideUp": {
            from: {
              transform: "translateY(100%)",
            },
            to: {
              transform: "translateY(0)",
            },
          },
          ".light-mode &": {
            bgcolor: "#ffffff",
          },
          // Safe area for iOS
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Handle */}
        <Box
          sx={{
            width: "40px",
            height: "4px",
            bgcolor: "#666",
            borderRadius: "2px",
            margin: "12px auto",
            ".light-mode &": {
              bgcolor: "#ccc",
            },
          }}
        />

        {/* Title */}
        {title && (
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: "1px solid #444",
              ".light-mode &": {
                borderBottom: "1px solid #e0e0e0",
              },
            }}
          >
            <Box
              component="h3"
              sx={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 600,
                color: "#fff",
                ".light-mode &": {
                  color: "#000",
                },
              }}
            >
              {title}
            </Box>
          </Box>
        )}

        {/* Content */}
        <Box sx={{ px: 3, py: 2 }}>{children}</Box>
      </Box>
    </>
  );
};

/**
 * Stack Layout - Flexible vertical stack with spacing
 */
export const MobileStack = ({
  children,
  spacing = 2,
  direction = "column",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: direction,
          sm: direction === "column" ? "column" : "row",
        },
        gap: spacing,
        width: "100%",
      }}
    >
      {children}
    </Box>
  );
};
