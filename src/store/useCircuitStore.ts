import { create } from 'zustand';

export interface GateNode {
  id: string;         // Unique ID for dnd-kit
  type: 'H' | 'X' | 'CX' | 'Y' | 'Z'; 
  target: number;     // Qubit index (0 or 1)
  control?: number;   // Control qubit index (only for CX)
}

export interface CircuitStore {
  circuitState: GateNode[];
  numQubits: number;
  addGate: (gate: GateNode) => void;
  clearCircuit: () => void;
  setNumQubits: (num: number) => void;
  loadCircuit: (state: GateNode[], numQubits: number) => void;
}

export const useCircuitStore = create<CircuitStore>((set) => ({
  circuitState: [],
  numQubits: 2,
  addGate: (gate) => set((state) => ({ circuitState: [...state.circuitState, gate] })),
  clearCircuit: () => set({ circuitState: [] }),
  setNumQubits: (num) => set({ numQubits: num, circuitState: [] }), // Clear circuit on qubit change
  loadCircuit: (state, numQubits) => set({ circuitState: state, numQubits }),
}));
