"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { FLAT_COMMANDS } from "@/lib/constants";

type CommandInputProps = {
  onExecute: (command: string) => void;
};

export default function CommandInput({ onExecute }: CommandInputProps) {
  const [value, setValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<typeof FLAT_COMMANDS>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const searchTerm = value.toLowerCase();
      let matches = FLAT_COMMANDS.filter(c => c.allTriggers.some(t => t.startsWith(searchTerm)));
      if (matches.length === 0 && !searchTerm.startsWith("/")) {
        matches = FLAT_COMMANDS.filter(c => c.allTriggers.some(t => t.startsWith("/" + searchTerm)));
      }
      setSuggestions(matches);
      setSuggestionIndex(0);
    } else {
      setSuggestions([]);
    }
  }, [value]);

  useEffect(() => {
    if (suggestions.length > 0 && dropdownRef.current) {
      const selectedEl = dropdownRef.current.children[suggestionIndex] as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [suggestionIndex, suggestions.length]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      let finalCommand = value.trim();

      if (suggestions.length > 0 && suggestions[suggestionIndex]) {
        finalCommand = suggestions[suggestionIndex].cmd;
      }

      if (finalCommand) {
        setCommandHistory((prev) => [finalCommand, ...prev]);
        setHistoryIndex(-1);
        setSuggestions([]);
        onExecute(finalCommand);
        setValue("");
      }
    },
    [value, suggestions, suggestionIndex, onExecute]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab") {
        e.preventDefault(); // always prevent default tab behavior in terminal input

        if (suggestions.length > 0) {
          setValue(suggestions[suggestionIndex].cmd);
          setSuggestions([]);
          return;
        }
      }

      if (suggestions.length > 0) {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSuggestionIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
          return;
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          setSuggestionIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
          return;
        }
      }

      // Default History Navigation
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
          setHistoryIndex(newIndex);
          setValue(commandHistory[newIndex]);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setValue(commandHistory[newIndex]);
        } else {
          setHistoryIndex(-1);
          setValue("");
        }
      } else if (e.key === "Escape") {
        setSuggestions([]);
      }
    },
    [suggestions, suggestionIndex, commandHistory, historyIndex, value]
  );

  useEffect(() => {
    const terminal = document.getElementById("terminal-window");
    if (!terminal) return;

    const handleClick = () => {
      inputRef.current?.focus();
    };

    terminal.addEventListener("click", handleClick);
    return () => terminal.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center text-sm font-mono text-[var(--color-terminal-text)] w-full relative"
    >
      {suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute bottom-full left-0 mb-2 w-full max-h-60 overflow-y-auto bg-[var(--color-terminal-bg)] border border-[var(--color-terminal-border)] rounded shadow-2xl z-50 custom-scrollbar backdrop-blur-md"
        >
          {suggestions.map((cmd, i) => (
            <div
              key={cmd.cmd}
              className={`flex px-4 py-2 cursor-pointer transition-colors ${i === suggestionIndex ? 'bg-[var(--color-terminal-purple)]/20' : 'hover:bg-white/5'}`}
              onClick={() => {
                setValue(cmd.cmd);
                setSuggestions([]);
                inputRef.current?.focus();
              }}
            >
              <span className="w-36 shrink-0 text-[var(--color-terminal-peach)] font-bold">{cmd.cmd}</span>
              <span className="opacity-70 truncate">{cmd.desc}</span>
            </div>
          ))}
        </div>
      )}

      <span className="text-[var(--color-terminal-peach)] mr-3 font-bold select-none">
        &gt;
      </span>

      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setHistoryIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent outline-none border-none p-0 m-0 text-[var(--color-terminal-text)] selection:bg-[var(--color-terminal-peach)] selection:text-[var(--color-terminal-bg)] block font-mono caret-[var(--color-terminal-peach)] placeholder-[#606060] placeholder:italic relative z-10"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal command input"
          id="terminal-input"
          placeholder='Type a command... try "help"'
        />
      </div>
    </form>
  );
}
