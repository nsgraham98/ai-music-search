// drop-in React error boundary component.
// It wraps around children and catches JavaScript errors that happen in rendering or lifecycle methods
// used in app/(pages)/layout.jsx to wrap the entire app in an error boundary
// Prevents a single component failure from crashing the entire app.

"use client";

import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./error-fallback";

export default function ClientErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      {children}
    </ErrorBoundary>
  );
}
