import React from "react";

export const WindowFrame = ({ children }: { children: React.ReactNode }) => (
  <div id="terminal-window" className="w-full max-w-[850px] h-[650px] max-h-[85vh] flex flex-col mx-auto mt-0 rounded-lg overflow-hidden border border-[var(--color-terminal-border)] shadow-2xl bg-[var(--color-terminal-bg)] backdrop-blur-md font-mono terminal-glow relative">
    {/* Subtle scanline overlay */}
    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px] opacity-[0.04] z-30" />

    <div className="bg-black/20 p-3 flex items-center justify-between border-b border-[var(--color-terminal-border)] relative z-40 shrink-0">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
      </div>
      <div className="text-xs text-[#606060]">vaibhav@raghav ~ /portfolio</div>
      <div className="w-12"></div> {/* Spacer */}
    </div>

    <div className="p-6 md:p-8 relative z-20 flex-1 flex flex-col min-h-0">
      {children}
    </div>
  </div>
);
