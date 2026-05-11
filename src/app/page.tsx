"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AntigravityBackground from "@/components/sections/AntigravityBackground";
import TerminalWindow from "@/components/sections/TerminalWindow";
import BootScreen from "@/components/Terminal/BootScreen";

export default function Home() {
  const [isBooted, setIsBooted] = useState(false);

  return (
    <>
      <AntigravityBackground />

      <main className="min-h-screen flex items-center justify-center p-4 md:p-8 z-10 relative">
        <AnimatePresence mode="wait">
          {!isBooted ? (
            <motion.div
              key="boot"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="w-full flex justify-center"
            >
              <BootScreen onComplete={() => setIsBooted(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="w-full"
            >
              <TerminalWindow />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
