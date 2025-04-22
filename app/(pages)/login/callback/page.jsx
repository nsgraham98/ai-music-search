import { Suspense } from "react";
import JamendoCallback from "./jamendo-callback";

export default function CallbackPage() {
  return (
    <Suspense fallback={<p>Loading callback...</p>}>
      <JamendoCallback />
    </Suspense>
  );
}
