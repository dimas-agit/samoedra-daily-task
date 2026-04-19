"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./components/spinner";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/auth/login");
    }
  }, [router]);

  return <Spinner text="Loading ..." />;
}