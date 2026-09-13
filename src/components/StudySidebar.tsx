import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { studyCurriculum } from "@/data/studyCurriculum";

export function StudySidebar() {
  return (
    <div className="w-72 bg-black/40 border-r border-white/10 flex flex-col h-full p-4 backdrop-blur-md z-10">
      <div className="flex items-center gap-2 mb-8 px-2">
        <GraduationCap className="w-6 h-6 text-purple-400" />
        <h1 className="text-xl font-bold text-white tracking-wide">Study<span className="text-purple-500">Lab</span></h1>
      </div>
      
      <nav className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
        {studyCurriculum.map((mod, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2">
              {mod.module}
            </div>
            <div className="flex flex-col gap-1">
              {mod.sessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/study/${session.id}`}
                  className="px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                >
                  {session.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
