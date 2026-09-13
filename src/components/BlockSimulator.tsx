'use client';

import React, { useState, useEffect } from 'react';
import { simulateCircuit } from '@/utils/localSimulator';
import { GateNode } from '@/store/useCircuitStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function BlockSimulator() {
  const [gates, setGates] = useState<GateNode[]>([]);
  const [results, setResults] = useState<{ state: string; prob: number }[]>([]);

  useEffect(() => {
    const res = simulateCircuit(gates);
    setResults(res);
  }, [gates]);

  const addGate = (type: GateNode['type'], target: number, control?: number) => {
    setGates([...gates, { id: `block-${gates.length}`, type, target, control }]);
  };
  const clear = () => setGates([]);

  return (
    <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-6 my-8 max-w-lg mx-auto shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-zinc-100 font-bold">Interactive Sandbox</h3>
        <button 
          onClick={clear}
          className="text-xs px-3 py-1 bg-zinc-800 hover:bg-red-900/50 text-zinc-400 hover:text-red-400 rounded transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <div className="flex gap-2">
          <button onClick={() => addGate('H', 0)} className="flex-1 py-2 text-xs bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 text-purple-200 rounded font-bold transition-colors">+ H(0)</button>
          <button onClick={() => addGate('X', 0)} className="flex-1 py-2 text-xs bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 text-blue-200 rounded font-bold transition-colors">+ X(0)</button>
          <button onClick={() => addGate('Y', 0)} className="flex-1 py-2 text-xs bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-500/50 text-yellow-200 rounded font-bold transition-colors">+ Y(0)</button>
          <button onClick={() => addGate('Z', 0)} className="flex-1 py-2 text-xs bg-pink-600/20 hover:bg-pink-600/40 border border-pink-500/50 text-pink-200 rounded font-bold transition-colors">+ Z(0)</button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => addGate('H', 1)} className="flex-1 py-2 text-xs bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 text-purple-200 rounded font-bold transition-colors">+ H(1)</button>
          <button onClick={() => addGate('X', 1)} className="flex-1 py-2 text-xs bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 text-blue-200 rounded font-bold transition-colors">+ X(1)</button>
          <button onClick={() => addGate('CX', 1, 0)} className="flex-[2] py-2 text-xs bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/50 text-emerald-200 rounded font-bold transition-colors">+ CNOT (Ctrl:0, Tgt:1)</button>
        </div>
      </div>

      <div className="bg-black/50 rounded-lg p-4 mb-6 border border-zinc-800 font-mono text-sm text-zinc-300">
        Circuit: {gates.length === 0 ? 'Empty' : gates.map(g => g.type === 'CX' ? `CX(0->1)` : `${g.type}(${g.target})`).join(' → ')}
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={results} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.5} />
            <XAxis dataKey="state" stroke="#71717a" fontSize={12} />
            <YAxis stroke="#71717a" fontSize={12} tickFormatter={(value) => value + '%'} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
              formatter={(value: any) => [value + '%', 'Probability']}
            />
            <Bar dataKey="prob" fill="#a855f7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
