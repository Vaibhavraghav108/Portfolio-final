"use client";

import React from "react";
import { FEATURED_PROJECTS } from "@/lib/data";
import { GithubRepo } from "@/lib/github";

interface ProjectCardsProps {
  repos?: GithubRepo[];
}

export default function ProjectCards({ repos = [] }: ProjectCardsProps) {
  const liveRepos = repos.filter(repo => !FEATURED_PROJECTS.some(fp => fp.link.endsWith(repo.name)));

  return (
    <div className="flex flex-col gap-8 my-2 w-full text-sm font-mono text-[var(--color-terminal-text)]">
      {/* Featured Projects Section */}
      <div>
        <h2 className="text-[10px] font-bold text-[var(--color-terminal-peach)] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
          <span className="w-8 h-[1px] bg-[var(--color-terminal-peach)]/30" />
          Featured Neural Systems
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {FEATURED_PROJECTS.map((project, idx) => (
            <div
              key={idx}
              className="border border-dotted border-[var(--color-terminal-border)] rounded-lg p-5 bg-[var(--color-terminal-surface)]/10 hover:bg-[var(--color-terminal-surface)]/25 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-[var(--color-terminal-peach)] font-bold text-base group-hover:translate-x-1 transition-transform">
                    {project.title}
                  </h3>
                  {project.subtitle && (
                    <p className="text-[var(--color-terminal-purple)] text-[11px] mt-1 opacity-80">
                      {project.subtitle}
                    </p>
                  )}
                </div>
                <span className="text-[9px] font-bold text-[var(--color-terminal-green)] border border-[var(--color-terminal-green)]/30 px-2 py-0.5 rounded uppercase tracking-tighter">
                  Pinned
                </span>
              </div>

              <p className="text-[12px] leading-relaxed opacity-70 mb-4 font-sans italic">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-dotted border-[var(--color-terminal-border)]/50">
                {project.tech.map((t, i) => (
                  <span
                    key={i}
                    className="text-[9px] text-[var(--color-terminal-purple)] bg-[var(--color-terminal-purple)]/10 border border-[var(--color-terminal-purple)]/20 px-2 py-0.5 rounded-sm font-semibold"
                  >
                    {t}
                  </span>
                ))}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[var(--color-terminal-blue)] hover:text-white hover:underline ml-auto flex items-center gap-1.5"
                  >
                    EXPLORE REPO ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub Repositories Section */}
      {liveRepos.length > 0 && (
        <div>
          <h2 className="text-[10px] font-bold text-[var(--color-terminal-purple)] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[var(--color-terminal-purple)]/30" />
            Live Repositories (GitHub)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveRepos.map((repo, idx) => (
              <div
                key={idx}
                className="border border-[var(--color-terminal-border)] rounded-lg p-4 bg-black/20 hover:border-[var(--color-terminal-peach)]/50 transition-all cursor-pointer group"
                onClick={() => window.open(repo.html_url, "_blank")}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[var(--color-terminal-text)] font-bold text-xs truncate mr-2 group-hover:text-[var(--color-terminal-peach)] transition-colors">
                    {repo.name}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-[var(--color-terminal-peach)]">★ {repo.stargazers_count}</span>
                  </div>
                </div>
                <p className="text-[11px] opacity-80 mb-3 leading-tight">
                  {repo.description || "No description provided."}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[9px] opacity-40 uppercase tracking-tighter">
                    {repo.language || "Unknown"}
                  </span>
                  <span className="text-[9px] opacity-30 italic">
                    Updated {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
