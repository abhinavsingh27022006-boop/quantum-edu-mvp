'use client';

import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";

export function TopNav() {
  const { lastDailyCompleted } = useUserStore();
  const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    const todayStr = new Date().toDateString();
    setShowDot(lastDailyCompleted !== todayStr);
  }, [lastDailyCompleted]);

  return (
    <div className="w-full h-16 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center gap-8 px-8 z-20 relative">
      <Link href="/dashboard" className="text-zinc-400 hover:text-white font-semibold transition-colors px-4 py-2 rounded-md hover:bg-white/5">
        Dashboard
      </Link>
      <Link href="/daily" className="text-zinc-400 hover:text-white font-semibold transition-colors px-4 py-2 rounded-md hover:bg-white/5 relative flex items-center">
        Daily Puzzle
        {showDot && (
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
          </span>
        )}
      </Link>
      <Link href="/study" className="text-zinc-400 hover:text-white font-semibold transition-colors px-4 py-2 rounded-md hover:bg-white/5">
        Study Lab
      </Link>
      <Link href="/lab/01-superposition" className="text-zinc-400 hover:text-white font-semibold transition-colors px-4 py-2 rounded-md hover:bg-white/5">
        Quantum Lab
      </Link>
      <Link href="/sandbox" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors px-4 py-2 rounded-md hover:bg-purple-900/20 border border-purple-500/30">
        Pro Sandbox
      </Link>
    </div>
  );
}
