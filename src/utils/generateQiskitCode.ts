import { GateNode } from '../store/useCircuitStore';

export const generateQiskitCode = (circuitState: GateNode[], numQubits: number = 2): string => {
  let code = `from qiskit import QuantumCircuit\n\n`;
  code += `# Initialize a ${numQubits}-qubit quantum circuit\n`;
  code += `qc = QuantumCircuit(${numQubits}, ${numQubits})\n\n`;

  if (circuitState.length > 0) {
    code += `# Apply gates\n`;
    circuitState.forEach((gate) => {
      if (gate.type === 'H') code += `qc.h(${gate.target})\n`;
      if (gate.type === 'X') code += `qc.x(${gate.target})\n`;
      if (gate.type === 'Y') code += `qc.y(${gate.target})\n`;
      if (gate.type === 'Z') code += `qc.z(${gate.target})\n`;
      if (gate.type === 'CX') code += `qc.cx(${gate.control}, ${gate.target})\n`;
    });
    code += `\n`;
  }

  code += `# Measure the qubits\n`;
  const indices = Array.from({ length: numQubits }, (_, i) => i).join(', ');
  code += `qc.measure([${indices}], [${indices}])\n`;

  return code;
};
