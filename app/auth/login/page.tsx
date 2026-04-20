"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinner from "@/app/components/spinner";
import { useAuth } from "@/app/components/AuthProvider";
import samoedra from "@/public/samoedra_logo.png";
export default function LoginPage() {
  const router = useRouter();
 const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        router.replace("/dashboard");
    }
    }, [router]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // ✅ Save token
      localStorage.setItem("token", data.token);
      
      // ✅ Redirect to dashboard
     
    login(data.token); // 🔥 penting
    router.replace("/dashboard"); // pakai replace

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-cyan-300">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <img src={samoedra.src} className="h-11 md:h-13 mx-auto"/>
        <h1 className="text-xl font-bold text-center mb-6 text-blue-400">
          Login
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded-lg text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
  type="submit"
  className="w-full bg-blue-500 text-white p-3 rounded-lg flex justify-center items-center"
  disabled={loading}
>
  {loading ? (
    <Spinner text="Logging in..." />
  ) : (
    "Login"
  )}
</button>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/auth/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}