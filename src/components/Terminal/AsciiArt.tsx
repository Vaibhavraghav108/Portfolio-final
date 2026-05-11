import React from "react";
import { FACE_ASCII } from "@/lib/constants";

export const AsciiArt = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-transparent">
      <h2 className="mb-4 text-sm font-semibold text-white tracking-wide">Welcome, visitor.</h2>
      <div className="w-full h-56 sm:h-72 mx-auto opacity-80 hover:opacity-100 transition-opacity duration-500 flex justify-center items-center mt-2 mb-4">
        <svg viewBox="0 0 1050 2550" className="h-full w-auto transform scale-x-[1.8] scale-y-[1.1] text-[var(--color-terminal-peach)] select-none drop-shadow-sm" preserveAspectRatio="xMidYMid meet">
          <text x="0" y="0" fontSize="10" fill="currentColor" fontFamily="monospace" textAnchor="start">
            {FACE_ASCII.split('\n').map((line, i) => (
              <tspan x="0" dy={i === 0 ? "10" : "10"} key={i} xmlSpace="preserve">{line}</tspan>
            ))}
          </text>
        </svg>
      </div>
    </div>
  );
};
