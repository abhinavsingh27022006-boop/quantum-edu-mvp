"use client";

import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from "recharts";
import { Trophy, Flame, CircuitBoard, Star } from "lucide-react";

export default function DashboardPage() {
  const { xp, streak, skills, completedLabs, completedLessons, recentAchievements } = useUserStore();
  
  // Prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return <div className="p-8 text-white">Loading...</div>;

  const skillData = [
    { subject: "Superposition", A: skills.superposition, fullMark: 100 },
    { subject: "Entanglement", A: skills.entanglement, fullMark: 100 },
    { subject: "Phase Logic", A: skills.phaseLogic, fullMark: 100 },
    { subject: "Measurement", A: skills.measurement, fullMark: 100 },
    { subject: "Algorithms", A: skills.algorithms, fullMark: 100 },
  ];

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar bg-[#0B0D17] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
            Commander's Dashboard
          </h1>
          <p className="text-gray-400">Track your progress through the quantum realm.</p>
        </header>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total XP" 
            value={xp.toString()} 
            icon={<Star className="w-8 h-8 text-yellow-400" />} 
            glowColor="rgba(250, 204, 21, 0.2)"
          />
          <StatCard 
            title="Current Streak" 
            value={`${streak} Days`} 
            icon={<Flame className="w-8 h-8 text-orange-500" />} 
            glowColor="rgba(249, 115, 22, 0.2)"
          />
          <StatCard 
            title="Circuits Built" 
            value={completedLabs.length.toString()} 
            icon={<CircuitBoard className="w-8 h-8 text-purple-400" />} 
            glowColor="rgba(168, 85, 247, 0.2)"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Progress Section */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-400" />
              Module Completion
            </h2>
            
            <div className="space-y-6">
              <ProgressBar 
                title="Study Lab" 
                current={completedLessons.length} 
                total={30} 
                color="bg-blue-500" 
              />
              <ProgressBar 
                title="Quantum Lab" 
                current={completedLabs.length} 
                total={10} 
                color="bg-purple-500" 
              />
            </div>
            
            {/* Recent Achievements */}
            <div className="mt-8">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4">
                Recent Achievements
              </h3>
              <div className="space-y-3">
                {recentAchievements.slice(0, 5).map((ach, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></div>
                    <span className="text-sm font-medium">{ach}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Tree */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-4 self-start">Quantum Skill Tree</h2>
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar 
                    name="Skills" 
                    dataKey="A" 
                    stroke="#a855f7" 
                    fill="#a855f7" 
                    fillOpacity={0.4} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, glowColor }: { title: string, value: string, icon: React.ReactNode, glowColor: string }) {
  return (
    <div 
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 hover:scale-105"
      style={{ boxShadow: `0 4px 30px ${glowColor}` }}
    >
      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function ProgressBar({ title, current, total, color }: { title: string, current: number, total: number, color: string }) {
  const percentage = Math.min(100, Math.round((current / total) * 100));
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium">{title}</span>
        <span className="text-gray-400">{current} / {total} ({percentage}%)</span>
      </div>
      <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
