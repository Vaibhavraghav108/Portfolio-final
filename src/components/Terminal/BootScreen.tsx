"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type TextLine = { type: "text"; text: string; color?: string; dim?: boolean; centered?: boolean; speed?: number };
type ProgressLine = { type: "progress" };
type PromptLine  = { type: "prompt" };
type Line = TextLine | ProgressLine | PromptLine;

// ─── Boot sequence ────────────────────────────────────────────────────────────
const SEQUENCE: Line[] = [
  { type: "text", text: "Initializing RAG pipeline...",   speed: 12 },
  { type: "text", text: "Loading neural network weights...", speed: 14 },
  { type: "text", text: "Mounting knowledge base...",      speed: 12 },
  { type: "progress" },
  { type: "text", text: "Connecting to GitHub API [Vaibhavraghav108]...", speed: 10 },
  { type: "text", text: "ok",                                color: "#27C93F", speed: 30 },
  { type: "text", text: "Generative AI modules: operational",        speed: 14 },
  { type: "text", text: "MLOps pipelines: active",        speed: 14 },
  { type: "text", text: "Don't search for /secrets here...", dim: true, speed: 15 },
  { type: "text", text: "Prompt engineering: engaged",        speed: 14 },
  { type: "text", text: "✦",                                 centered: true, speed: 0 },
  { type: "text", text: "Vaibhav.Raghav AI_OS v1.0 — ready.",         color: "#D97757", speed: 18 },
  { type: "prompt" },
];

// ─── Typewriter Line ──────────────────────────────────────────────────────────
function TypewriterLine({
  line,
  isActive,
  onComplete,
}: {
  line: TextLine;
  isActive: boolean;
  onComplete: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const doneRef = useRef(false);
  const speed = line.speed ?? 22;

  useEffect(() => {
    if (!isActive) return;

    if (line.centered || speed === 0) {
      setDisplayed(line.text);
      if (!doneRef.current) {
        doneRef.current = true;
        setTimeout(onComplete, 80);
    }
    return;
  }

  if (displayed.length >= line.text.length) {
    if (!doneRef.current) {
      doneRef.current = true;
      setTimeout(onComplete, 50);
    }
    return;
  }

  const t = setTimeout(() => {
    setDisplayed(line.text.slice(0, displayed.length + 1));
  }, speed);

    return () => clearTimeout(t);
  }, [isActive, displayed, line, speed, onComplete]);

  const isDone = displayed.length >= line.text.length;

  return (
    <span
      style={{
        color: line.color ?? "var(--color-terminal-text)",
        opacity: line.dim ? 0.35 : 1,
        display: line.centered ? "block" : undefined,
        textAlign: line.centered ? "center" : undefined,
        fontSize: line.centered ? "1.1rem" : undefined,
      }}
    >
      {displayed}
      {isActive && !isDone && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-[2px] h-[11px] bg-current align-middle ml-[2px]"
        />
      )}
    </span>
  );
}

// ─── Smooth Progress Bar ──────────────────────────────────────────────────────
function SmoothProgressBar({ isActive, onComplete }: { isActive: boolean; onComplete: () => void }) {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setStarted(true), 80);
    return () => clearTimeout(t);
  }, [isActive]);

  const handleFillComplete = useCallback(() => {
    if (doneRef.current) return;
    setFinished(true);
    doneRef.current = true;
    setTimeout(onComplete, 250);
  }, [onComplete]);

  return (
    <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-terminal-text)]">
      <span className="text-[var(--color-terminal-peach)] select-none">›</span>
      <span className="opacity-50">[</span>

      {/* Bar track */}
      <div className="relative w-44 h-[10px] rounded-sm overflow-hidden bg-white/5">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-sm"
          style={{ background: "linear-gradient(90deg, #1a8c2e, #27C93F)" }}
          initial={{ width: "0%" }}
          animate={{ width: started ? "100%" : "0%" }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          onAnimationComplete={handleFillComplete}
        />
        {/* shimmer sweep */}
        {started && (
          <motion.div
            className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            initial={{ x: -40 }}
            animate={{ x: 220 }}
            transition={{ duration: 1.05, ease: "linear" }}
          />
        )}
      </div>

      <span className="opacity-50">]</span>

      <AnimatePresence>
        {finished && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-[#27C93F] font-semibold"
          >
            done
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Boot Screen ──────────────────────────────────────────────────────────────
export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  // currentStep is the index of the line currently being "typed / animated"
  const [currentStep, setCurrentStep] = useState(0);
  // visibleCount = how many lines have started rendering (≤ currentStep + 1)
  const [visibleCount, setVisibleCount] = useState(1);
  const [exiting, setExiting] = useState(false);
  const exitRef = useRef(false);

  // Small inter-line pause so each line breathes
  const advance = useCallback(() => {
    setTimeout(() => {
      setCurrentStep((s) => {
        const next = s + 1;
        setVisibleCount(next + 1);
        return next;
      });
    }, 45);
  }, []);

  const triggerExit = useCallback(() => {
    if (exitRef.current) return;
    exitRef.current = true;
    setExiting(true);
    setTimeout(onComplete, 600);
  }, [onComplete]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && currentStep >= SEQUENCE.length - 1) triggerExit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [triggerExit, currentStep]);

  return (
    <AnimatePresence mode="wait">
      {!exiting ? (
        <motion.div
          key="boot"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[1000px] h-[800px] max-h-[90vh] flex flex-col mx-auto rounded-lg overflow-hidden border border-[var(--color-terminal-border)] shadow-2xl bg-[var(--color-terminal-bg)] backdrop-blur-md font-mono terminal-glow relative cursor-pointer sm:cursor-default"
          onClick={() => {
            if (currentStep >= SEQUENCE.length - 1) triggerExit();
          }}
        >
          {/* Scanlines */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.06)_50%)] bg-[length:100%_4px] opacity-[0.05] z-30" />

          {/* Title bar */}
          <div className="bg-black/20 p-3 flex items-center justify-between border-b border-[var(--color-terminal-border)] relative z-40 shrink-0">
            <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); window.location.href = 'about:blank'; }} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:opacity-80 transition-opacity cursor-pointer" aria-label="Close" />
            </div>
            <div className="text-xs text-[#606060]">vaibhav@raghav ~ /boot</div>
            <div className="w-12" />
          </div>

          {/* Boot log */}
          <div className="p-6 md:p-8 relative z-20 flex-1 flex flex-col min-h-0">
            <div className="flex flex-col gap-[7px] text-[13px] font-mono">
              {SEQUENCE.slice(0, visibleCount).map((line, i) => {
                const isActive = i === currentStep;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    {line.type === "progress" && (
                      <SmoothProgressBar isActive={isActive} onComplete={advance} />
                    )}

                    {line.type === "prompt" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="mt-6 flex items-center gap-2 text-[var(--color-terminal-peach)] font-semibold"
                      >
                        <span className="hidden sm:inline">Press{" "}</span>
                        <kbd className="px-1.5 py-0.5 rounded border border-[var(--color-terminal-peach)]/50 text-[11px] text-[var(--color-terminal-peach)] bg-[var(--color-terminal-peach)]/10 hidden sm:inline-block">
                          Enter
                        </kbd>{" "}
                        <span className="sm:hidden">Tap anywhere</span>
                        <span className="hidden sm:inline">to continue</span>
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                          className="inline-block w-[8px] h-[14px] bg-[var(--color-terminal-peach)] rounded-sm align-middle"
                        />
                      </motion.div>
                    )}

                    {line.type === "text" && (
                      <div className={`flex items-start gap-2 ${line.centered ? "justify-center" : ""}`}>
                        {!line.centered && (
                          <span
                            className="select-none shrink-0 mt-[1px]"
                            style={{ color: line.color ?? "var(--color-terminal-peach)" }}
                          >
                            ›
                          </span>
                        )}
                        <TypewriterLine
                          line={line}
                          isActive={isActive}
                          onComplete={advance}
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Subtle bottom glow when near end */}
          {currentStep >= SEQUENCE.length - 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--color-terminal-peach)]/5 to-transparent pointer-events-none z-10"
            />
          )}
        </motion.div>
      ) : (
        // Exit placeholder — keeps layout stable while fading out
        <motion.div
          key="boot-exit"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full max-w-[1000px] h-[800px] max-h-[90vh] rounded-lg bg-[var(--color-terminal-bg)] border border-[var(--color-terminal-border)]"
        />
      )}
    </AnimatePresence>
  );
}
