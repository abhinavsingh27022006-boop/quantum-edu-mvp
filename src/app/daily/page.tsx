'use client';

import React, { useState, useEffect } from 'react';
import { useCircuitStore } from '@/store/useCircuitStore';
import { useUserStore } from '@/store/useUserStore';
import { simulateCircuit } from '@/utils/localSimulator';
import { VisualBuilder } from '@/components/VisualBuilder';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import confetti from 'canvas-confetti';
import { Trophy, CalendarCheck } from 'lucide-react';

const DAILY_CHALLENGES = [
  {
    day: "Sunday",
    title: "Quantum Entanglement",
    description: "Create a Bell State (50% |00>, 50% |11>).",
    qubits: 2,
    target: { '00': 50, '11': 50 }
  },
  {
    day: "Monday",
    title: "Superposition Basics",
    description: "Put Qubit 0 into a perfect superposition (50% |00>, 50% |10>).",
    qubits: 2,
    target: { '00': 50, '10': 50 }
  },
  {
    day: "Tuesday",
    title: "The Phase Flip",
    description: "Create a state with -1 amplitude on |11>. Hint: You need a Z gate.",
    qubits: 2,
    // We only check probabilities for MVP, so this is just entanglement prob target
    // In a real app we'd check phase too, but let's stick to probs:
    target: { '11': 100 }
  },
  {
    day: "Wednesday",
    title: "Multi-Qubit Superposition",
    description: "Create a uniform superposition across 3 qubits (12.5% each).",
    qubits: 3,
    target: { '000': 12.5, '001': 12.5, '010': 12.5, '011': 12.5, '100': 12.5, '101': 12.5, '110': 12.5, '111': 12.5 }
  },
  {
    day: "Thursday",
    title: "The X-Y Swap",
    description: "Flip Qubit 1 using a Y gate (0% |00>, 100% |01>).",
    qubits: 2,
    target: { '01': 100 }
  },
  {
    day: "Friday",
    title: "Grover's Prep",
    description: "Initialize 2 qubits into uniform superposition (25% each).",
    qubits: 2,
    target: { '00': 25, '01': 25, '10': 25, '11': 25 }
  },
  {
    day: "Saturday",
    title: "Spooky Action",
    description: "Entangle Q0 and Q1, but flip Q0 first! (50% |01>, 50% |10>).",
    qubits: 2,
    target: { '01': 50, '10': 50 }
  }
];

export default function DailyChallengePage() {
  const { circuitState, numQubits, setNumQubits, clearCircuit } = useCircuitStore();
  const { lastDailyCompleted, claimDailyReward } = useUserStore();
  
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  const today = new Date();
  const dayIndex = today.getDay();
  const todayStr = today.toDateString();
  const challenge = DAILY_CHALLENGES[dayIndex];

  // Initialize Qubits and Check for Completion
  useEffect(() => {
    setMounted(true);
    if (numQubits !== challenge.qubits) {
      setNumQubits(challenge.qubits);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulator & Checker loop
  useEffect(() => {
    if (!mounted || lastDailyCompleted === todayStr || success) return;

    try {
      const results = simulateCircuit(circuitState, challenge.qubits);
      
      // Build combined data for Recharts
      let allMatch = true;
      let hasTarget = false;
      const combinedData = [];

      for (const res of results) {
        const targetProb = challenge.target[res.state] || 0;
        combinedData.push({
          state: res.state,
          YourCircuit: res.prob,
          Target: targetProb
        });

        // Tolerance of 1%
        if (Math.abs(res.prob - targetProb) > 1) {
          allMatch = false;
        }
        if (targetProb > 0) hasTarget = true;
      }

      setChartData(combinedData);

      if (allMatch && hasTarget && circuitState.length > 0) {
        setSuccess(true);
        triggerConfetti();
      }
    } catch (err) {
      console.error(err);
    }
  }, [circuitState, challenge.qubits, challenge.target, lastDailyCompleted, todayStr, mounted, success]);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#a855f7", "#3b82f6", "#10b981"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#a855f7", "#3b82f6", "#10b981"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleClaim = () => {
    claimDailyReward();
    clearCircuit();
  };

  if (!mounted) return null;

  if (lastDailyCompleted === todayStr) {
    return (
      <div className="w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-[#0B0D17] text-white">
        <CalendarCheck className="w-24 h-24 text-green-400 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Daily Challenge Completed!</h1>
        <p className="text-zinc-400 text-lg">You've claimed your 500 XP. Come back tomorrow for a new puzzle!</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col bg-[#0B0D17] relative overflow-hidden">
      <div className="flex-1 flex gap-6 p-6 relative z-10 w-full h-full overflow-hidden">
        
        {/* Left Side: Builder */}
        <div className="flex-[3] h-full overflow-hidden flex flex-col relative">
          
          {/* Challenge Banner */}
          <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-xl p-6 mb-6 shadow-lg backdrop-blur-md">
            <h2 className="text-purple-300 text-sm font-bold uppercase tracking-wider mb-1">{challenge.day}'s Puzzle</h2>
            <h1 className="text-2xl font-bold text-white mb-2">{challenge.title}</h1>
            <p className="text-zinc-300">{challenge.description}</p>
          </div>

          <VisualBuilder />

          {/* Success Overlay */}
          {success && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 rounded-xl flex flex-col items-center justify-center">
              <Trophy className="w-20 h-20 text-yellow-400 mb-6" />
              <h2 className="text-3xl font-bold text-white mb-8">Target Matched!</h2>
              <button 
                onClick={handleClaim}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all hover:scale-105 text-lg"
              >
                Claim Daily Reward (500 XP)
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Target Chart */}
        <div className="flex-[2] h-full flex flex-col bg-black/40 border border-white/10 rounded-xl p-4 shadow-xl backdrop-blur-sm">
          <h3 className="text-zinc-100 font-bold mb-6">Target State Matcher</h3>
          
          <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.5} />
                <XAxis dataKey="state" stroke="#71717a" />
                <YAxis stroke="#71717a" tickFormatter={(value) => value + '%'} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
                  formatter={(value: any) => [value + '%']}
                />
                <Legend />
                <Bar dataKey="Target" fill="#71717a" opacity={0.5} radius={[4, 4, 0, 0]} />
                <Bar dataKey="YourCircuit" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
