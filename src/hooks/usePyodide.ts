import { useState, useEffect } from 'react';

// Extend window object for Pyodide
declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<any>;
  }
}

export function usePyodide() {
  const [pyodide, setPyodide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const initPyodide = async () => {
      try {
        // Only load if not already loaded
        if (!window.loadPyodide) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
          document.body.appendChild(script);
          
          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }
        
        if (!isMounted) return;

        const pyodideInstance = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
        });
        
        // Install micropip and qiskit
        await pyodideInstance.loadPackage('micropip');
        const micropip = pyodideInstance.pyimport('micropip');
        await micropip.install('qiskit==0.45.1');
        
        if (isMounted) {
          setPyodide(pyodideInstance);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading Pyodide or Qiskit:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (!pyodide) {
      initPyodide();
    }

    return () => {
      isMounted = false;
    };
  }, [pyodide]);

  return { pyodide, isLoading };
}
