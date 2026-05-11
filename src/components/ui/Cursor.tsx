"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleHoverStart = () => setHovered(true);
    const handleHoverEnd = () => setHovered(false);

    document.addEventListener("mousemove", onMouseMove);

    // Attach to any interactive elements
    const updateHoverListeners = () => {
      const interactables = document.querySelectorAll(
        "a, button, input, textarea, select, .interactable"
      );
      interactables.forEach((el) => {
        el.addEventListener("mouseenter", handleHoverStart);
        el.addEventListener("mouseleave", handleHoverEnd);
      });
      return interactables;
    };

    // A simple observer to attach events to newly added DOM elements
    const observer = new MutationObserver(() => {
      updateHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    let initialInteractables = updateHoverListeners();

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      initialInteractables.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
      });
      observer.disconnect();
    };
  }, []);

  // Use a fixed fallback if window is undefined, but since it's an effect it only runs client side
  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 bg-orange-400 rounded-full pointer-events-none z-[9999] mix-blend-difference"
      animate={{
        x: position.x - 8,
        y: position.y - 8,
      }}
      transition={{
        type: "spring",
        stiffness: 700,
        damping: 28,
        mass: 0.5,
      }}
    />
  );
}
