import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { GateNode } from '@/store/useCircuitStore';

interface DroppableWireProps {
  id: string; // "wire-0" or "wire-1"
  qubitIndex: number;
  gates: GateNode[];
}

export function DroppableWire({ id, qubitIndex, gates }: DroppableWireProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: { qubitIndex },
  });

  return (
    <div className="flex items-center w-full my-4 relative h-16">
      {/* Qubit Label */}
      <div className="w-12 text-zinc-400 font-mono text-lg font-bold">
        q{qubitIndex}
      </div>
      
      {/* Wire and Droppable Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 flex items-center relative h-full rounded-md transition-colors ${
          isOver ? 'bg-blue-900/20' : ''
        }`}
      >
        {/* The actual line */}
        <div className="absolute left-0 right-0 h-0.5 bg-zinc-600 z-0 top-1/2 -translate-y-1/2" />
        
        {/* Render gates placed on this wire */}
        <div className="relative z-10 flex gap-4 px-4 h-full items-center">
          {gates.map((gate, index) => {
            let bgColor = 'bg-purple-600'; // H
            if (gate.type === 'X') bgColor = 'bg-blue-600';
            if (gate.type === 'Y') bgColor = 'bg-yellow-500';
            if (gate.type === 'Z') bgColor = 'bg-pink-500';
            if (gate.type === 'CX') bgColor = 'bg-emerald-600';

            return (
              <div
                key={`${gate.id}-${index}`}
                className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center text-white font-bold shadow-lg border border-white/10`}
              >
                {gate.type}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
