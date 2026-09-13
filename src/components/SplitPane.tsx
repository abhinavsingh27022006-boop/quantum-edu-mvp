import React from "react";

export function SplitPane({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-transparent overflow-hidden text-zinc-100">
      <div className="w-1/2 h-full overflow-y-auto border-r border-white/10 p-8 custom-scrollbar">
        {left}
      </div>
      <div className="w-1/2 h-full overflow-y-auto bg-black/20 p-8 custom-scrollbar relative flex flex-col">
        {right}
      </div>
    </div>
  );
}
