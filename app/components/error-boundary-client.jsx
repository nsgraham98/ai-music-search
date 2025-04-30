// components/ClientErrorBoundary.jsx
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
