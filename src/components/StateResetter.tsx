'use client';

import { useEffect } from 'react';
import { useCircuitStore } from '@/store/useCircuitStore';

export function StateResetter({ slug }: { slug: string }) {
  const { clearCircuit } = useCircuitStore();

  useEffect(() => {
    clearCircuit();
  }, [slug, clearCircuit]);

  return null;
}
