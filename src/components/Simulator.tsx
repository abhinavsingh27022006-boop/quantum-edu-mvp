'use client';

import React, { useState } from 'react';
import { useCircuitStore } from '@/store/useCircuitStore';
import { simulateCircuit, SimulationResult } from '@/utils/localSimulator';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { StatevectorTable } from './StatevectorTable';
import { PhaseDial } from './PhaseDial';

export function Simulator() {
  const { circuitState, numQubits } = useCircuitStore();
  const [results, setResults] = useState<SimulationResult[] | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'probabilities' | 'math'>('probabilities');

  const runSimulation = () => {
    setIsSimulating(true);
    setError(null);
    setResults(null);
    
    try {
      const formattedResults = simulateCircuit(circuitState, numQubits);
      setResults(formattedResults);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during local simulation.');
    } finally {
      setIsSimulating(false);
    }
  };

  const isLargeState = results && results.length > 8;

  return (
    <div className="relative flex flex-col h-full bg-black/40 border border-white/10 rounded-xl p-4 shadow-xl backdrop-blur-sm">

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-zinc-100 font-bold">Simulation Results</h3>
          
          <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setViewMode('probabilities')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'probabilities' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Probabilities
            </button>
            <button
              onClick={() => setViewMode('math')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'math' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Math & Phase
            </button>
          </div>
        </div>

        <button
          id="tour-run-button"
          onClick={runSimulation}
          disabled={isSimulating}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900/50 disabled:text-zinc-500 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors shadow-lg flex items-center gap-2"
        >
          {isSimulating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Simulating...
            </>
          ) : (
            'Run Simulation'
          )}
        </button>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {error && (
          <div className="absolute top-0 w-full text-red-400 text-sm p-4 bg-red-900/20 border border-red-900/50 rounded-lg shadow-md z-10">
            <span className="font-bold block mb-1">Execution Error:</span>
            <pre className="whitespace-pre-wrap font-mono text-xs overflow-auto max-h-32">{error}</pre>
          </div>
        )}
        
        {!results && !error && (
          <div className="text-zinc-500 text-sm m-auto">
            Click "Run Simulation" to see results.
          </div>
        )}

        {results && viewMode === 'probabilities' && (
          <div className={`w-full h-full ${isLargeState ? 'overflow-x-auto custom-scrollbar' : ''}`}>
            <div style={{ width: isLargeState ? `${results.length * 50}px` : '100%', height: '100%', minHeight: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.5} />
                  <XAxis dataKey="state" stroke="#71717a" interval={0} angle={isLargeState ? -45 : 0} textAnchor={isLargeState ? 'end' : 'middle'} height={isLargeState ? 60 : 30} />
                  <YAxis stroke="#71717a" tickFormatter={(value) => value + '%'} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
                    formatter={(value: any) => [value + '%', 'Probability']}
                  />
                  <Bar dataKey="prob" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {results && viewMode === 'math' && (
          <div className="flex w-full h-full gap-4 overflow-hidden">
            {/* Left side: Data Grid */}
            <div className="flex-1 h-full min-w-[250px]">
              <StatevectorTable results={results} />
            </div>
            
            {/* Right side: Phase Dials */}
            <div className="flex-1 h-full bg-black/30 border border-white/5 rounded-lg p-4 overflow-y-auto custom-scrollbar">
              <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-4 font-semibold">Phase Visualizer</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.map((res) => (
                  <PhaseDial key={res.state} result={res} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
