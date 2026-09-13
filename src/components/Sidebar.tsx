import Link from "next/link";
import { BookOpen } from "lucide-react";
import { labModules } from "@/data/labModules";

export function Sidebar() {
  return (
    <div className="w-64 bg-black/40 border-r border-white/10 flex flex-col h-screen p-4 backdrop-blur-md z-10">
      <div className="flex items-center gap-2 mb-8 px-2">
        <BookOpen className="w-6 h-6 text-blue-400" />
        <h1 className="text-xl font-bold text-white tracking-wide">Quantum<span className="text-blue-500">Edu</span></h1>
      </div>
      
      <nav className="flex flex-col gap-2">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">Modules</div>
        <div className="overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-2">
          {labModules.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/lab/${lesson.id}`}
              className="px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              {lesson.title}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
