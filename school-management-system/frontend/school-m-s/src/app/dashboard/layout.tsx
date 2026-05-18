"use client";

import { useAuthStore } from "@/store/auth-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = useAuthStore((s) => s.role);

  return (
    <div className="flex">
      <aside className="w-64 p-4 border-r">
        <h2>School MS</h2>

        <p className="text-sm text-gray-500">Role: {role}</p>

        <nav className="mt-4 space-y-2">
          <a href="/dashboard">Dashboard</a>
          <a href="/students">Students</a>

          {role === "ADMIN" && <a href="/teachers">Teachers</a>}
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}