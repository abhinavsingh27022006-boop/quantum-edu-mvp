'use client';

import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import { useCircuitStore, GateNode } from '@/store/useCircuitStore';
import { DraggableGate } from './DraggableGate';
import { DroppableWire } from './DroppableWire';

export function VisualBuilder() {
  const [mounted, setMounted] = useState(false);
  const { circuitState, addGate, clearCircuit, numQubits, setNumQubits } = useCircuitStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.data.current) {
      const type = active.data.current?.type as 'H' | 'X' | 'CX' | 'Y' | 'Z';
      const targetQubit = over.data.current.qubitIndex as number;
      
      const newGate: GateNode = {
        id: uuidv4(),
        type,
        target: targetQubit,
      };

      if (type === 'CX') {
        newGate.control = 0; // Hardcoded per MVP requirements for now, could be enhanced later
        // Make sure target is not the same as control
        if (targetQubit === 0) {
           newGate.target = 1 < numQubits ? 1 : 0; 
        } else {
           newGate.target = targetQubit;
        }
      }

      addGate(newGate);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-black/40 p-6 rounded-xl border border-white/10 shadow-xl backdrop-blur-sm overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">Visual Circuit Builder</h2>
          
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-1">
            <button 
              onClick={() => setNumQubits(Math.max(1, numQubits - 1))}
              disabled={numQubits <= 1}
              className="w-8 h-8 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-colors"
            >
              -
            </button>
            <span className="font-mono text-sm w-20 text-center">{numQubits} Qubits</span>
            <button 
              onClick={() => setNumQubits(Math.min(5, numQubits + 1))}
              disabled={numQubits >= 5}
              className="w-8 h-8 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={clearCircuit}
          className="px-4 py-2 bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/30 transition-colors text-sm font-semibold shrink-0"
        >
          Clear Circuit
        </button>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-8 min-h-[300px]">
          {/* Sidebar for Gates */}
          <div id="tour-gate-sidebar" className="flex flex-col gap-4 border-r border-white/10 pr-8">
            <h3 className="text-zinc-500 font-semibold text-sm uppercase tracking-wider mb-2">Gates</h3>
            <DraggableGate id="drag-h" type="H" />
            <DraggableGate id="drag-x" type="X" />
            <DraggableGate id="drag-y" type="Y" />
            <DraggableGate id="drag-z" type="Z" />
            <DraggableGate id="drag-cx" type="CX" />
          </div>

          {/* Circuit Canvas */}
          <div id="tour-qubit-wires" className="flex-1 flex flex-col justify-center gap-2 py-4">
            {Array.from({ length: numQubits }).map((_, idx) => {
              const renderGates = circuitState.filter(g => g.target === idx);
              return (
                <DroppableWire 
                  key={`wire-${idx}`} 
                  id={`wire-${idx}`} 
                  qubitIndex={idx} 
                  gates={renderGates} 
                />
              );
            })}
          </div>
        </div>
      </DndContext>
    </div>
  );
}
