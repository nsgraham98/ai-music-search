"use client";

import { useUserAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    } else {
      router.push("/home");
    }
  }, [user, loading, router]);

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
}
