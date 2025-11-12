"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");

    if (token) {
      localStorage.setItem("token", token);
      if (role) localStorage.setItem("role", role);
      router.replace("/");
    } else {
      window.location.href = "https://localhost:7237/login";
    }
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center h-screen text-gray-700">
      Redirecionando...
    </div>
  );
}