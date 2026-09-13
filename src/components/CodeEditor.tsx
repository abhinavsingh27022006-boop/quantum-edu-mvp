'use client';

import React from 'react';
import Editor from '@monaco-editor/react';
import { useCircuitStore } from '@/store/useCircuitStore';
import { generateQiskitCode } from '@/utils/generateQiskitCode';

export function CodeEditor() {
  const { circuitState, numQubits } = useCircuitStore();
  
  // Dynamically generate code based on visual state
  const code = generateQiskitCode(circuitState, numQubits);

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quantum_circuit.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="tour-monaco-editor" className="flex flex-col w-full h-full bg-black/40 rounded-xl overflow-hidden border border-white/10 shadow-xl backdrop-blur-sm">
      <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-zinc-300 font-mono text-sm font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> main.py
        </h3>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const encoded = btoa(JSON.stringify({ circuitState, numQubits }));
              const url = `${window.location.origin}/sandbox?circuit=${encoded}`;
              navigator.clipboard.writeText(url);
              alert("Circuit URL copied to clipboard!"); // Simple toast for MVP
            }}
            className="flex items-center gap-2 text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-md transition-colors shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:shadow-[0_0_15px_rgba(168,85,247,0.6)]"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
            Share Circuit
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md transition-colors shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download .py
          </button>
          <span className="text-xs text-zinc-400 bg-white/5 px-2 py-1.5 rounded border border-white/10">Read Only</span>
        </div>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}
