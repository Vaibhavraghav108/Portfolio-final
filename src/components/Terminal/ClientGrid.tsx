"use client";

import React from "react";
import { CLIENTS } from "@/lib/constants";

export default function ClientGrid() {
  return (
    <div className="my-2 w-full text-sm font-mono text-[var(--color-terminal-text)]">
      <h2 className="text-sm font-bold text-[var(--color-terminal-peach)] uppercase tracking-widest mb-3">
        Selected Clients
      </h2>

      <div className="border border-dotted border-[var(--color-terminal-border)] rounded-lg p-5 bg-[var(--color-terminal-surface)]/5">
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-y-2.5 gap-x-4 text-xs opacity-90">
          {CLIENTS.map((client, idx) => (
            <li key={idx} className="flex items-center">
              <span className="text-[var(--color-terminal-green)] mr-2 opacity-40 select-none">
                &gt;
              </span>
              <span className="hover:text-[var(--color-terminal-peach)] hover:translate-x-1 transition-all duration-300 cursor-default">
                {client}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-[10px] opacity-40 mt-3 text-right italic">
        Across Europe, US, Israel, and UAE.
      </p>
    </div>
  );
}
