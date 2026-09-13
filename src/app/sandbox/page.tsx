'use client';

import { VisualBuilder } from "@/components/VisualBuilder";
import { CodeEditor } from "@/components/CodeEditor";
import { Simulator } from "@/components/Simulator";
import { useEffect, Suspense } from "react";
import { useCircuitStore } from "@/store/useCircuitStore";
import { useSearchParams } from "next/navigation";
import { TourGuide } from "@/components/TourGuide";

function SandboxContent() {
  const searchParams = useSearchParams();
  const { loadCircuit } = useCircuitStore();

  useEffect(() => {
    const circuitParam = searchParams.get('circuit');
    if (circuitParam) {
      try {
        const decoded = JSON.parse(atob(circuitParam));
        if (decoded.circuitState && decoded.numQubits) {
          loadCircuit(decoded.circuitState, decoded.numQubits);
        }
      } catch (e) {
        console.error("Failed to parse shared circuit", e);
      }
    }
  }, [searchParams, loadCircuit]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col bg-[#0B0D17] relative">
      <TourGuide />
      
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col xl:flex-row gap-6 p-6 relative z-10 w-full">
        
        {/* Left Side: Visual Builder */}
        <div className="flex-[3] w-full min-h-[24rem]">
          <VisualBuilder />
        </div>

        {/* Right Side: Code & Simulation */}
        <div className="flex-[2] w-full flex flex-col gap-6">
          <div className="min-h-[24rem] w-full">
            <CodeEditor />
          </div>
          <div className="min-h-[24rem] w-full">
            <Simulator />
          </div>
        </div>

      </div>

    </div>
  );
}

export default function SandboxPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading Sandbox...</div>}>
      <SandboxContent />
    </Suspense>
  );
}
