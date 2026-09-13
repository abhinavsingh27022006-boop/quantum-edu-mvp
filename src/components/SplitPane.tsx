import React from "react";

export function SplitPane({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-[calc(100vh-4rem)] bg-transparent text-zinc-100">
      <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-white/10">
        {left}
      </div>
      <div className="w-full md:w-1/2 bg-black/20 p-8 flex flex-col gap-6">
        {right}
      </div>
    </div>
  );
}
