import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface DraggableGateProps {
  id: string;
  type: 'H' | 'X' | 'CX' | 'Y' | 'Z';
}

export function DraggableGate({ id, type }: DraggableGateProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: { type },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  let bgColor = 'bg-purple-600'; // H
  if (type === 'X') bgColor = 'bg-blue-600';
  if (type === 'Y') bgColor = 'bg-yellow-500';
  if (type === 'Z') bgColor = 'bg-pink-500';
  if (type === 'CX') bgColor = 'bg-emerald-600';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center text-white font-bold cursor-grab active:cursor-grabbing shadow-lg border border-white/10 hover:brightness-110 transition-all`}
    >
      {type}
    </div>
  );
}
