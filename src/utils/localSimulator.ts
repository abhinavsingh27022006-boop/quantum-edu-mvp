import { GateNode } from '../store/useCircuitStore';

export interface SimulationResult {
  state: string;
  prob: number;
  amplitude: number;
  phase: number;
}

export const simulateCircuit = (circuitState: GateNode[], numQubits: number = 2): SimulationResult[] => {
  const size = 1 << numQubits;
  let state = new Float64Array(size);
  state[0] = 1.0;
  
  const SQRT2 = Math.SQRT1_2;

  for (const gate of circuitState) {
    const { type, target, control } = gate;
    const newState = new Float64Array(size);
    const targetBit = numQubits - 1 - target; // Q0 is MSB, so bit index is (numQubits - 1 - target)

    if (type === 'X' || type === 'Y') {
      // Treat Y as X for probabilities in MVP
      for (let i = 0; i < size; i++) {
        const flipped = i ^ (1 << targetBit);
        newState[flipped] = state[i];
      }
    } else if (type === 'Z') {
      for (let i = 0; i < size; i++) {
        if ((i & (1 << targetBit)) !== 0) {
          newState[i] = -state[i];
        } else {
          newState[i] = state[i];
        }
      }
    } else if (type === 'H') {
      for (let i = 0; i < size; i++) {
        if ((i & (1 << targetBit)) === 0) {
          const i0 = i;
          const i1 = i | (1 << targetBit);
          newState[i0] = (state[i0] + state[i1]) * SQRT2;
          newState[i1] = (state[i0] - state[i1]) * SQRT2;
        }
      }
    } else if (type === 'CX') {
      const controlBit = control !== undefined ? numQubits - 1 - control : -1;
      for (let i = 0; i < size; i++) {
        if (controlBit >= 0 && (i & (1 << controlBit)) !== 0) {
          // Control is 1, so flip target
          const flipped = i ^ (1 << targetBit);
          newState[flipped] = state[i];
        } else {
          // Control is 0, do nothing
          newState[i] = state[i];
        }
      }
    }
    state = newState;
  }

  // Calculate probabilities and phases
  const results: SimulationResult[] = [];
  for (let i = 0; i < size; i++) {
    const amplitude = state[i];
    const prob = Math.pow(Math.abs(amplitude), 2);
    
    let phase = 0;
    if (Math.abs(amplitude) > 1e-10) {
      if (amplitude < 0) {
        phase = 180;
      } else {
        phase = 0;
      }
    }

    // Convert state index to binary string, padded to numQubits
    const binStr = i.toString(2).padStart(numQubits, '0');
    results.push({ 
      state: binStr, 
      prob: parseFloat((prob * 100).toFixed(2)),
      amplitude: parseFloat(amplitude.toFixed(3)),
      phase
    });
  }

  return results;
};
