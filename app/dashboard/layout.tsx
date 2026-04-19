"use client";

import { useAuth } from "../hooks/useAuth";
import Spinner from "../components/spinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuth();

  if (loading) {
    return <Spinner text="Loading ..." />;
  }

  return <>{children}</>;
}