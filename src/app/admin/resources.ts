/** Registry driving the generic admin CRUD pages. Adding admin support for a
 *  new content type = one entry here (fields + endpoints), nothing else. */

export type FieldType = "text" | "textarea" | "number" | "select" | "lines" | "json";

export interface FieldSpec {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  help?: string;
}

type Row = Record<string, unknown>;

export interface ResourceConfig {
  key: string;
  title: string;
  description: string;
  /** GET path returning the rows (public or admin endpoint). */
  listPath: string;
  /** Optional flatten step, e.g. deliverables nested under projects. */
  listTransform?: (data: unknown) => Row[];
  createPath: (row: Row) => string;
  updatePath: (row: Row) => string;
  deletePath: (row: Row) => string;
  listColumns: { header: string; field: string }[];
  fields: FieldSpec[];
}

const sortOrderField: FieldSpec = {
  name: "sortOrder",
  label: "Sort order",
  type: "number",
  help: "Lower numbers appear first",
};

export const resources: Record<string, ResourceConfig> = {
  experiences: {
    key: "experiences",
    title: "Experiences",
    description: "Career timeline entries",
    listPath: "/api/experiences",
    createPath: () => "/api/admin/experiences",
    updatePath: (r) => `/api/admin/experiences/${r.id}`,
    deletePath: (r) => `/api/admin/experiences/${r.id}`,
    listColumns: [
      { header: "Slug", field: "slug" },
      { header: "Role", field: "role" },
      { header: "Company", field: "company" },
      { header: "Duration", field: "duration" },
    ],
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true, help: "URL segment, e.g. genpact" },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "company", label: "Company", type: "text", required: true },
      { name: "client", label: "Client", type: "text" },
      { name: "duration", label: "Duration", type: "text", help: 'Display string, e.g. "May 2025 – Present"' },
      { name: "location", label: "Location", type: "text" },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "skills", label: "Skills", type: "lines", help: "One skill per line" },
      { name: "highlights", label: "Highlights", type: "lines", help: "One bullet per line" },
      sortOrderField,
    ],
  },

  projects: {
    key: "projects",
    title: "Projects",
    description: "Flagship case studies and small projects",
    listPath: "/api/projects",
    createPath: () => "/api/admin/projects",
    updatePath: (r) => `/api/admin/projects/${r.id}`,
    deletePath: (r) => `/api/admin/projects/${r.id}`,
    listColumns: [
      { header: "Slug", field: "slug" },
      { header: "Kind", field: "kind" },
      { header: "Title", field: "title" },
    ],
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "kind", label: "Kind", type: "select", options: ["flagship", "small"], required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "tags", label: "Tags", type: "lines", help: "One tag per line (small projects)" },
      { name: "repoUrl", label: "Repo URL", type: "text" },
      { name: "liveUrl", label: "Live URL", type: "text" },
      { name: "type", label: "Type", type: "text", help: 'Small-project category, e.g. "Automation"' },
      sortOrderField,
    ],
  },

  deliverables: {
    key: "deliverables",
    title: "Project deliverables",
    description: "Deep-dive cards attached to flagship projects",
    listPath: "/api/projects?kind=flagship",
    listTransform: (data) =>
      (data as { id: number; slug: string; deliverables: Row[] }[]).flatMap((p) =>
        p.deliverables.map((d) => ({ ...d, projectSlug: p.slug })),
      ),
    createPath: (r) => `/api/admin/projects/${r.projectId}/deliverables`,
    updatePath: (r) => `/api/admin/projects/${r.projectId}/deliverables/${r.id}`,
    deletePath: (r) => `/api/admin/projects/${r.projectId}/deliverables/${r.id}`,
    listColumns: [
      { header: "Project", field: "projectSlug" },
      { header: "Key", field: "deliverableKey" },
      { header: "Title", field: "title" },
      { header: "Tag", field: "tag" },
    ],
    fields: [
      { name: "projectId", label: "Project ID", type: "number", required: true, help: "Numeric id of the flagship project" },
      { name: "deliverableKey", label: "Key", type: "text", required: true, help: "URL segment, e.g. consolidation" },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "tag", label: "Tag", type: "text" },
      { name: "body", label: "Body", type: "textarea" },
      sortOrderField,
    ],
  },

  "homelab-devices": {
    key: "homelab-devices",
    title: "Homelab devices",
    description: "Proxmox host, Raspberry Pi, network root",
    listPath: "/api/admin/homelab/devices",
    createPath: () => "/api/admin/homelab/devices",
    updatePath: (r) => `/api/admin/homelab/devices/${r.id}`,
    deletePath: (r) => `/api/admin/homelab/devices/${r.id}`,
    listColumns: [
      { header: "Key", field: "deviceKey" },
      { header: "Category", field: "category" },
      { header: "Name", field: "name" },
      { header: "IP", field: "ipAddress" },
    ],
    fields: [
      { name: "deviceKey", label: "Device key", type: "text", required: true },
      { name: "category", label: "Category", type: "select", options: ["proxmox", "raspberry_pi", "network"], required: true },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "ipAddress", label: "IP address", type: "text" },
      { name: "status", label: "Status", type: "select", options: ["Active", "Idle", "Offline"] },
      { name: "hardware", label: "Hardware (JSON)", type: "json", help: '[{"component": "...", "spec": "..."}]' },
      { name: "extra", label: "Extra (JSON)", type: "json", help: 'Free-form: {"network": "...", "access": [...], "backup": "...", "failover": "..."}' },
      sortOrderField,
    ],
  },

  "homelab-containers": {
    key: "homelab-containers",
    title: "LXC containers",
    description: "Proxmox containers — new rows appear on the proxmox diagram automatically",
    listPath: "/api/admin/homelab/containers",
    createPath: () => "/api/admin/homelab/containers",
    updatePath: (r) => `/api/admin/homelab/containers/${r.id}`,
    deletePath: (r) => `/api/admin/homelab/containers/${r.id}`,
    listColumns: [
      { header: "Key", field: "containerKey" },
      { header: "Name", field: "name" },
      { header: "IP", field: "ipAddress" },
      { header: "Status", field: "status" },
    ],
    fields: [
      { name: "containerKey", label: "Container key", type: "text", required: true, help: "e.g. lxc-104" },
      { name: "deviceId", label: "Device ID", type: "number", required: true, help: "Numeric id of the Proxmox device" },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "ipAddress", label: "IP address", type: "text" },
      { name: "purpose", label: "Purpose", type: "text" },
      { name: "resources", label: "Resources", type: "text", help: 'e.g. "2C / 4GB"' },
      { name: "status", label: "Status", type: "select", options: ["Active", "Idle", "Offline"] },
      { name: "services", label: "Services", type: "lines", help: "One service per line" },
      sortOrderField,
    ],
  },

  "homelab-services": {
    key: "homelab-services",
    title: "RPi services",
    description: "Docker services on the Raspberry Pi",
    listPath: "/api/admin/homelab/services",
    createPath: () => "/api/admin/homelab/services",
    updatePath: (r) => `/api/admin/homelab/services/${r.id}`,
    deletePath: (r) => `/api/admin/homelab/services/${r.id}`,
    listColumns: [
      { header: "Service", field: "serviceName" },
      { header: "Container", field: "containerName" },
      { header: "Port", field: "hostPort" },
    ],
    fields: [
      { name: "deviceId", label: "Device ID", type: "number", required: true, help: "Numeric id of the RPi device" },
      { name: "serviceName", label: "Service name", type: "text", required: true },
      { name: "containerName", label: "Container name", type: "text" },
      { name: "hostPort", label: "Host port", type: "text" },
      { name: "function", label: "Function", type: "text" },
      sortOrderField,
    ],
  },

  "network-entities": {
    key: "network-entities",
    title: "Network entities",
    description: "ISPs, VLANs, and switches",
    listPath: "/api/admin/homelab/network-entities",
    createPath: () => "/api/admin/homelab/network-entities",
    updatePath: (r) => `/api/admin/homelab/network-entities/${r.id}`,
    deletePath: (r) => `/api/admin/homelab/network-entities/${r.id}`,
    listColumns: [
      { header: "Type", field: "entityType" },
      { header: "Name", field: "name" },
    ],
    fields: [
      { name: "deviceId", label: "Device ID", type: "number", required: true, help: "Numeric id of the network device" },
      { name: "entityType", label: "Type", type: "select", options: ["isp", "vlan", "switch"], required: true },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "spec", label: "Spec (JSON)", type: "json", help: 'e.g. {"subnet": "...", "role": "..."} or {"anchor": "...", "type": "...", "ports": [...]}' },
      sortOrderField,
    ],
  },

  "skill-groups": {
    key: "skill-groups",
    title: "Skill groups",
    description: "Skill categories",
    listPath: "/api/admin/skill-groups",
    createPath: () => "/api/admin/skill-groups",
    updatePath: (r) => `/api/admin/skill-groups/${r.id}`,
    deletePath: (r) => `/api/admin/skill-groups/${r.id}`,
    listColumns: [
      { header: "ID", field: "id" },
      { header: "Category", field: "category" },
      { header: "Icon", field: "icon" },
    ],
    fields: [
      { name: "category", label: "Category", type: "text", required: true },
      { name: "icon", label: "Icon", type: "text", help: "Lucide icon name, e.g. Cloud" },
      sortOrderField,
    ],
  },

  skills: {
    key: "skills",
    title: "Skills",
    description: "Individual skill chips",
    listPath: "/api/admin/skills",
    createPath: () => "/api/admin/skills",
    updatePath: (r) => `/api/admin/skills/${r.id}`,
    deletePath: (r) => `/api/admin/skills/${r.id}`,
    listColumns: [
      { header: "ID", field: "id" },
      { header: "Group", field: "groupId" },
      { header: "Label", field: "label" },
    ],
    fields: [
      { name: "groupId", label: "Group ID", type: "number", required: true },
      { name: "label", label: "Label", type: "text", required: true },
      sortOrderField,
    ],
  },

  academics: {
    key: "academics",
    title: "Academics",
    description: "Degrees, publications, certifications",
    listPath: "/api/academics",
    createPath: () => "/api/admin/academics",
    updatePath: (r) => `/api/admin/academics/${r.id}`,
    deletePath: (r) => `/api/admin/academics/${r.id}`,
    listColumns: [
      { header: "Type", field: "type" },
      { header: "Title", field: "title" },
      { header: "Institution", field: "institution" },
    ],
    fields: [
      { name: "type", label: "Type", type: "select", options: ["Degree", "Publication", "Certification"], required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "date", label: "Date", type: "text", help: 'Display string, e.g. "April 2023"' },
      { name: "description", label: "Description", type: "textarea" },
      { name: "url", label: "URL", type: "text" },
      sortOrderField,
    ],
  },
};

export function getResource(key: string): ResourceConfig | undefined {
  return resources[key];
}

/* Field specs for the non-CRUD admin pages (singleton/upsert forms). */

export const PROFILE_FIELDS: FieldSpec[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "title", label: "Title", type: "text", required: true },
  { name: "tagline", label: "Tagline", type: "text" },
  { name: "location", label: "Location", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "brand", label: "Brand", type: "text" },
  { name: "status", label: "Status", type: "text" },
  { name: "summary", label: "Summary", type: "textarea" },
  { name: "bio", label: "Bio paragraphs", type: "lines", help: "One paragraph per line" },
  { name: "socials", label: "Socials (JSON)", type: "json" },
  { name: "stats", label: "Stats (JSON)", type: "json" },
];

export const DIAGRAM_FIELDS: FieldSpec[] = [
  { name: "direction", label: "Direction", type: "select", options: ["TB", "LR"], required: true },
  { name: "nodes", label: "Nodes (JSON)", type: "json" },
  { name: "edges", label: "Edges (JSON)", type: "json" },
];

export const CASE_STUDY_FIELDS: FieldSpec[] = [
  { name: "client", label: "Client", type: "text" },
  { name: "role", label: "Role", type: "text" },
  { name: "duration", label: "Duration", type: "text" },
  { name: "context", label: "Context (problem inherited)", type: "textarea" },
  { name: "platform", label: "Platform", type: "lines", help: "One tech per line" },
  { name: "metrics", label: "Metrics (JSON)", type: "json", help: '[{"label", "before", "after", "emphasis"}]' },
  { name: "layers", label: "Layers (JSON)", type: "json", help: '[{"title", "tone", "items": [...]}]' },
  { name: "techStack", label: "Tech stack (JSON)", type: "json", help: '[{"layer", "tech"}]' },
];
