import React from "react";

export const WindowFrame = ({ children, onYellowClick, onGreenClick }: { children: React.ReactNode, onYellowClick?: () => void, onGreenClick?: () => void }) => (
  <div id="terminal-window" className="w-full max-w-[1000px] h-[800px] max-h-[90vh] flex flex-col mx-auto mt-0 rounded-lg overflow-hidden border border-[var(--color-terminal-border)] shadow-2xl bg-[var(--color-terminal-bg)] backdrop-blur-md font-mono terminal-glow relative transition-colors duration-500">
    {/* Subtle scanline overlay */}
    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px] opacity-[0.04] z-30" />

    <div className="bg-black/20 p-3 flex items-center justify-between border-b border-[var(--color-terminal-border)] relative z-40 shrink-0 transition-colors duration-500">
      <div className="flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); window.close(); }} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:opacity-80 transition-opacity cursor-pointer" aria-label="Close" />
        <button onClick={(e) => { e.stopPropagation(); onYellowClick?.(); }} className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:opacity-80 transition-opacity cursor-pointer" aria-label="Theme Toggle" />
        <button onClick={(e) => { e.stopPropagation(); onGreenClick?.(); }} className="w-3 h-3 rounded-full bg-[#27c93f] hover:opacity-80 transition-opacity cursor-pointer" aria-label="Audio Toggle" />
      </div>
      <div className="text-xs text-[#606060]">vaibhav@raghav ~ /portfolio</div>
      <div className="w-12"></div> {/* Spacer */}
    </div>

    <div className="p-6 md:p-8 relative z-20 flex-1 flex flex-col min-h-0">
      {children}
    </div>
  </div>
);
