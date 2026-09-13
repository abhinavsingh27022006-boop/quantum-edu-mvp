'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export function TourGuide() {
  const { hasSeenTour, setHasSeenTour } = useUserStore();

  useEffect(() => {
    // Small delay to ensure the DOM is fully painted
    const timeout = setTimeout(() => {
      if (!hasSeenTour) {
        const tour = driver({
          showProgress: true,
          animate: true,
          allowClose: false,
          doneBtnText: 'Start Building',
          nextBtnText: 'Next',
          prevBtnText: 'Previous',
          onDestroyStarted: () => {
            tour.destroy();
            setHasSeenTour();
          },
          steps: [
            {
              element: '#tour-gate-sidebar',
              popover: {
                title: 'Quantum Gates',
                description: 'Welcome to the Lab! Drag these quantum gates from the sidebar.',
                side: 'right',
                align: 'start'
              }
            },
            {
              element: '#tour-qubit-wires',
              popover: {
                title: 'Circuit Canvas',
                description: '...and drop them onto the qubit wires here to build your circuit.',
                side: 'bottom',
                align: 'center'
              }
            },
            {
              element: '#tour-monaco-editor',
              popover: {
                title: 'Live Qiskit Code',
                description: 'Watch real IBM Qiskit Python code generate instantly as you build.',
                side: 'left',
                align: 'center'
              }
            },
            {
              element: '#tour-run-button',
              popover: {
                title: 'Simulate Physics',
                description: 'Click here to simulate the physics in your browser and see the statevector results!',
                side: 'bottom',
                align: 'end'
              }
            }
          ]
        });

        tour.drive();
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeout);
  }, [hasSeenTour, setHasSeenTour]);

  return null;
}
