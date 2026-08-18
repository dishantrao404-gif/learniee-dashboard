"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar({ userName }: { userName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
            L
          </div>
          <span className="font-semibold text-slate-900">Learniee</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-sm text-slate-500">
            Hi, {userName.split(" ")[0]}
          </span>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="text-sm font-medium text-slate-600 hover:text-red-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:border-red-200 transition-colors disabled:opacity-60"
          >
            {loading ? "Logging out..." : "Log out"}
          </button>
        </div>
      </div>
    </header>
  );
}
