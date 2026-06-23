import type { DiagramSpec } from "./types";
import { proxmox } from "./homelab";

/* ---------------------------------------------------------------------------
   HUB — the landing system map. Central node branches to every domain.
--------------------------------------------------------------------------- */
export const hubDiagram: DiagramSpec = {
  direction: "TB",
  nodes: [
    { id: "me", kind: "root", label: "Tabish Tariq", sublabel: "Data Engineer · Infra", icon: "CircleUser" },
    { id: "about", kind: "domain", label: "About", sublabel: "Who I am", icon: "User", route: "/about", accent: "accent" },
    { id: "experience", kind: "domain", label: "Experience", sublabel: "Genpact · TCS", icon: "Briefcase", route: "/experience", accent: "accent" },
    { id: "redshift", kind: "domain", label: "Flagship Project", sublabel: "Redshift pipeline", icon: "Database", route: "/projects/redshift", accent: "sage" },
    { id: "projects", kind: "domain", label: "Projects", sublabel: "Other builds", icon: "FolderGit2", route: "/projects", accent: "sage" },
    { id: "homelab", kind: "domain", label: "Homelab", sublabel: "Proxmox · RPi · Net", icon: "Server", route: "/homelab", accent: "gold" },
    { id: "skills", kind: "domain", label: "Skills", sublabel: "Stack & tooling", icon: "Layers", route: "/skills", accent: "blue" },
    { id: "research", kind: "domain", label: "Academics", sublabel: "Degrees · papers", icon: "GraduationCap", route: "/academics", accent: "blue" },
    { id: "contact", kind: "domain", label: "Contact", sublabel: "Get in touch", icon: "Mail", route: "/contact", accent: "accent" },
  ],
  edges: [
    { id: "e1", source: "me", target: "about" },
    { id: "e2", source: "me", target: "experience" },
    { id: "e3", source: "me", target: "redshift" },
    { id: "e4", source: "me", target: "projects" },
    { id: "e5", source: "me", target: "homelab" },
    { id: "e6", source: "me", target: "skills" },
    { id: "e7", source: "me", target: "research" },
    { id: "e8", source: "me", target: "contact" },
  ],
};

/* ---------------------------------------------------------------------------
   EXPERIENCE — career flow, each role clickable.
--------------------------------------------------------------------------- */
export const experienceDiagram: DiagramSpec = {
  direction: "LR",
  nodes: [
    { id: "trainee", kind: "step", label: "ASE — Trainee", sublabel: "TCS · 2022", icon: "Sprout", route: "/experience/tcs-trainee", accent: "blue" },
    { id: "syseng", kind: "step", label: "System Engineer", sublabel: "TCS · 2023–25", icon: "Activity", route: "/experience/tcs-system-engineer", accent: "sage" },
    { id: "genpact", kind: "step", label: "Data Engineer", sublabel: "Genpact · 2025–", icon: "Star", route: "/experience/genpact", accent: "accent" },
  ],
  edges: [
    { id: "x1", source: "trainee", target: "syseng", label: "promoted" },
    { id: "x2", source: "syseng", target: "genpact", label: "moved" },
  ],
};

/* ---------------------------------------------------------------------------
   REDSHIFT — 3-layer pipeline flow; key nodes route to deliverable deep-dives.
--------------------------------------------------------------------------- */
export const redshiftDiagram: DiagramSpec = {
  direction: "TB",
  nodes: [
    { id: "sources", kind: "device", label: "Telemetry Sources", sublabel: "Edge (DWF) · DSL SCADA", icon: "Wind" },
    { id: "layer1", kind: "service", label: "Layer 1 — S3 Load UDFs", sublabel: "source-based staging", icon: "Download", accent: "sage" },
    { id: "layer2", kind: "service", label: "Layer 2 — 7 Final-Load Procs", sublabel: "run_type dispatch", icon: "GitMerge", route: "/projects/redshift/consolidation", accent: "accent" },
    { id: "layer3", kind: "service", label: "Layer 3 — Python Orchestration", sublabel: "parallel backfill", icon: "Workflow", route: "/projects/redshift/etl-framework", accent: "sage" },
    { id: "joinopt", kind: "metric", label: "Join Optimization", sublabel: "nested-loop → hash join", icon: "Gauge", route: "/projects/redshift/join-optimization", accent: "gold" },
    { id: "locks", kind: "metric", label: "Lock Redesign", sublabel: "MERGE REMOVE DUPLICATES", icon: "Lock", route: "/projects/redshift/deadlocks", accent: "gold" },
    { id: "final", kind: "storage", label: "Final Tables", sublabel: "ge_opd.*_data_f_rs", icon: "Table2", accent: "blue" },
    { id: "dash", kind: "storage", label: "Tableau Dashboards", sublabel: "ops & coverage", icon: "BarChart3", accent: "blue" },
  ],
  edges: [
    { id: "r1", source: "sources", target: "layer1" },
    { id: "r2", source: "layer1", target: "layer2" },
    { id: "r3", source: "layer2", target: "final" },
    { id: "r4", source: "final", target: "dash" },
    { id: "r5", source: "layer3", target: "layer2", label: "orchestrates", dashed: true },
    { id: "r6", source: "joinopt", target: "layer2", dashed: true },
    { id: "r7", source: "locks", target: "layer2", dashed: true },
  ],
};

/* ---------------------------------------------------------------------------
   PROXMOX — node map; container nodes scroll to their detail card (# anchors).
--------------------------------------------------------------------------- */
export const proxmoxDiagram: DiagramSpec = {
  direction: "TB",
  nodes: [
    { id: "access", kind: "device", label: "External Access", sublabel: "Cloudflare Tunnel · Tailscale", icon: "Globe", accent: "blue" },
    { id: "host", kind: "root", label: "Proxmox Host", sublabel: "192.168.10.100 · Ryzen 5 5500", icon: "Server" },
    ...proxmox.containers.map((c) => ({
      id: c.id,
      kind: "service" as const,
      label: c.name,
      sublabel: `${c.id.toUpperCase()} · ${c.purpose}`,
      icon: "Box",
      route: `#${c.id}`,
      accent: (c.status === "Idle" ? "gold" : "sage") as "gold" | "sage",
    })),
    { id: "nvme", kind: "storage", label: "NVMe SSD", sublabel: "OS & VMs", icon: "HardDrive", accent: "blue" },
    { id: "sata", kind: "storage", label: "SATA HDD", sublabel: "Media / Data", icon: "HardDrive", accent: "blue" },
    { id: "ssd", kind: "storage", label: "Backup SSD", sublabel: "PBS datastore", icon: "HardDrive", accent: "blue" },
  ],
  edges: [
    { id: "p0", source: "access", target: "host" },
    ...proxmox.containers.map((c) => ({ id: `pe-${c.id}`, source: "host", target: c.id })),
    { id: "ps1", source: "lxc-100", target: "nvme", dashed: true },
    { id: "ps2", source: "lxc-210", target: "sata", dashed: true },
    { id: "ps3", source: "lxc-999", target: "ssd", dashed: true },
    { id: "ps4", source: "lxc-101", target: "lxc-102", label: "uses", dashed: true },
  ],
};

/* ---------------------------------------------------------------------------
   RASPBERRY PI — access paths + container groups; nodes scroll to matrix rows.
--------------------------------------------------------------------------- */
export const rpiDiagram: DiagramSpec = {
  direction: "TB",
  nodes: [
    { id: "internet", kind: "device", label: "Internet", sublabel: "public users", icon: "Globe", accent: "blue" },
    { id: "cf", kind: "service", label: "Cloudflare Tunnel", sublabel: "outbound-only", icon: "Shield", route: "#cloudflared", accent: "sage" },
    { id: "tailscale", kind: "device", label: "Tailscale VPN", sublabel: "admin mesh", icon: "Network", accent: "blue" },
    { id: "rpi", kind: "root", label: "Raspberry Pi 4", sublabel: "tabishrpi4 · 192.168.10.101", icon: "Cpu" },
    { id: "homepage", kind: "service", label: "Homepage", sublabel: "dashboard :2000", icon: "LayoutDashboard", route: "#homepage", accent: "accent" },
    { id: "guac", kind: "service", label: "Guacamole", sublabel: "remote desktop :8081", icon: "MonitorSmartphone", route: "#guacamole", accent: "sage" },
    { id: "mon", kind: "service", label: "Monitoring Stack", sublabel: "Prometheus · Grafana", icon: "Activity", route: "#grafana", accent: "gold" },
    { id: "portainer", kind: "service", label: "Portainer", sublabel: "docker mgmt :9000", icon: "Box", route: "#portainer", accent: "sage" },
    { id: "pbs", kind: "storage", label: "PBS Backup", sublabel: "Sundays 02:00", icon: "Archive", accent: "blue" },
  ],
  edges: [
    { id: "rp1", source: "internet", target: "cf" },
    { id: "rp2", source: "cf", target: "homepage" },
    { id: "rp3", source: "cf", target: "guac" },
    { id: "rp4", source: "tailscale", target: "rpi" },
    { id: "rp5", source: "rpi", target: "portainer" },
    { id: "rp6", source: "rpi", target: "mon" },
    { id: "rp7", source: "rpi", target: "homepage", dashed: true },
    { id: "rp8", source: "rpi", target: "guac", dashed: true },
    { id: "rp9", source: "rpi", target: "pbs", label: "backup", dashed: true },
  ],
};

/* ---------------------------------------------------------------------------
   NETWORK — dual-ISP VLAN topology; switch nodes scroll to detail cards.
--------------------------------------------------------------------------- */
export const networkDiagram: DiagramSpec = {
  direction: "TB",
  nodes: [
    { id: "isp1", kind: "device", label: "ISP 1 — Fiber", sublabel: "1 Gbps · PPPoE", icon: "Wifi", accent: "sage" },
    { id: "isp2", kind: "device", label: "ISP 2", sublabel: "30 Mbps · Dynamic", icon: "Wifi", accent: "gold" },
    { id: "er605", kind: "root", label: "TP-Link ER605", sublabel: "dual-WAN failover", icon: "Router" },
    { id: "vlan10", kind: "group", label: "VLAN 10", sublabel: "192.168.10.0/24 · high-speed", icon: "Layers", accent: "sage" },
    { id: "vlan20", kind: "group", label: "VLAN 20", sublabel: "192.168.20.0/24 · IoT", icon: "Layers", accent: "gold" },
    { id: "sg108e", kind: "service", label: "TL-SG108E", sublabel: "8-port managed", icon: "Network", route: "#sg108e", accent: "sage" },
    { id: "ls105g", kind: "service", label: "LS105G", sublabel: "room switch", icon: "Network", route: "#ls105g", accent: "sage" },
    { id: "tenda", kind: "service", label: "Tenda 8-Port", sublabel: "100 Mbps IoT", icon: "Network", route: "#tenda", accent: "gold" },
    { id: "lab", kind: "device", label: "Homelab Nodes", sublabel: "Proxmox · RPi · PCs", icon: "Server", accent: "blue" },
    { id: "iot", kind: "device", label: "Cameras / IoT", sublabel: "DVR · Floor-2 AP", icon: "Cctv", accent: "blue" },
  ],
  edges: [
    { id: "n1", source: "isp1", target: "er605", label: "WAN 1" },
    { id: "n2", source: "isp2", target: "er605", label: "WAN 2" },
    { id: "n3", source: "er605", target: "vlan10" },
    { id: "n4", source: "er605", target: "vlan20" },
    { id: "n5", source: "vlan10", target: "sg108e" },
    { id: "n6", source: "sg108e", target: "ls105g" },
    { id: "n7", source: "sg108e", target: "lab" },
    { id: "n8", source: "vlan20", target: "tenda" },
    { id: "n9", source: "tenda", target: "iot" },
  ],
};

/* ---------------------------------------------------------------------------
   SKILLS — radial overview (illustrative; detail cards live on the page).
--------------------------------------------------------------------------- */
export const skillsDiagram: DiagramSpec = {
  direction: "TB",
  nodes: [
    { id: "core", kind: "root", label: "Skill Stack", sublabel: "8 domains", icon: "Layers" },
    { id: "s-cloud", kind: "domain", label: "Cloud & Data WH", icon: "Cloud", route: "#cat-0", accent: "accent" },
    { id: "s-lang", kind: "domain", label: "Languages", icon: "Code", route: "#cat-1", accent: "sage" },
    { id: "s-de", kind: "domain", label: "Data Engineering", icon: "Database", route: "#cat-2", accent: "accent" },
    { id: "s-py", kind: "domain", label: "Python Ecosystem", icon: "Boxes", route: "#cat-3", accent: "sage" },
    { id: "s-auto", kind: "domain", label: "Orchestration", icon: "Workflow", route: "#cat-4", accent: "gold" },
    { id: "s-infra", kind: "domain", label: "Infra & DevOps", icon: "Server", route: "#cat-5", accent: "gold" },
    { id: "s-ai", kind: "domain", label: "AI-Assisted Dev", icon: "Sparkles", route: "#cat-6", accent: "blue" },
    { id: "s-tools", kind: "domain", label: "Tooling", icon: "Wrench", route: "#cat-7", accent: "blue" },
  ],
  edges: [
    { id: "k1", source: "core", target: "s-cloud" },
    { id: "k2", source: "core", target: "s-lang" },
    { id: "k3", source: "core", target: "s-de" },
    { id: "k4", source: "core", target: "s-py" },
    { id: "k5", source: "core", target: "s-auto" },
    { id: "k6", source: "core", target: "s-infra" },
    { id: "k7", source: "core", target: "s-ai" },
    { id: "k8", source: "core", target: "s-tools" },
  ],
};

/* Homelab hub (small) — links to the three sub-systems. */
export const homelabDiagram: DiagramSpec = {
  direction: "TB",
  nodes: [
    { id: "lab", kind: "root", label: "Homelab", sublabel: "self-hosted platform", icon: "Server" },
    { id: "pve", kind: "domain", label: "Proxmox Node", sublabel: "~10 LXC services", icon: "Boxes", route: "/homelab/proxmox", accent: "accent" },
    { id: "rpi", kind: "domain", label: "Raspberry Pi", sublabel: "observability + access", icon: "Cpu", route: "/homelab/raspberry-pi", accent: "sage" },
    { id: "net", kind: "domain", label: "Home Network", sublabel: "dual-ISP · VLANs", icon: "Network", route: "/homelab/network", accent: "gold" },
  ],
  edges: [
    { id: "h1", source: "lab", target: "pve" },
    { id: "h2", source: "lab", target: "rpi" },
    { id: "h3", source: "lab", target: "net" },
  ],
};
