'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

function StateVector({ targetQuaternion }: { targetQuaternion: THREE.Quaternion }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smoothly interpolate current quaternion to target quaternion
      groupRef.current.quaternion.slerp(targetQuaternion, delta * 5);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Arrow shaft */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 16]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} />
      </mesh>
      {/* Arrow head */}
      <mesh position={[0, 1, 0]}>
        <coneGeometry args={[0.08, 0.2, 16]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export function BlochSphere() {
  // We use a quaternion to represent the state's rotation.
  // Initially, the arrow points straight up (+Y), representing |0>.
  const [currentQuat, setCurrentQuat] = useState(() => new THREE.Quaternion());

  const applyGate = (axis: THREE.Vector3, angle: number) => {
    const rotation = new THREE.Quaternion().setFromAxisAngle(axis.normalize(), angle);
    const nextQuat = currentQuat.clone().premultiply(rotation);
    setCurrentQuat(nextQuat);
  };

  const handleX = () => applyGate(new THREE.Vector3(1, 0, 0), Math.PI);
  // Y gate rotates around Py (which is Tz in our mapping)
  const handleY = () => applyGate(new THREE.Vector3(0, 0, 1), Math.PI);
  // Z gate rotates around Pz (which is Ty in our mapping)
  const handleZ = () => applyGate(new THREE.Vector3(0, 1, 0), Math.PI);
  // H gate rotates around Px+Pz (which is Tx+Ty)
  const handleH = () => applyGate(new THREE.Vector3(1, 1, 0), Math.PI);
  
  const reset = () => setCurrentQuat(new THREE.Quaternion());

  return (
    <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-6 my-8 max-w-lg mx-auto shadow-xl flex flex-col items-center">
      <div className="flex justify-between items-center w-full mb-4">
        <h3 className="text-zinc-100 font-bold">Interactive Bloch Sphere</h3>
        <button 
          onClick={reset}
          className="text-xs px-3 py-1 bg-zinc-800 hover:bg-red-900/50 text-zinc-400 hover:text-red-400 rounded transition-colors"
        >
          Reset to |0⟩
        </button>
      </div>

      <div className="h-80 w-full mb-6 rounded-lg overflow-hidden bg-black/50 border border-zinc-800 relative">
        <Canvas camera={{ position: [2, 1.5, 2.5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          <OrbitControls enablePan={false} minDistance={1.5} maxDistance={4} />

          {/* The Sphere */}
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#27272a" transparent opacity={0.15} wireframe={true} />
          </mesh>

          {/* Axes Lines */}
          <group>
            {/* Z-axis (Physics Z is mapped to Y) */}
            <mesh rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 2.2, 8]} />
              <meshBasicMaterial color="#71717a" />
            </mesh>
            {/* X-axis (Physics X is mapped to X) */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.005, 0.005, 2.2, 8]} />
              <meshBasicMaterial color="#71717a" />
            </mesh>
            {/* Y-axis (Physics Y is mapped to Z) */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 2.2, 8]} />
              <meshBasicMaterial color="#71717a" />
            </mesh>
          </group>

          {/* Labels */}
          <Text position={[0, 1.2, 0]} fontSize={0.15} color="white">|0⟩ (+Z)</Text>
          <Text position={[0, -1.2, 0]} fontSize={0.15} color="white">|1⟩ (-Z)</Text>
          <Text position={[1.2, 0, 0]} fontSize={0.15} color="white">|+⟩ (+X)</Text>
          <Text position={[-1.2, 0, 0]} fontSize={0.15} color="white">|-⟩ (-X)</Text>
          <Text position={[0, 0, 1.2]} fontSize={0.15} color="white">|+i⟩ (+Y)</Text>
          <Text position={[0, 0, -1.2]} fontSize={0.15} color="white">|-i⟩ (-Y)</Text>

          {/* State Vector */}
          <StateVector targetQuaternion={currentQuat} />
        </Canvas>
      </div>

      <div className="flex gap-2 w-full">
        <button onClick={handleH} className="flex-1 py-3 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 text-purple-200 rounded-lg font-bold transition-colors">Apply H</button>
        <button onClick={handleX} className="flex-1 py-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 text-blue-200 rounded-lg font-bold transition-colors">Apply X</button>
        <button onClick={handleY} className="flex-1 py-3 bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-500/50 text-yellow-200 rounded-lg font-bold transition-colors">Apply Y</button>
        <button onClick={handleZ} className="flex-1 py-3 bg-pink-600/20 hover:bg-pink-600/40 border border-pink-500/50 text-pink-200 rounded-lg font-bold transition-colors">Apply Z</button>
      </div>
    </div>
  );
}
