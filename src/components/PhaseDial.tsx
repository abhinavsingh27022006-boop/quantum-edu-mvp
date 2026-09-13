import React from 'react';
import { SimulationResult } from '@/utils/localSimulator';

interface Props {
  result: SimulationResult;
}

export function PhaseDial({ result }: Props) {
  // If probability is 0, we can render it very dim or skip entirely. 
  // Let's render it but heavily dimmed.
  const isZero = result.prob === 0;
  const opacity = isZero ? 0.1 : Math.max(0.3, result.prob / 100);
  
  // Phase is either 0 or 180 in MVP
  // 0 -> points right
  // 180 -> points left
  const rotation = result.phase === 180 ? 180 : 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className="relative w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-500"
        style={{
          backgroundColor: `rgba(168, 85, 247, ${opacity * 0.5})`, // Purple glow
          boxShadow: isZero ? 'none' : `0 0 ${opacity * 15}px rgba(168, 85, 247, ${opacity})`
        }}
      >
        {!isZero && (
          <div 
            className="absolute w-1/2 h-[2px] bg-white origin-left rounded-full transition-transform duration-500"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              left: '50%'
            }}
          >
            {/* Arrow Head */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_cyan]" />
          </div>
        )}
      </div>
      <span className={`font-mono text-xs ${isZero ? 'text-zinc-600' : 'text-zinc-300'}`}>
        |{result.state}⟩
      </span>
    </div>
  );
}
