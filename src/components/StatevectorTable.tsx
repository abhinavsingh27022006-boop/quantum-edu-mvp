import React from 'react';
import { SimulationResult } from '@/utils/localSimulator';

interface Props {
  results: SimulationResult[];
}

export function StatevectorTable({ results }: Props) {
  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar border border-white/10 rounded-lg bg-black/50">
      <table className="w-full text-left font-mono text-sm">
        <thead className="sticky top-0 bg-[#1e1e24] border-b border-white/10 shadow-md">
          <tr>
            <th className="px-4 py-3 text-zinc-400 font-medium">Ket |ψ⟩</th>
            <th className="px-4 py-3 text-zinc-400 font-medium text-right">Amplitude (α)</th>
            <th className="px-4 py-3 text-zinc-400 font-medium text-right">Probability (|α|²)</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => {
            const isZero = r.prob === 0;
            return (
              <tr 
                key={r.state} 
                className={`border-b border-white/5 transition-colors ${
                  isZero ? 'text-zinc-600' : 'text-zinc-200 hover:bg-white/5'
                }`}
              >
                <td className="px-4 py-2">|{r.state}⟩</td>
                <td className="px-4 py-2 text-right">{r.amplitude.toFixed(3)}</td>
                <td className="px-4 py-2 text-right">
                  <span className={!isZero ? 'text-blue-400' : ''}>
                    {r.prob.toFixed(1)}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
