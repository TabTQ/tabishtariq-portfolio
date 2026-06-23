import type { SkillGroup } from "./types";

export const skillGroups: SkillGroup[] = [
  {
    category: "Cloud & Data Warehousing",
    icon: "Cloud",
    skills: [
      "Amazon Redshift",
      "Redshift Spectrum",
      "AWS S3",
      "AWS Glue (Catalog & Jobs)",
      "AWS Secrets Manager",
      "KMS",
      "IAM",
    ],
  },
  {
    category: "Languages",
    icon: "Code",
    skills: ["Python 3", "SQL", "PL/pgSQL", "Bash"],
  },
  {
    category: "Data Engineering",
    icon: "Database",
    skills: [
      "ETL pipeline design",
      "MERGE / UPSERT patterns",
      "MERGE REMOVE DUPLICATES",
      "EXCEPT-based dedup",
      "Watermark incremental loads",
      "DISTKEY / SORTKEY tuning",
      "MPP query optimization",
      "Manifest-based bulk loads",
    ],
  },
  {
    category: "Python Ecosystem",
    icon: "Boxes",
    skills: [
      "psycopg2 (ThreadedConnectionPool)",
      "boto3",
      "concurrent.futures",
      "argparse",
      "configparser",
      "cryptography (Fernet)",
    ],
  },
  {
    category: "Automation & Orchestration",
    icon: "Workflow",
    skills: ["Jenkins", "n8n", "systemd", "cron", "GEMINI scheduler", "ServiceNow integration"],
  },
  {
    category: "Infrastructure & DevOps",
    icon: "Server",
    skills: [
      "Docker / Compose",
      "Proxmox VE",
      "LXC containers",
      "Proxmox Backup Server",
      "Linux (Debian/Ubuntu)",
      "Tailscale",
      "Cloudflare Tunnel",
      "Prometheus / Grafana",
      "cAdvisor / Node Exporter",
    ],
  },
  {
    category: "AI-Assisted Development",
    icon: "Sparkles",
    skills: ["Claude Code", "Gemini CLI", "OpenCode", "Claude / Gemini / Grok chat"],
  },
  {
    category: "Tooling",
    icon: "Wrench",
    skills: ["Git / GitHub", "Confluence", "Jira", "VS Code / Code-Server"],
  },
];
