import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.replace("/login");
  }, [token, router]);

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="mb-4">You must be logged in to view this page.</p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Go to Login</Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
