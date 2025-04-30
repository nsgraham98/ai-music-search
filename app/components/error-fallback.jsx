import React from "react";

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div style={{ padding: "2rem", textAlign: "center", color: "white" }}>
      <h1>Something went wrong.</h1>
      <pre>{error?.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}
