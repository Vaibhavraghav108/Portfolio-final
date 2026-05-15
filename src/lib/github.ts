/* eslint-disable @typescript-eslint/no-explicit-any */
const GITHUB_USERNAME = "Vaibhavraghav108";
const CACHE_KEY_REPOS = "github_repos_cache_v3";
const CACHE_KEY_EVENTS = "github_events_cache_v2";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export interface GithubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  updated_at: string;
}

export interface GithubCommit {
  sha: string;
  message: string;
  date: string;
  repo: string;
}

const getCachedData = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(key);
    return null;
  }
  // Don't return cached empty arrays (likely previous failures)
  if (Array.isArray(data) && data.length === 0) return null;
  return data;
};

const setCachedData = <T>(key: string, data: T) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
};

export const fetchGithubRepos = async (): Promise<GithubRepo[]> => {
  const cached = getCachedData<GithubRepo[]>(CACHE_KEY_REPOS);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      {
        headers: process.env.NEXT_PUBLIC_GITHUB_TOKEN
          ? { Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}` }
          : {},
      }
    );

    if (!response.ok) throw new Error("Failed to fetch repos");
    const data = await response.json();
    if (!Array.isArray(data)) return [];

    // Filter out profile repository and auto-generated/unimportant ones
    const ignoreList = ["Vaibhavraghav108", "neetcode-submissions-ebebukbt"];
    
    const repos = data
      .filter((repo: Record<string, any>) => !ignoreList.includes(repo.name) && !repo.fork)
      .slice(0, 10) // Show top 10 important ones
      .map((repo: Record<string, any>) => ({
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
        language: repo.language,
        updated_at: repo.updated_at,
      }));

    setCachedData(CACHE_KEY_REPOS, repos);
    return repos;
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return [];
  }
};

export const fetchGithubCommits = async (): Promise<GithubCommit[]> => {
  const cached = getCachedData<GithubCommit[]>(CACHE_KEY_EVENTS);
  if (cached) return cached;

  try {
    // 1. Get the most recently updated repo first
    const repos = await fetchGithubRepos();
    if (repos.length === 0) return [];
    
    const targetRepo = repos[0].name; // The one with the latest update

    // 2. Fetch actual commits for this repo
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${targetRepo}/commits?per_page=5`,
      {
        headers: process.env.NEXT_PUBLIC_GITHUB_TOKEN
          ? { Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}` }
          : {},
      }
    );

    if (!response.ok) throw new Error("Failed to fetch commits");
    const data = await response.json();
    
    if (!Array.isArray(data)) return [];

    const commits = data.map((item: Record<string, any>) => ({
      sha: item.sha.substring(0, 7),
      message: item.commit.message,
      date: item.commit.author.date,
      repo: targetRepo,
    }));

    setCachedData(CACHE_KEY_EVENTS, commits);
    return commits;
  } catch (error) {
    console.error("Error fetching GitHub commits:", error);
    return [];
  }
};
