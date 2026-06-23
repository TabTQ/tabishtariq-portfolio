/** Self-hosted homelab: Proxmox node, Raspberry Pi stack, and the home network. */

export const proxmox = {
  name: "Proxmox VE Node",
  summary:
    "Primary compute platform of the homelab — a Proxmox VE 8.x node running ~10 services across isolated LXC containers, and the central backup repository for the entire homelab.",
  hardware: [
    { component: "CPU", spec: "AMD Ryzen 5 5500 (6C/12T @ 3.6GHz, boosts 4.2GHz)" },
    { component: "Memory", spec: "16GB DDR4-3200 (~30% utilization)" },
    { component: "Boot drive", spec: "1TB NVMe SSD — OS & LVM pool" },
    { component: "Data drive", spec: "1TB SATA HDD — media / downloads" },
    { component: "Backup drive", spec: "240GB SSD — dedicated PBS datastore" },
    { component: "OS", spec: "Proxmox VE 8.x (kernel 6.14.x)" },
  ],
  network: "vmbr0 bridge on eth0 · 192.168.10.0/24 · gateway 192.168.10.1",
  containers: [
    {
      id: "lxc-100",
      name: "UbuntuCT",
      ip: "192.168.10.130",
      purpose: "Web & AI Services",
      resources: "2C / 4GB",
      status: "Active",
      services: ["Trilium Notes :8081", "Open WebUI :3001", "Portfolio :3000"],
    },
    {
      id: "lxc-101",
      name: "n8n",
      ip: "192.168.10.105",
      purpose: "Automation",
      resources: "2C / 2GB",
      status: "Active",
      services: ["n8n :5678 (native, systemd)"],
    },
    {
      id: "lxc-102",
      name: "Postgres",
      ip: "192.168.10.198",
      purpose: "Database",
      resources: "2C / 4GB",
      status: "Active",
      services: ["PostgreSQL 15 :5432 (native)"],
    },
    {
      id: "lxc-103",
      name: "Code-Server",
      ip: "192.168.10.113",
      purpose: "Development",
      resources: "4C / 4GB",
      status: "Active",
      services: ["Code-Server :8680 + Tailscale (native)"],
    },
    {
      id: "lxc-210",
      name: "Downloads",
      ip: "192.168.10.131",
      purpose: "Media Stack",
      resources: "4C / 2GB",
      status: "Active",
      services: ["Jellyfin :8096", "JDownloader :5800", "Filebrowser :8080"],
    },
    {
      id: "lxc-211",
      name: "Fabric",
      ip: "192.168.10.197",
      purpose: "AI Research",
      resources: "4C / 8GB",
      status: "Idle",
      services: ["Fabric AI (stopped)"],
    },
    {
      id: "lxc-999",
      name: "PBS",
      ip: "192.168.10.199",
      purpose: "Backups",
      resources: "1C / 2GB",
      status: "Active",
      services: ["Proxmox Backup Server :8007 (native)"],
    },
  ],
  access: [
    "Cloudflare Tunnel → Portfolio (outbound-only, public)",
    "Tailscale → Code-Server (admin mesh VPN)",
  ],
};

export const raspberryPi = {
  name: "Raspberry Pi Monitoring Stack",
  summary:
    "A Dockerized observability and remote-access stack on a Raspberry Pi 4 (8GB). Public services via Cloudflare Tunnel (no open ports); admin over Tailscale. Weekly automated PBS backups to the Proxmox node.",
  hardware: [
    { component: "Model", spec: "Raspberry Pi 4 Model B Rev 1.4" },
    { component: "RAM", spec: "8GB LPDDR4 (~21% used)" },
    { component: "Boot/Root", spec: "64GB USB 3.1 flash drive" },
    { component: "Temp/Swap", spec: "32GB MicroSD" },
    { component: "OS", spec: "Debian 12 (bookworm)" },
    { component: "Host / IP", spec: "tabishrpi4 · 192.168.10.101 · Tailscale 100.118.200.5" },
  ],
  services: [
    { service: "Homepage", container: "homepage", hostPort: "2000", fn: "Main dashboard (public via Cloudflare)" },
    { service: "Portainer", container: "portainer", hostPort: "9000", fn: "Docker management" },
    { service: "Grafana", container: "grafana", hostPort: "3000", fn: "Metrics visualization" },
    { service: "Prometheus", container: "prometheus", hostPort: "9090", fn: "Metric collection" },
    { service: "Node Exporter", container: "node-exporter", hostPort: "9100", fn: "Hardware metrics" },
    { service: "cAdvisor", container: "cadvisor", hostPort: "8080", fn: "Container metrics" },
    { service: "Guacamole", container: "guacamole", hostPort: "8081", fn: "Remote-desktop gateway (VNC/RDP/SSH)" },
    { service: "Cloudflared", container: "cloudflared", hostPort: "60123", fn: "Secure outbound tunnel" },
    { service: "Watchtower", container: "watchtower", hostPort: "—", fn: "Automated image updates" },
    { service: "WOL Server", container: "wol-server", hostPort: "host", fn: "Wake-on-LAN magic packets" },
  ],
  backup:
    "proxmox-backup-client → PBS (192.168.10.199), Sundays 02:00 via crontab.",
};

export const network = {
  name: "Dual-ISP VLAN-Segmented Network",
  summary:
    "A dual-ISP home network on a TP-Link ER605 gateway with bidirectional WAN failover between a 1 Gbps fiber PPPoE link and a 30 Mbps secondary ISP. VLAN 10 (high-speed) and VLAN 20 (IoT / cameras) are segmented across managed and unmanaged switches and WiFi 6 APs.",
  isps: [
    { name: "ISP 1 (Primary)", spec: "1 Gbps Fiber → Fiber-to-RJ45 converter → ER605 WAN 1 (PPPoE)" },
    { name: "ISP 2 (Secondary)", spec: "30 Mbps → ISP Router → ER605 WAN 2 (Dynamic IP)" },
  ],
  vlans: [
    { id: "VLAN 10", subnet: "192.168.10.0/24", role: "High-speed — uses ISP 1 primarily" },
    { id: "VLAN 20", subnet: "192.168.20.0/24", role: "Low-speed / IoT — uses ISP 2 primarily" },
  ],
  failover:
    "Bidirectional: if ISP 1 fails, VLAN 10 uses ISP 2; if ISP 2 fails, VLAN 20 uses ISP 1.",
  switches: [
    {
      name: "TP-Link TL-SG108E",
      type: "8-Port Gigabit · Managed",
      role: "Central VLAN 10 distribution",
      ports: ["P1 ER605 LAN1 uplink", "P2 → room switch", "P3 Raspberry Pi", "P4 Proxmox node", "P5 Brother's PC", "P6 EX220 WiFi 6 AP"],
    },
    {
      name: "TP-Link LS105G",
      type: "5-Port Gigabit · Unmanaged",
      role: "My room switch (VLAN 10)",
      ports: ["Uplink from SG108E P2", "P2 My PC", "P3 AX10 WiFi 6 AP", "P4 Office laptop"],
    },
    {
      name: "Tenda 8-Port",
      type: "100 Mbps · Unmanaged",
      role: "VLAN 20 IoT distribution",
      ports: ["Uplink from ER605 LAN3", "P2 Camera DVR", "P3 Secondary router AP (Floor 2)"],
    },
  ],
};
