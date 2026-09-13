"use client";

import { useUserStore } from "@/store/useUserStore";
import confetti from "canvas-confetti";
import { CheckCircle, Trophy } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  slug: string;
  type: "lesson" | "lab";
}

export function MarkCompleteButton({ slug, type }: Props) {
  const {
    completedLessons,
    completedLabs,
    completeLesson,
    completeLab,
    incrementSkill,
    addAchievement,
  } = useUserStore();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const isCompleted =
    type === "lesson"
      ? completedLessons.includes(slug)
      : completedLabs.includes(slug);

  const handleComplete = () => {
    if (isCompleted) return;

    // Trigger confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#a855f7", "#3b82f6", "#10b981"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#a855f7", "#3b82f6", "#10b981"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    if (type === "lesson") {
      completeLesson(slug);
      // Heuristic for skill depending on slug (simplified for now)
      if (slug.includes("superposition") || slug.includes("hadamard")) {
        incrementSkill("superposition", 10);
      } else if (slug.includes("entanglement")) {
        incrementSkill("entanglement", 10);
      } else if (slug.includes("phase") || slug.includes("z-gate")) {
        incrementSkill("phaseLogic", 10);
      } else if (slug.includes("grover") || slug.includes("teleportation")) {
        incrementSkill("algorithms", 10);
      } else {
        incrementSkill("measurement", 5);
      }
      addAchievement(`Completed Lesson: ${slug.replace(/-/g, " ")}`);
    } else {
      completeLab(slug);
      incrementSkill("algorithms", 15);
      addAchievement(`Completed Lab: ${slug.replace(/-/g, " ")}`);
    }
  };

  return (
    <div className="mt-12 flex justify-center pb-8">
      <button
        onClick={handleComplete}
        disabled={isCompleted}
        className={`flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
          isCompleted
            ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-default"
            : "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] hover:scale-105"
        }`}
      >
        {isCompleted ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Completed!
          </>
        ) : (
          <>
            <Trophy className="w-5 h-5" />
            Mark as Complete & Earn XP
          </>
        )}
      </button>
    </div>
  );
}
