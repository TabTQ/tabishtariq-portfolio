/** Shared content + diagram types (single source of truth for the site). */

export type NodeKind =
  | "root"
  | "domain"
  | "service"
  | "storage"
  | "device"
  | "metric"
  | "group"
  | "step";

export interface MapNode {
  id: string;
  kind: NodeKind;
  label: string;
  sublabel?: string;
  icon?: string; // lucide icon name
  route?: string; // navigates on click
  accent?: "accent" | "sage" | "gold" | "blue" | "danger";
  /** Optional explicit grid position (col,row) used by the simple layout engine. */
  col?: number;
  row?: number;
}

export interface MapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  dashed?: boolean;
}

export interface DiagramSpec {
  direction: "TB" | "LR";
  nodes: MapNode[];
  edges: MapEdge[];
}

export interface Metric {
  label: string;
  before: string;
  after: string;
  emphasis?: "accent" | "sage" | "gold";
}

export interface Experience {
  slug: string;
  role: string;
  company: string;
  client?: string;
  duration: string;
  location?: string;
  summary: string;
  skills: string[];
  highlights: string[];
}

export interface SmallProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  type: string;
}

export interface SkillGroup {
  category: string;
  icon: string;
  skills: string[];
}

export interface ResearchItem {
  type: "Degree" | "Publication" | "Certification";
  title: string;
  institution: string;
  date: string;
  description?: string;
  url?: string;
}
