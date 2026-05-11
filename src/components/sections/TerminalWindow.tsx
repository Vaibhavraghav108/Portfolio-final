"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Mail, Phone, ExternalLink, Globe, MapPin, Code, Briefcase, GitBranch } from "lucide-react";
import { WindowFrame } from "@/components/Terminal/WindowFrame";
import { AsciiHeader } from "@/components/Terminal/AsciiHeader";
import { TerminalSection } from "@/components/Terminal/TerminalSection";
import CommandInput from "@/components/Terminal/CommandInput";
import SkillBars from "@/components/Terminal/SkillBars";
import ProjectCards from "@/components/Terminal/ProjectCards";
import ClientGrid from "@/components/Terminal/ClientGrid";
import { COMMAND_DATABASE, FLAT_COMMANDS } from "@/lib/constants";
import {
  IDENTITY,
  ABOUT,
  EDUCATION,
  EXPERIENCE,
  CONTACT,
  CERTIFICATIONS
} from "@/lib/data";
import { fetchGithubRepos, fetchGithubCommits, GithubRepo, GithubCommit } from "@/lib/github";
import { MatrixRain } from "@/components/Terminal/MatrixRain";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a"
];

// --- ASYNC COMMAND RENDERERS ---

const scrollToBottom = () => {
  const el = document.getElementById("terminal-scroll-container");
  if (el) el.scrollTop = el.scrollHeight;
};

const HireCommand = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    scrollToBottom();
  }, [step]);

  useEffect(() => {
    const s1 = setTimeout(() => setStep(1), 800);
    const s2 = setTimeout(() => setStep(2), 1600);
    const s3 = setTimeout(() => {
      setStep(3);
      import('canvas-confetti').then(confetti => {
        confetti.default({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#D97757', '#9D8DF1', '#9ece6a']
        });
      });
    }, 2800);
    return () => { clearTimeout(s1); clearTimeout(s2); clearTimeout(s3); };
  }, []);

  return (
    <div className="py-2 text-xs font-mono space-y-1 text-[var(--color-terminal-text)]">
      <p>Searching for talent... {step >= 1 ? <span className="text-[var(--color-terminal-green)]">[OK]</span> : ''}</p>
      {step >= 1 && <p>Analyzing neural patterns... {step >= 2 ? <span className="text-[var(--color-terminal-green)]">[OK]</span> : ''}</p>}
      {step >= 2 && (
        <p>
          Syncing with AI core...
          <span className="text-[var(--color-terminal-peach)] ml-2">
            {step >= 3 ? '[██████████] 100%' : '[████████░░] 80%'}
          </span>
        </p>
      )}
      {step >= 3 && <p className="text-[var(--color-terminal-green)] font-bold mt-2">Welcome to the future of AI engineering.</p>}
    </div>
  );
};

const PingCommand = () => {
  const [lines, setLines] = useState<number>(0);

  useEffect(() => {
    scrollToBottom();
  }, [lines]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLines(l => {
        if (l >= 4) {
          clearInterval(interval);
          return l;
        }
        return l + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-2 text-xs font-mono text-[var(--color-terminal-text)] opacity-80">
      {Array.from({ length: lines + 1 }).map((_, i) => (
        <p key={i}>64 bytes from {IDENTITY.name}: icmp_seq={i + 1} ttl=64 time={(0.2 + Math.random() * 0.5).toFixed(1)}ms — RAG Pipeline Active.</p>
      ))}
    </div>
  );
};

const GitLogCommand = ({ commits }: { commits: GithubCommit[] }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (commits.length === 0) setIsTimedOut(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [commits]);

  useEffect(() => {
    if (commits.length === 0) return;
    const interval = setInterval(() => {
      setVisibleCount(prev => (prev < commits.length ? prev + 1 : prev));
    }, 300);
    return () => clearInterval(interval);
  }, [commits]);

  useEffect(() => {
    scrollToBottom();
  }, [visibleCount, isTimedOut]);

  if (commits.length === 0 && !isTimedOut) {
    return <p className="py-2 text-xs opacity-50 animate-pulse italic">Fetching latest activity from GitHub...</p>;
  }

  if (commits.length === 0 && isTimedOut) {
    return (
      <div className="py-4 space-y-4 font-mono text-xs opacity-70">
        <p className="text-[var(--color-terminal-red)] italic">GitHub API sync delayed or no recent push events found.</p>
        <p className="opacity-50">Displaying local system logs:</p>
        <div className="border-l-2 border-[var(--color-terminal-peach)]/30 pl-4 py-1">
          <p className="text-[var(--color-terminal-peach)] font-bold mb-1">commit a1b2c3d</p>
          <p>Initial OS Deployment — AI_OS v1.0 operational.</p>
        </div>
        <div className="border-l-2 border-[var(--color-terminal-peach)]/30 pl-4 py-1">
          <p className="text-[var(--color-terminal-peach)] font-bold mb-1">commit f4e5d6c</p>
          <p>RAG Pipeline integration complete.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-6 font-mono">
      {commits.slice(0, visibleCount).map((c, i) => (
        <div key={i} className="text-xs border-l-2 border-[var(--color-terminal-peach)]/30 pl-4 py-1">
          <p className="text-[var(--color-terminal-peach)] font-bold mb-1">commit {c.sha}</p>
          <p className="opacity-70">Author: {IDENTITY.name} &lt;{CONTACT.email}&gt;</p>
          <p className="opacity-70">Date: {new Date(c.date).toLocaleString()}</p>
          <p className="mt-2 text-[var(--color-terminal-green)]">Message: {c.message}</p>
          <p className="opacity-40 text-[10px] mt-1">Repo: {c.repo}</p>
        </div>
      ))}
    </div>
  );
};

const WorkCommand = ({ repos }: { repos: GithubRepo[] }) => {
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (repos.length === 0) setIsTimedOut(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [repos]);

  if (repos.length === 0 && !isTimedOut) {
    return <p className="py-2 text-xs opacity-50 animate-pulse italic">Fetching latest projects from GitHub...</p>;
  }

  if (repos.length === 0 && isTimedOut) {
    return (
      <div className="py-4">
        <p className="text-xs text-[var(--color-terminal-red)] italic mb-4">GitHub connection timeout. Showing featured systems only.</p>
        <ProjectCards repos={[]} />
      </div>
    );
  }

  return <div className="py-4"><ProjectCards repos={repos} /></div>;
};

// --- MAIN TERMINAL WINDOW ---

type HistoryBlock = {
  id: string;
  command: string;
  view: string;
};

export default function TerminalWindow() {
  const [history, setHistory] = useState<HistoryBlock[]>([
    { id: 'init', command: '', view: 'home' }
  ]);
  const [activeTheme, setActiveTheme] = useState<string>("dark");
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [commits, setCommits] = useState<GithubCommit[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [shakeClass, setShakeClass] = useState("");
  const [isDestructing, setIsDestructing] = useState(false);
  const [destructCount, setDestructCount] = useState(5);

  useEffect(() => {
    const loadData = async () => {
      const fetchedRepos = await fetchGithubRepos();
      setRepos(fetchedRepos);
      const fetchedCommits = await fetchGithubCommits();
      setCommits(fetchedCommits);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      if (history.length > 1) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      } else {
        scrollRef.current.scrollTop = 0;
      }
    }
  }, [history]);

  useEffect(() => {
    let konamiIndex = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KONAMI_CODE[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === KONAMI_CODE.length) {
          setIsMatrixMode(true);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Destruct Sequence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isDestructing && destructCount > 0) {
      timer = setTimeout(() => setDestructCount(d => d - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [isDestructing, destructCount]);

  const triggerErrorShake = () => {
    if (activeTheme === 'retro') {
      setShakeClass("shake");
      setTimeout(() => setShakeClass(""), 500);
    }
  };

  const handleCommand = useCallback((cmd: string) => {
    const rawInput = cmd.trim();
    if (!rawInput) return;

    let baseCommand = rawInput.toLowerCase();

    // Special exact-match for spaced commands
    if (baseCommand === "sudo hire vaibhav" || baseCommand === "ping vaibhav" || baseCommand === "git log") {
      // Proceed as exact match
    } else {
      // Split for arguments on regular commands
      const parts = rawInput.split(" ");
      baseCommand = parts[0].toLowerCase();
    }

    const args = rawInput.substring(baseCommand.length).trim();

    let commandDef = FLAT_COMMANDS.find(c => c.allTriggers.includes(baseCommand));

    if (!commandDef && !baseCommand.startsWith("/")) {
      const withSlash = `/${baseCommand}`;
      commandDef = FLAT_COMMANDS.find(c => c.allTriggers.includes(withSlash));
      if (commandDef) baseCommand = withSlash;
    }

    // Check spaced commands fallback
    if (!commandDef) {
      const fullLower = rawInput.toLowerCase();
      commandDef = FLAT_COMMANDS.find(c => c.allTriggers.includes(fullLower));
      if (commandDef) baseCommand = fullLower;
    }

    if (commandDef || baseCommand === "git log") {
      const canonicalCmd = commandDef?.cmd || baseCommand;

      if (commandDef && "action" in commandDef && (commandDef as any).action === "url" && "payload" in commandDef) {
        const payload = (commandDef as any).payload;
        if (typeof payload === "string" && (payload.startsWith("mailto:") || payload.startsWith("tel:"))) {
          window.location.href = payload;
        } else {
          window.open(payload as string, "_blank");
        }
        return;
      }

      if (canonicalCmd === "/clear" || canonicalCmd === "/home" || baseCommand === "clear") {
        setHistory([{ id: Date.now().toString(), command: '', view: 'home' }]);
        return;
      }

      if (COMMAND_DATABASE.Themes?.some(t => t.cmd === canonicalCmd) && canonicalCmd !== "/themes") {
        const themeName = canonicalCmd.replace("/", "");
        document.body.className = `theme-${themeName}`;
        setActiveTheme(themeName);
        setHistory(prev => [...prev, { id: Date.now().toString(), command: cmd, view: 'theme_success_' + themeName }]);
        return;
      }

      // Handle Secret Commands
      if (canonicalCmd === "/name") {
        if (args) {
          localStorage.setItem("terminal_username", args);
          window.dispatchEvent(new Event("storage")); // Trigger CommandInput update
          setHistory(prev => [...prev, { id: Date.now().toString(), command: cmd, view: `name_success_${args}` }]);
        } else {
          triggerErrorShake();
          setHistory(prev => [...prev, { id: Date.now().toString(), command: cmd, view: "name_error" }]);
        }
        return;
      }

      if (canonicalCmd === "/matrix") {
        setIsMatrixMode(prev => !prev);
        setHistory(prev => [...prev, { id: Date.now().toString(), command: cmd, view: "matrix" }]);
        return;
      }

      if (canonicalCmd === "/destruct") {
        setIsDestructing(true);
        setDestructCount(5);
        setHistory(prev => [...prev, { id: Date.now().toString(), command: cmd, view: "destruct" }]);
        return;
      }

      setHistory(prev => [...prev, { id: Date.now().toString(), command: cmd, view: canonicalCmd.replace("/", "") }]);
    } else {
      triggerErrorShake();
      setHistory(prev => [...prev, { id: Date.now().toString(), command: cmd, view: "error_" + baseCommand }]);
    }
  }, [activeTheme]);

  const renderContent = (view: string) => {
    if (view.startsWith("error_")) {
      const errorCmd = view.split("error_")[1];
      return (
        <div className="py-2">
          <span className="text-[var(--color-terminal-red)]">
            sh: command not found: {errorCmd}. Type <span className="text-[var(--color-terminal-peach)] cursor-pointer" onClick={() => handleCommand("/help")}>/help</span> for assistance.
          </span>
        </div>
      );
    }

    if (view.startsWith("theme_success_")) {
      const themeName = view.split("theme_success_")[1];
      return <div className="py-2 text-[var(--color-terminal-green)] italic">Theme successfully changed to {themeName}.</div>;
    }

    if (view.startsWith("name_success_")) {
      const name = view.split("name_success_")[1];
      return <div className="py-2 text-[var(--color-terminal-green)] italic">Identity updated to {name}. Welcome back.</div>;
    }
    if (view === "name_error") return <div className="py-2 text-[var(--color-terminal-red)]">Error: Please provide a name (e.g. /name John).</div>;

    if (view === "matrix") {
      return <div className="py-2 text-xs text-[var(--color-terminal-green)] italic">Matrix protocol toggled.</div>;
    }

    if (view === "destruct") {
      return (
        <div className="py-2 text-[var(--color-terminal-red)] font-bold">
          <p className="animate-pulse">WARNING: SELF-DESTRUCT SEQUENCE INITIATED.</p>
          {destructCount > 0 ? (
            <p className="mt-2 text-white">Detonation in T-minus {destructCount} seconds...</p>
          ) : (
            <p className="mt-2 text-white">Goodbye.</p>
          )}
        </div>
      );
    }

    if (view === "ls") {
      return (
        <div className="py-2 text-xs font-mono text-[var(--color-terminal-blue)] flex space-x-6">
          <p>rag_pipeline.py</p>
          <p>ml_models.sh</p>
          <p>neural_config.json</p>
          <p>github_sync.ts</p>
        </div>
      );
    }

    if (view === "sudo hire vaibhav") {
      return <HireCommand />;
    }

    if (view === "ping vaibhav") {
      return <PingCommand />;
    }

    if (view === "git log" || view === "git-log") {
      return <GitLogCommand commits={commits} />;
    }

    if (view === "neofetch") {
      const resolution = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'Unknown';
      return (
        <div className="py-4 text-xs flex items-center space-x-8">
          <pre className="text-[var(--color-terminal-peach)] font-bold text-[10px] leading-tight">
            {`\\\\    / / ___ 
 \\\\  / / | _ )
  \\\\/ /  | _ \\\\
   \\\\/   |___/`}
          </pre>
          <div className="space-y-1">
            <p><span className="text-[var(--color-terminal-purple)] font-bold mr-2">OS:</span>Vaibhav.Raghav AI_OS v1.0</p>
            <p><span className="text-[var(--color-terminal-purple)] font-bold mr-2">Host:</span>GitHub API</p>
            <p><span className="text-[var(--color-terminal-purple)] font-bold mr-2">Resolution:</span>{resolution}</p>
            <p><span className="text-[var(--color-terminal-purple)] font-bold mr-2">Status:</span><span className="text-[var(--color-terminal-green)]">Optimizing Neural Nets</span></p>
          </div>
        </div>
      );
    }

    switch (view) {
      case "skills": return <div className="py-4"><SkillBars /></div>;
      case "work":
      case "projects":
        return <WorkCommand repos={repos} />;
      case "about":
        return (
          <div className="text-xs space-y-4 opacity-90 py-4 font-mono max-w-xl leading-relaxed">
            <h2 className="text-[var(--color-terminal-peach)] font-bold text-lg mb-4">About {IDENTITY.name}</h2>
            <p>{ABOUT.summary}</p>
            <div className="mt-6 pt-4 border-t border-dotted border-[var(--color-terminal-border)]">
              <h3 className="text-[var(--color-terminal-purple)] font-bold mb-2 uppercase text-[10px]">Certifications</h3>
              <ul className="space-y-1 opacity-70 italic">
                {CERTIFICATIONS.map((cert, i) => <li key={i}>— {cert}</li>)}
              </ul>
            </div>
          </div>
        );
      case "education":
        return (
          <div className="py-4 space-y-6">
            <h2 className="text-[var(--color-terminal-peach)] font-bold text-lg mb-2">Academic History</h2>
            {EDUCATION.map((edu, i) => (
              <div key={i} className="font-mono text-xs border-l-2 border-[var(--color-terminal-blue)] pl-4">
                <p className="text-[var(--color-terminal-blue)] font-bold text-sm">{edu.institution}</p>
                <p className="opacity-80 mt-1">{edu.degree}</p>
                <p className="opacity-60">{edu.location} • {edu.duration}</p>
                <p className="mt-2 text-[var(--color-terminal-green)]">{edu.details}</p>
              </div>
            ))}
          </div>
        );
      case "experience":
        return (
          <div className="py-4 space-y-8">
            <h2 className="text-[var(--color-terminal-peach)] font-bold text-lg mb-2">Professional Experience</h2>
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="font-mono text-xs border-l-2 border-[var(--color-terminal-purple)] pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[var(--color-terminal-purple)] font-bold text-sm">{exp.role}</p>
                    <p className="opacity-80">{exp.company} • {exp.type}</p>
                  </div>
                  <span className="opacity-40 italic">{exp.duration}</span>
                </div>
                <ul className="mt-3 space-y-2 opacity-70">
                  {exp.highlights.map((h, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-[var(--color-terminal-peach)]">›</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      case "contact":
        const contactItems = [
          { icon: <Mail size={16} />, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
          { icon: <Phone size={16} />, label: "Phone", value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, '')}` },
          { icon: <Briefcase size={16} />, label: "LinkedIn", value: "LinkedIn Profile", href: CONTACT.linkedin },
          { icon: <Code size={16} />, label: "GitHub", value: "GitHub Profile", href: CONTACT.github },
        ];

        return (
          <div className="py-6 w-full">
            <h2 className="text-[var(--color-terminal-peach)] text-lg font-bold mb-6">Connectivity Hub</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              {contactItems.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 border border-dotted border-[var(--color-terminal-border)] rounded-lg hover:border-[var(--color-terminal-peach)]/50 hover:bg-[var(--color-terminal-peach)]/5 transition-all duration-300"
                >
                  <div className="text-[var(--color-terminal-purple)] group-hover:text-[var(--color-terminal-peach)] transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest">{item.label}</span>
                    <span className="text-xs font-mono opacity-80 group-hover:opacity-100 transition-opacity truncate max-w-[200px]">{item.value}</span>
                  </div>
                  <ExternalLink size={12} className="ml-auto opacity-0 group-hover:opacity-30 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        );
      case "help":
      case "secrets":
        const cmds = view === "secrets" ? { Secrets: FLAT_COMMANDS.filter(c => c.cmd.match(/^\/matrix$|^\/destruct$|^sudo hire vaibhav$|^ping vaibhav$|git log$/)) } : COMMAND_DATABASE;
        return (
          <div className="py-4 font-mono w-full">
            <div className="space-y-6">
              {Object.entries(cmds).map(([category, commands]) => (
                <div key={category}>
                  <h2 className="text-[#606060] font-bold text-[10px] tracking-widest uppercase mb-2">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h2>
                  <div className="space-y-1 text-xs">
                    {(commands as any[]).map(c => (
                      <p key={c.cmd} className="flex">
                        <span className="w-40 shrink-0 text-[var(--color-terminal-peach)] font-bold cursor-pointer hover:underline" onClick={() => handleCommand(c.cmd)}>{c.cmd}</span>
                        <span className="text-[#9090a0]">{c.desc}</span>
                      </p>
                    ))}
                    {category === "Navigation" && (
                      <p className="flex">
                        <span className="w-40 shrink-0 text-[var(--color-terminal-peach)] font-bold cursor-pointer hover:underline" onClick={() => handleCommand("git log")}>git log</span>
                        <span className="text-[#9090a0]">View live GitHub activity</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "themes":
        return (
          <div className="py-4 font-mono w-full max-w-2xl">
            <h2 className="text-[var(--color-terminal-purple)] font-bold text-lg mb-2">Themes</h2>
            <p className="text-xs text-white mb-6">Type a theme name to switch. Current: {activeTheme}</p>
            <div className="space-y-2">
              {[
                { cmd: "/dark", name: "Default", desc: "deep tones", colors: ["#0D0D12", "#E0E0E6", "#D97757", "#9D8DF1"] },
                { cmd: "/light", name: "Clean", desc: "bright mode", colors: ["#f0f0f5", "#1e1e2e", "#d25f3b", "#5b4db8"] },
                { cmd: "/retro", name: "1983 CRT", desc: "scanlines", colors: ["#051405", "#33ff33", "#33ff33", "#33ff33"] },
                { cmd: "/glass", name: "Frosted", desc: "with depth", colors: ["#1a1a24", "#ffffff", "#d97757", "#9d8df1"] }
              ].map((theme) => {
                const isActive = activeTheme === theme.cmd.substring(1);
                return (
                  <div key={theme.cmd} onClick={() => handleCommand(theme.cmd)} className={`flex items-center justify-between p-3 rounded-md cursor-pointer border ${isActive ? 'border-[var(--color-terminal-purple)] bg-[var(--color-terminal-purple)]/10' : 'border-[var(--color-terminal-border)] hover:bg-white/5'}`}>
                    <div className="flex items-center text-xs">
                      <span className="font-bold text-white mr-2">{theme.cmd}</span>
                      <span className="text-[#9090a0]"> — {theme.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case "home":
      default:
        return (
          <>
            <AsciiHeader />
            <TerminalSection onCommandClick={(cmd) => handleCommand(cmd)} />
            <div className="mt-12 text-[11px] opacity-60 font-mono space-y-6 max-w-xl italic">
              <p>Welcome to my AI-driven OS. Try <span className="text-[var(--color-terminal-peach)] cursor-pointer" onClick={() => handleCommand("/about")}>/about</span> to begin initialization.</p>
              <p>Execute <span className="text-[var(--color-terminal-peach)] cursor-pointer" onClick={() => handleCommand("/work")}>/work</span> to pull latest neural repos from GitHub.</p>
            </div>
          </>
        );
    }
  };

  return (
    <>
      {isMatrixMode && <MatrixRain />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`w-full z-10 px-4 md:px-0 transition-all duration-1000 ${shakeClass}`}
      >
        <WindowFrame>
          {isDestructing && destructCount === 0 && (
            <div className="absolute inset-0 z-50 flex flex-col justify-center items-center rounded-lg bg-black/50 backdrop-blur-md">
              <div className="text-[var(--color-terminal-red)] font-mono text-xl animate-pulse mb-8">SYSTEM CORRUPTED</div>
              <button onClick={() => window.location.reload()} className="border border-[var(--color-terminal-red)] text-[var(--color-terminal-red)] px-6 py-2 bg-black hover:bg-[var(--color-terminal-red)] hover:text-black transition-colors font-mono cursor-pointer">REBOOT SYSTEM</button>
            </div>
          )}

          <div className={`flex-1 flex flex-col min-h-0 transition-all duration-1000 ${isDestructing && destructCount === 0 ? 'grayscale blur-sm pointer-events-none' : ''}`}>
            <div id="terminal-scroll-container" ref={scrollRef} className="flex-1 custom-scrollbar overflow-y-auto overflow-x-hidden mb-4 pr-2 flex flex-col space-y-6 scroll-smooth">
              {history.map((block) => (
                <div key={block.id} className="w-full">
                  {block.command && (
                    <div className="flex items-center text-[var(--color-terminal-text)] font-mono text-sm mb-2 opacity-70">
                      <span className="text-[var(--color-terminal-peach)] mr-3 font-bold select-none">&gt;</span>
                      <span className="font-bold">{block.command}</span>
                    </div>
                  )}
                  <AnimatePresence mode="wait">
                    <motion.div initial={block.command !== '' ? { opacity: 0, y: 10 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                      {renderContent(block.view)}
                    </motion.div>
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="border-t border-dotted border-[var(--color-terminal-border)] pt-4 mt-auto shrink-0 transition-all">
              <CommandInput onExecute={handleCommand} />
            </div>
          </div>
        </WindowFrame>
      </motion.div>
    </>
  );
}
