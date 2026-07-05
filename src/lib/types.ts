/** Shared content + diagram types — the contract for API responses from the
 *  Python backend (which serializes camelCase to match these shapes). */

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

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  brand: string;
  status: string;
  summary: string;
  bio: string[];
  socials: {
    github: string;
    githubLabel: string;
    linkedin: string;
    linkedinLabel: string;
  };
  stats: { label: string; value: string; sub: string }[];
}

export interface Experience {
  id: number;
  slug: string;
  role: string;
  company: string;
  client?: string | null;
  duration: string;
  location?: string | null;
  summary: string;
  skills: string[];
  highlights: string[];
  sortOrder: number;
}

export interface CaseStudy {
  id: number;
  client?: string | null;
  role?: string | null;
  duration?: string | null;
  context?: string | null;
  platform: string[];
  metrics: Metric[];
  layers: { title: string; tone: "sage" | "accent" | "gold"; items: string[] }[];
  techStack: { layer: string; tech: string }[];
}

export interface Deliverable {
  id: number;
  deliverableKey: string;
  title: string;
  tag: string;
  body: string;
  sortOrder: number;
}

export interface Project {
  id: number;
  slug: string;
  kind: "flagship" | "small";
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string | null;
  liveUrl?: string | null;
  type?: string | null;
  sortOrder: number;
  caseStudy?: CaseStudy | null;
  deliverables: Deliverable[];
}

export interface HomelabContainer {
  id: number;
  containerKey: string;
  deviceId: number;
  name: string;
  ipAddress?: string | null;
  purpose?: string | null;
  resources?: string | null;
  status: string;
  services: string[];
  sortOrder: number;
}

export interface HomelabServiceRow {
  id: number;
  deviceId: number;
  serviceName: string;
  containerName?: string | null;
  hostPort?: string | null;
  function?: string | null;
  sortOrder: number;
}

export interface HomelabNetworkEntity {
  id: number;
  deviceId: number;
  entityType: "isp" | "vlan" | "switch";
  name: string;
  spec: {
    spec?: string;
    subnet?: string;
    role?: string;
    type?: string;
    ports?: string[];
    anchor?: string;
  };
  sortOrder: number;
}

export interface HomelabDevice {
  id: number;
  deviceKey: string;
  category: "proxmox" | "raspberry_pi" | "network";
  name: string;
  summary?: string | null;
  ipAddress?: string | null;
  status?: string | null;
  hardware: { component: string; spec: string }[];
  extra: {
    network?: string;
    access?: string[];
    backup?: string;
    failover?: string;
  };
  sortOrder: number;
  containers: HomelabContainer[];
  services: HomelabServiceRow[];
  networkEntities: HomelabNetworkEntity[];
}

export interface Homelab {
  proxmox?: HomelabDevice | null;
  raspberryPi?: HomelabDevice | null;
  network?: HomelabDevice | null;
}

export interface SkillGroup {
  category: string;
  icon: string;
  skills: string[];
}

export interface ResearchItem {
  id: number;
  type: "Degree" | "Publication" | "Certification";
  title: string;
  institution: string;
  date: string;
  description?: string | null;
  url?: string | null;
  sortOrder: number;
}
