'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { ArrowRight, Code2, Move, Cpu } from 'lucide-react';

function AnimatedSphere() {
  return (
    <Sphere visible args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial 
        color="#a855f7" 
        attach="material" 
        distort={0.4} 
        speed={1.5} 
        roughness={0.2}
      />
    </Sphere>
  );
}

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden text-white flex flex-col">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <directionalLight position={[-10, -10, -10]} color="#3b82f6" intensity={2} />
          <Suspense fallback={null}>
            <AnimatedSphere />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          </Suspense>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 z-1 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto w-full">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold text-sm tracking-wide">
            v1.0 is now live
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Master Quantum Computing <br className="hidden md:block"/>
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            at Zero Cost.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-3xl leading-relaxed">
          The 100% in-browser, serverless quantum lab. Build circuits visually, generate IBM Qiskit code instantly, and simulate physics without leaving your browser.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/lab/01-superposition"
            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            Enter the Quantum Lab <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/sandbox"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-bold rounded-full border border-white/10 hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            Pro Sandbox
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl transition-all hover:border-purple-500/50 hover:bg-white/[0.02]">
          <Cpu className="w-10 h-10 text-purple-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Serverless Engine</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Full quantum statevector simulation running locally in your browser. No backend required, zero latency, maximum privacy.
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl transition-all hover:border-blue-500/50 hover:bg-white/[0.02]">
          <Move className="w-10 h-10 text-blue-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Visual Drag & Drop</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Stop fighting with syntax. Build complex quantum circuits intuitively by dropping gates directly onto qubit wires.
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl transition-all hover:border-cyan-500/50 hover:bg-white/[0.02]">
          <Code2 className="w-10 h-10 text-cyan-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Export to IBM</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Every visual action instantly generates production-ready Python Qiskit code. Export and run on real IBM quantum hardware.
          </p>
        </div>

      </div>
    </div>
  );
}
