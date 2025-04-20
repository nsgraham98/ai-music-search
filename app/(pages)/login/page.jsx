"use client";
import { useUserAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginForm } from "@/app/components/login-form";

export default function LoginPage() {
  const { user } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/home"); // Redirect to the home page if the user is already logged in
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <LoginForm />
    </div>
  );
}
