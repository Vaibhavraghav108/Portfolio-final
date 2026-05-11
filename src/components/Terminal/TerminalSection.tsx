import React from "react";
import { AsciiArt } from "./AsciiArt";
import { NAV_COMMANDS } from "@/lib/constants";
import { IDENTITY } from "@/lib/data";

type TerminalSectionProps = {
  onCommandClick?: (cmd: string) => void;
};

export const TerminalSection = ({ onCommandClick }: TerminalSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 border border-dotted border-[var(--color-terminal-border)] rounded-lg mt-6 bg-transparent">
      {/* Left Section: Profile */}
      <div className="border-b md:border-b-0 md:border-r border-dotted border-[var(--color-terminal-border)]">
        <AsciiArt />
      </div>

      {/* Right Section: Specs */}
      <div className="flex flex-col">
        {/* Capabilities */}
        <div className="p-6 border-b border-dotted border-[var(--color-terminal-border)]">
          <h3 className="text-[var(--color-terminal-peach)] mb-4 text-[10px] font-bold uppercase tracking-widest">
            System Capabilities
          </h3>
          <div className="text-xs space-y-3 opacity-90">
            <p className="flex items-center gap-4">
              <span className="text-[var(--color-terminal-purple)] w-20 shrink-0 font-bold text-[10px] uppercase">Engineer</span>
              <span className="text-white/80">{IDENTITY.name}</span>
            </p>
            <p className="flex items-start gap-4">
              <span className="text-[var(--color-terminal-purple)] w-20 shrink-0 font-bold text-[10px] uppercase">Specialty</span>
              <span className="text-white/80 leading-tight">GenAI, RAG, ML Pipelines</span>
            </p>
            <p className="flex items-center gap-4">
              <span className="text-[var(--color-terminal-purple)] w-20 shrink-0 font-bold text-[10px] uppercase">Status</span>
              <span className="text-[var(--color-terminal-green)] animate-pulse">● Online / Open for Work</span>
            </p>
            <p className="flex items-center gap-4">
              <span className="text-[var(--color-terminal-purple)] w-20 shrink-0 font-bold text-[10px] uppercase">Location</span>
              <span className="text-white/80">Bengaluru, India</span>
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6">
          <h3 className="text-[var(--color-terminal-peach)] mb-4 text-[10px] font-bold uppercase tracking-widest">
            Command Directory
          </h3>
          <div className="text-xs grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 font-mono">
            {NAV_COMMANDS.map((nav) => (
              <p key={nav.cmd} className="flex items-center gap-2 group">
                <span
                  onClick={() => onCommandClick?.(nav.cmd)}
                  className="text-[var(--color-terminal-peach)] hover:text-white cursor-pointer transition-colors font-bold"
                >
                  {nav.cmd}
                </span>
                <span className="text-[#606060] text-[9px] opacity-0 group-hover:opacity-100 transition-opacity">
                  {nav.label}
                </span>
              </p>
            ))}
            <p className="flex items-center gap-2 group">
              <span
                onClick={() => onCommandClick?.("git log")}
                className="text-[var(--color-terminal-peach)] hover:text-white cursor-pointer transition-colors font-bold"
              >
                git log
              </span>
              <span className="text-[#606060] text-[9px] opacity-0 group-hover:opacity-100 transition-opacity">
                Activity
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
