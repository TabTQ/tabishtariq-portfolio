/** Server-only API client for the Python backend. Every call is uncached so a
 *  page refresh always reflects the latest database state. */

import type {
  DiagramSpec,
  Experience,
  Homelab,
  Profile,
  Project,
  ResearchItem,
  SkillGroup,
} from "@/lib/types";

const API_BASE = process.env.BACKEND_API_URL ?? "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function getOrNull<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const getProfile = () => get<Profile>("/api/profile");

export const getExperiences = () => get<Experience[]>("/api/experiences");
export const getExperience = (slug: string) =>
  getOrNull<Experience>(`/api/experiences/${encodeURIComponent(slug)}`);

export const getProjects = (kind?: "flagship" | "small") =>
  get<Project[]>(`/api/projects${kind ? `?kind=${kind}` : ""}`);
export const getProject = (slug: string) =>
  getOrNull<Project>(`/api/projects/${encodeURIComponent(slug)}`);

export const getHomelab = () => get<Homelab>("/api/homelab");

export const getSkillGroups = () => get<SkillGroup[]>("/api/skills");

export const getAcademics = () => get<ResearchItem[]>("/api/academics");

export const getDiagram = (key: string) =>
  get<DiagramSpec>(`/api/diagrams/${encodeURIComponent(key)}`);
