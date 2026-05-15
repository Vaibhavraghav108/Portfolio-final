"use client";

import { motion } from "framer-motion";
import { SKILLS } from "@/lib/data";

const colorMap: Record<string, string> = {
  peach: "bg-[var(--color-terminal-peach)]",
  green: "bg-[var(--color-terminal-green)]",
  blue: "bg-[var(--color-terminal-blue)]",
  purple: "bg-[var(--color-terminal-purple)]",
};

export default function SkillBars() {
  // Flatten skills for a clean single list like the original
  const allSkills = Object.entries(SKILLS).flatMap(([category, skills]) => 
    skills.map(skill => ({
      ...skill,
      category
    }))
  ).slice(0, 10); // Show top 10 for a clean look

  return (
    <div className="my-2">
      <h2 className="text-base font-bold text-[var(--color-terminal-peach)] mb-6">
        Expertise & Capabilities
      </h2>
      <div className="space-y-2.5 text-xs font-mono">
        {allSkills.map((skill, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-44 shrink-0 text-[var(--color-terminal-text)] opacity-80">
              {skill.name}
            </span>
            <div className="flex-grow h-[3px] bg-[var(--color-terminal-border)]/50 relative overflow-hidden rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.pct}%` }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.08,
                  ease: "easeOut",
                }}
                className={`absolute top-0 left-0 h-full rounded-full ${
                  i < 3 ? colorMap.peach : i < 6 ? colorMap.green : colorMap.blue
                }`}
              />
            </div>
            <span className="w-9 text-right shrink-0 opacity-50 text-[10px]">
              {skill.pct}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-base font-bold text-[var(--color-terminal-peach)] mb-4">
          Tools
        </h3>
        <p className="text-sm leading-relaxed opacity-90 font-mono">
          Python • LangChain • OpenAI • Ollama • FAISS
          <br />
          TensorFlow • PyTorch • Scikit-learn • MLOps
          <br />
          FastAPI • Flask • Docker • Git • VS Code
        </p>
      </div>
    </div>
  );
}
