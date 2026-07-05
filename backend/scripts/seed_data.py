"""One-time (re-runnable) seed: transcribes the content that used to live in
src/data/*.ts into the portfolio schema. Truncates the content tables first so
it is safe to re-run during development. Also (re)creates the admin UI login
user from ADMIN_USERNAME / ADMIN_PASSWORD in backend/.env.

Run:  .venv/Scripts/python.exe -m scripts.seed_data
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import delete, select

from app.core.config import get_settings
from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models import (
    AcademicItem,
    AdminUser,
    Diagram,
    Experience,
    HomelabContainer,
    HomelabDevice,
    HomelabNetworkEntity,
    HomelabService,
    Profile,
    Project,
    ProjectCaseStudy,
    ProjectDeliverable,
    Skill,
    SkillGroup,
)

# ---------------------------------------------------------------------------
# profile
# ---------------------------------------------------------------------------
PROFILE = dict(
    id=1,
    name="Tabish Tariq",
    title="Data Engineer",
    tagline="AWS & Amazon Redshift · Python ETL · Self-hosted Infra",
    location="New Delhi, India",
    email="tabish.tariq@start3tech.com",
    phone="+91 8802456752",
    brand="StarT3Tech",
    status="open to work",
    socials={
        "github": "https://github.com/TabTQ/",
        "githubLabel": "github.com/TabTQ",
        "linkedin": "https://www.linkedin.com/in/ertabish97/",
        "linkedinLabel": "linkedin.com/in/ertabish97",
    },
    summary=(
        "Data engineer with 4+ years across Genpact and Tata Consultancy Services "
        "delivering Amazon Redshift and Python-based ETL pipelines for large-scale "
        "industrial telemetry workloads."
    ),
    bio=[
        "Data engineer with 4+ years across Genpact and Tata Consultancy Services delivering Amazon Redshift and Python-based ETL pipelines for large-scale industrial telemetry workloads. Currently at Genpact, I led the end-to-end redesign of GE Renewables' global wind-turbine data pipeline — consolidating 21+ legacy stored procedures into a unified, config-driven framework, eliminating chronic deadlocks, and cutting backfill recovery from days to under 2 hours.",
        "I'm comfortable owning a system from requirements through root-cause investigation, performance tuning, testing, and production handover. On the side I run a self-hosted Linux / Docker / Proxmox homelab, and I routinely use AI coding assistants (Claude Code, Gemini CLI, OpenCode) as a force multiplier on design, review, and automation work.",
    ],
    stats=[
        {"label": "Years experience", "value": "4+", "sub": "Genpact · TCS"},
        {"label": "Legacy procs unified", "value": "21→7", "sub": "config-driven framework"},
        {"label": "Backfill recovery", "value": "<2h", "sub": "from days, 1yr of data"},
        {"label": "Self-hosted services", "value": "~20", "sub": "Proxmox + Raspberry Pi"},
    ],
)

# ---------------------------------------------------------------------------
# experiences
# ---------------------------------------------------------------------------
EXPERIENCES = [
    dict(
        slug="genpact",
        role="Consultant / Data Engineer",
        company="Genpact",
        client="GE Renewables — Wind Energy Data Services",
        duration="May 2025 – Present",
        location="New Delhi, India",
        summary="Offshore delivery lead for the Amazon Redshift telemetry pipeline ingesting 10-minute SCADA data from thousands of onshore and offshore wind turbines globally.",
        skills=["Amazon Redshift", "PL/pgSQL", "Python", "psycopg2", "AWS S3 / Glue", "Redshift Spectrum", "MERGE REMOVE DUPLICATES"],
        highlights=[
            "Consolidated 21+ legacy stored procedures across two schema families into 7 unified, parameterized PL/pgSQL procedures, each handling daily loads and multi-year backfills through a single run_type parameter.",
            "Built a production-grade Python ETL orchestration framework (ThreadedConnectionPool + concurrent.futures) with dynamic worker auto-scaling, driving backfill recovery of 1 year of data from days to under 2 hours.",
            "Redesigned a 3.5B-row Channel join and a ~480M-row Statistic join that forced nested-loop execution on an OR predicate; pre-materialized equality lookup tables to enable hash joins, eliminating disk spill and converting both to single-pass execution.",
            "Eliminated chronic production deadlocks by redesigning the lock strategy to hold staging-table locks only and adopting MERGE REMOVE DUPLICATES; zero lock-contention incidents post go-live.",
            "Led a 3-day investigation into a watermark bug in dwf.dwf_10min_s3_load, identifying and recovering 23,784 systematically missing records.",
            "Fixed an OFW Data Coverage dashboard reporting >100% coverage (reaching 200% for dual-schema turbines) by rewriting the procedure against a unified, deduplicated view.",
            "Expanded ECDL analytics coverage from 2 offshore sites to all ~260+ sites streaming ECDL data globally; removed site-level hardcoding so new sites onboard automatically.",
            "Secured the DSL SCADA pipeline by replacing three uncoordinated cron scripts + a separate UDF with a single Python driver — pre-flight UDF status checks, Fernet-encrypted credentials, and data-loss protection.",
            "Authored and executed 216 parallel Prod-vs-QA test cases plus a 50-test mathematical validation of the OFW schema migration; introduced GitHub source control to an engagement that previously had none.",
        ],
        sort_order=0,
    ),
    dict(
        slug="tcs-system-engineer",
        role="System Engineer",
        company="Tata Consultancy Services",
        client="GE Renewables — Wind Energy Data Services",
        duration="Jan 2023 – May 2025",
        location="Noida, India",
        summary="Owned the monitoring, alerting, and data-quality surface of the same Redshift wind-turbine pipeline — keeping data flows visible, auditable, and self-healing.",
        skills=["AWS Redshift", "SQL", "PL/pgSQL", "Python", "ServiceNow", "Tableau"],
        highlights=[
            "Built an auto-alerting framework on ServiceNow that scans data health for all contracted sources and raises incidents only for SLA-bound sources — cutting mean-time-to-detect data gaps from hours to minutes.",
            "Developed a source-level Data Coverage dashboard in Tableau surfacing daily completeness per site, turbine, and signal — adopted by operations teams globally as the primary data-health view.",
            "Added root-cause auto-classification into ServiceNow alerts, tagging each incident with its most likely cause (missing mapping, Edge box down, UDF failure, stale source).",
            "Built monitoring procedures covering UDF failures, Edge box health, and source-level health-message telemetry, consolidating ad-hoc scripts into a single operational view.",
            "Improved the data-lake-to-data-lake sync with a stage-table approach that isolated in-flight writes from reader queries, reducing contention and removing partial-write risk.",
        ],
        sort_order=1,
    ),
    dict(
        slug="tcs-trainee",
        role="Assistant System Engineer — Trainee",
        company="Tata Consultancy Services",
        client="GE Renewables — Wind Energy Data Services",
        duration="Feb 2022 – Dec 2022",
        location="Noida, India",
        summary="Joined the GE Renewables data-engineering engagement as a trainee, focused on source onboarding and ETL build-out for the Amazon Redshift / S3 data lakes.",
        skills=["ETL", "Amazon Redshift", "Amazon S3", "Python", "SQL Server", "Java"],
        highlights=[
            "Configured end-to-end ingestion for new wind-farm data sources — from SCADA source through staging to Redshift data lakes — including schema mapping, validation, and cutover.",
            "Developed Redshift stored procedures that synchronize data between data lakes, unifying daily feeds into a common consumption layer.",
            "Built and debugged a source-to-staging data-movement process, making raw telemetry available for downstream ETL and reporting.",
            "Automated an analysis-and-report pipeline delivering daily data-health summaries, replacing manual Excel compilation.",
            "Improved data-lake coverage by ~30% by onboarding ~6,000 new data sources.",
        ],
        sort_order=2,
    ),
]

# ---------------------------------------------------------------------------
# projects
# ---------------------------------------------------------------------------
REDSHIFT_PROJECT = dict(
    slug="redshift",
    kind="flagship",
    title="Amazon Redshift Pipeline Optimization",
    description="End-to-end redesign and optimization of GE Renewables' global wind-turbine telemetry pipeline on Amazon Redshift — ingesting 10-minute SCADA data from thousands of onshore (ONW) and offshore (OFW) turbines and synchronizing it into Redshift for operations, reporting, and analytics.",
    tags=[],
    sort_order=0,
)

REDSHIFT_CASE_STUDY = dict(
    client="GE Renewables — Wind Energy Data Services",
    role="Data Engineer (Offshore Delivery Lead)",
    duration="2025 – 2026",
    context="The pipeline had years of technical debt: chronic deadlocks, inconsistent deduplication across 21+ siloed stored procedures, sites hardcoded into UDF bodies, data gaps from legacy reject logic, ~260 sites missing from ECDL analytics, and manual backfills that took days to recover from a single outage.",
    platform=["Amazon Redshift", "AWS S3", "AWS Glue", "Secrets Manager", "KMS", "Python 3", "PL/pgSQL"],
    metrics=[
        {"label": "Stored procedures", "before": "21+ across 2 schemas", "after": "7 unified procedures", "emphasis": "accent"},
        {"label": "Backfill recovery (1 yr)", "before": "Days to weeks (manual)", "after": "Under 2 hours (parallel)", "emphasis": "sage"},
        {"label": "Channel/Statistic join", "before": "Nested loop on 3.5B rows, disk spill", "after": "Hash join, single-pass, no spill", "emphasis": "sage"},
        {"label": "Deduplication", "before": "6 inconsistent approaches", "after": "EXCEPT + MERGE, 80% faster", "emphasis": "gold"},
        {"label": "Deadlock incidents", "before": "Chronic — multiple per week", "after": "Zero since go-live", "emphasis": "accent"},
        {"label": "ECDL site coverage", "before": "2 OFW sites", "after": "All ~260+ sites globally", "emphasis": "sage"},
        {"label": "OFW dashboard coverage", "before": ">100% (up to 200%)", "after": "Accurate, deduplicated", "emphasis": "gold"},
        {"label": "Missing records (watermark bug)", "before": "23,784/day silently dropped", "after": "Fixed — zero systematic loss", "emphasis": "accent"},
    ],
    layers=[
        {
            "title": "Layer 1 — S3 Load UDFs",
            "tone": "sage",
            "items": [
                "dwf.dwf_10min_s3_load → Channel + Statistic + CMS Static staging",
                "dwf.dwf_spectrum_s3_load → CMS Spectrum staging",
                "dwf.dwf_ecdl_s3_load → ECDL Channel + Statistic staging",
                "dwf.dwf_event_s3_load → Event staging",
                "grods.dsl_scada_s3_load → DSL Channel + Statistic + Event staging",
            ],
        },
        {
            "title": "Layer 2 — Final-Load Procedures",
            "tone": "accent",
            "items": [
                "ge_opd.final_load_channel",
                "ge_opd.final_load_statistic",
                "ge_opd.final_load_event",
                "ge_opd_ecdl.final_load_ecdl_channel",
                "ge_opd_ecdl.final_load_ecdl_statistic",
                "cms.final_load_cms_spectrum",
                "cms.final_load_cms_static",
            ],
        },
        {
            "title": "Layer 3 — Orchestration",
            "tone": "gold",
            "items": [
                "etl_workflow_final.py — parallel backfill + manifest management",
                "dsl_update.py — DSL consolidation + S3 upload + UDF call",
                "dsl_log_monitor.py — remote S3 log monitoring",
            ],
        },
    ],
    tech_stack=[
        {"layer": "Data Warehouse", "tech": "Amazon Redshift — PL/pgSQL, Spectrum, MERGE, WLM"},
        {"layer": "External Tables", "tech": "AWS Glue Catalog + Redshift Spectrum (Parquet)"},
        {"layer": "Orchestration", "tech": "Python 3 — ThreadPoolExecutor, ThreadedConnectionPool, boto3"},
        {"layer": "Storage", "tech": "Amazon S3 — Parquet, KMS, manifest-based COPY"},
        {"layer": "Secrets", "tech": "AWS Secrets Manager, Fernet symmetric encryption"},
        {"layer": "Scheduling", "tech": "GEMINI (GE internal scheduler)"},
        {"layer": "Version Control", "tech": "GitHub (introduced to the engagement)"},
    ],
)

REDSHIFT_DELIVERABLES = [
    dict(deliverable_key="consolidation", title="7 Unified Final-Load Procedures", tag="PL/pgSQL", sort_order=0,
         body="Replaced 15+ legacy procedures with 7 parameterized procedures. A single run_type parameter (daily, backfill, backfill_dsl, backfill_copy, backfill_copy_dsl) covers daily operations and multi-year backfills using the same validated transformation logic — no divergence, no separate maintenance."),
    dict(deliverable_key="etl-framework", title="Python ETL Orchestration Framework", tag="Python · concurrency", sort_order=1,
         body="etl_workflow_final.py — a thread-safe RedshiftManager (psycopg2.ThreadedConnectionPool) + S3Manager + ETLWorkflow. Dynamic worker auto-scaling sizes the pool from the number of outstanding dates (capped at 25 for the WLM queue). Pre-checks stv_recents for Coreflow conflicts, processes dates in parallel via ThreadPoolExecutor, then bulk COPY FROM MANIFEST. Fully config-driven and dry-run capable."),
    dict(deliverable_key="join-optimization", title="Channel & Statistic Join Optimization", tag="MPP tuning", sort_order=2,
         body="The 3.5B-row Channel join used an OR predicate (sourcesignalid = channel_name OR alt_channel_name), forcing a nested-loop join. Pre-materialized a union-based equality lookup table with aligned DISTKEY/SORTKEY, making the join hash-eligible and single-pass. Same fix applied to the ~480M-row Statistic join. Validated with EXCEPT in both directions — zero data difference."),
    dict(deliverable_key="deadlocks", title="Deadlock & Lock-Strategy Redesign", tag="Concurrency", sort_order=3,
         body="Legacy procedures locked the final table for the entire transformation. The new design locks only the staging table and adopts MERGE REMOVE DUPLICATES, dramatically reducing lock duration. Verified with live concurrency testing against svv_transactions / pg_locks — zero lock-contention incidents post go-live."),
    dict(deliverable_key="ecdl", title="ECDL Expansion & Duplicate Fix", tag="Data quality", sort_order=4,
         body='Expanded ECDL (30-second aggregation) coverage from 2 OFW sites to all ~260+ streaming sites, with a dedicated ge_opd_ecdl schema preventing signal mixing. Root-caused duplicate accumulation from upstream late-arrival inserttimestamp updates; evaluated four approaches and adopted MERGE REMOVE DUPLICATES ("latest value as final value").'),
    dict(deliverable_key="dsl", title="DSL SCADA Update Script", tag="Python · security", sort_order=5,
         body="dsl_update.py replaced three uncoordinated cron scripts + a separate UDF. Adds a pre-flight check of svl_stored_proc_call that blocks S3 re-upload if the prior run was aborted or stale (closing a real data-loss race), Fernet-encrypted credentials, and Prod→QA atomic sync."),
    dict(deliverable_key="monitoring", title="DSL Log Monitor & Duplicate Alerting", tag="Observability", sort_order=6,
         body="dsl_log_monitor.py verifies remote job completion purely from S3 (file age, failure-keyword scan, completion marker) — no SSH to the source EC2. KMS ARNs are regex-masked in logs. A consolidate_duplicate_logs procedure aggregates duplicate detection across all 7 sources and raises a ServiceNow incident when values genuinely conflict."),
    dict(deliverable_key="watermark", title="Missing Records Investigation", tag="Root-cause", sort_order=7,
         body="A 3-day structured investigation (snapshot → re-query Spectrum on the same watermark → dedup → EXCEPT) revealed dwf_10min_s3_load's inserttimestamp watermark logic silently dropped records visible in source. Identified 23,784 missing records across statistic and channel categories; root cause fixed and validated."),
]

SMALL_PROJECTS = [
    dict(slug="algo-trading-bot", kind="small", title="Algo Trading Bot",
         description="A simple algorithmic trading bot built on the Binance API with NumPy and Pandas for signal computation and order logic in Python.",
         tags=["Binance API", "NumPy", "Pandas", "Python"],
         repo_url="https://github.com/TabTQ/Binance-Trading-Bot", type="Automation", sort_order=1),
    dict(slug="greenhouse-irrigation", kind="small", title="Automatic Greenhouse Irrigation",
         description="Fuzzy-logic automation of a greenhouse irrigation system, controlling water flow rate from multiple environmental factors. Basis of two published papers (Springer & MDPI).",
         tags=["Fuzzy Logic", "MATLAB", "Simulink", "Arduino", "C++", "Control Systems"],
         repo_url="https://github.com/TabTQ/Intelligent-Control-of-Irrigation-System-using-Fuzzy-Logic-Controller",
         type="Control Systems", sort_order=2),
    dict(slug="spring-shopping-cart", kind="small", title="Spring Framework Shopping Cart",
         description="A shopping-cart web app built with the Spring framework and Hibernate to demonstrate cart flow and MVC fundamentals.",
         tags=["Java", "Spring", "Hibernate", "JSP"],
         repo_url="https://github.com/TabTQ/Shopping-Cart-Spring-Framework", type="Web App", sort_order=3),
]

# ---------------------------------------------------------------------------
# homelab
# ---------------------------------------------------------------------------
PROXMOX_DEVICE = dict(
    device_key="proxmox-host",
    category="proxmox",
    name="Proxmox VE Node",
    summary="Primary compute platform of the homelab — a Proxmox VE 8.x node running ~10 services across isolated LXC containers, and the central backup repository for the entire homelab.",
    ip_address="192.168.10.100",
    status="Active",
    hardware=[
        {"component": "CPU", "spec": "AMD Ryzen 5 5500 (6C/12T @ 3.6GHz, boosts 4.2GHz)"},
        {"component": "Memory", "spec": "16GB DDR4-3200 (~30% utilization)"},
        {"component": "Boot drive", "spec": "1TB NVMe SSD — OS & LVM pool"},
        {"component": "Data drive", "spec": "1TB SATA HDD — media / downloads"},
        {"component": "Backup drive", "spec": "240GB SSD — dedicated PBS datastore"},
        {"component": "OS", "spec": "Proxmox VE 8.x (kernel 6.14.x)"},
    ],
    extra={
        "network": "vmbr0 bridge on eth0 · 192.168.10.0/24 · gateway 192.168.10.1",
        "access": [
            "Cloudflare Tunnel → Portfolio (outbound-only, public)",
            "Tailscale → Code-Server (admin mesh VPN)",
        ],
    },
    sort_order=0,
)

PROXMOX_CONTAINERS = [
    dict(container_key="lxc-100", name="UbuntuCT", ip_address="192.168.10.130", purpose="Web & AI Services", resources="2C / 4GB", status="Active", services=["Trilium Notes :8081", "Open WebUI :3001", "Portfolio :3000"], sort_order=0),
    dict(container_key="lxc-101", name="n8n", ip_address="192.168.10.105", purpose="Automation", resources="2C / 2GB", status="Active", services=["n8n :5678 (native, systemd)"], sort_order=1),
    dict(container_key="lxc-102", name="Postgres", ip_address="192.168.10.198", purpose="Database", resources="2C / 4GB", status="Active", services=["PostgreSQL 15 :5432 (native)"], sort_order=2),
    dict(container_key="lxc-103", name="Code-Server", ip_address="192.168.10.113", purpose="Development", resources="4C / 4GB", status="Active", services=["Code-Server :8680 + Tailscale (native)"], sort_order=3),
    dict(container_key="lxc-210", name="Downloads", ip_address="192.168.10.131", purpose="Media Stack", resources="4C / 2GB", status="Active", services=["Jellyfin :8096", "JDownloader :5800", "Filebrowser :8080"], sort_order=4),
    dict(container_key="lxc-211", name="Fabric", ip_address="192.168.10.197", purpose="AI Research", resources="4C / 8GB", status="Idle", services=["Fabric AI (stopped)"], sort_order=5),
    dict(container_key="lxc-999", name="PBS", ip_address="192.168.10.199", purpose="Backups", resources="1C / 2GB", status="Active", services=["Proxmox Backup Server :8007 (native)"], sort_order=6),
]

RPI_DEVICE = dict(
    device_key="raspberry-pi",
    category="raspberry_pi",
    name="Raspberry Pi Monitoring Stack",
    summary="A Dockerized observability and remote-access stack on a Raspberry Pi 4 (8GB). Public services via Cloudflare Tunnel (no open ports); admin over Tailscale. Weekly automated PBS backups to the Proxmox node.",
    ip_address="192.168.10.101",
    status="Active",
    hardware=[
        {"component": "Model", "spec": "Raspberry Pi 4 Model B Rev 1.4"},
        {"component": "RAM", "spec": "8GB LPDDR4 (~21% used)"},
        {"component": "Boot/Root", "spec": "64GB USB 3.1 flash drive"},
        {"component": "Temp/Swap", "spec": "32GB MicroSD"},
        {"component": "OS", "spec": "Debian 12 (bookworm)"},
        {"component": "Host / IP", "spec": "tabishrpi4 · 192.168.10.101 · Tailscale 100.118.200.5"},
    ],
    extra={"backup": "proxmox-backup-client → PBS (192.168.10.199), Sundays 02:00 via crontab."},
    sort_order=1,
)

RPI_SERVICES = [
    dict(service_name="Homepage", container_name="homepage", host_port="2000", function="Main dashboard (public via Cloudflare)", sort_order=0),
    dict(service_name="Portainer", container_name="portainer", host_port="9000", function="Docker management", sort_order=1),
    dict(service_name="Grafana", container_name="grafana", host_port="3000", function="Metrics visualization", sort_order=2),
    dict(service_name="Prometheus", container_name="prometheus", host_port="9090", function="Metric collection", sort_order=3),
    dict(service_name="Node Exporter", container_name="node-exporter", host_port="9100", function="Hardware metrics", sort_order=4),
    dict(service_name="cAdvisor", container_name="cadvisor", host_port="8080", function="Container metrics", sort_order=5),
    dict(service_name="Guacamole", container_name="guacamole", host_port="8081", function="Remote-desktop gateway (VNC/RDP/SSH)", sort_order=6),
    dict(service_name="Cloudflared", container_name="cloudflared", host_port="60123", function="Secure outbound tunnel", sort_order=7),
    dict(service_name="Watchtower", container_name="watchtower", host_port="—", function="Automated image updates", sort_order=8),
    dict(service_name="WOL Server", container_name="wol-server", host_port="host", function="Wake-on-LAN magic packets", sort_order=9),
]

NETWORK_DEVICE = dict(
    device_key="home-network",
    category="network",
    name="Dual-ISP VLAN-Segmented Network",
    summary="A dual-ISP home network on a TP-Link ER605 gateway with bidirectional WAN failover between a 1 Gbps fiber PPPoE link and a 30 Mbps secondary ISP. VLAN 10 (high-speed) and VLAN 20 (IoT / cameras) are segmented across managed and unmanaged switches and WiFi 6 APs.",
    extra={
        "failover": "Bidirectional: if ISP 1 fails, VLAN 10 uses ISP 2; if ISP 2 fails, VLAN 20 uses ISP 1."
    },
    sort_order=2,
)

NETWORK_ENTITIES = [
    dict(entity_type="isp", name="ISP 1 (Primary)", spec={"spec": "1 Gbps Fiber → Fiber-to-RJ45 converter → ER605 WAN 1 (PPPoE)"}, sort_order=0),
    dict(entity_type="isp", name="ISP 2 (Secondary)", spec={"spec": "30 Mbps → ISP Router → ER605 WAN 2 (Dynamic IP)"}, sort_order=1),
    dict(entity_type="vlan", name="VLAN 10", spec={"subnet": "192.168.10.0/24", "role": "High-speed — uses ISP 1 primarily"}, sort_order=2),
    dict(entity_type="vlan", name="VLAN 20", spec={"subnet": "192.168.20.0/24", "role": "Low-speed / IoT — uses ISP 2 primarily"}, sort_order=3),
    dict(entity_type="switch", name="TP-Link TL-SG108E", spec={"anchor": "sg108e", "type": "8-Port Gigabit · Managed", "role": "Central VLAN 10 distribution", "ports": ["P1 ER605 LAN1 uplink", "P2 → room switch", "P3 Raspberry Pi", "P4 Proxmox node", "P5 Brother's PC", "P6 EX220 WiFi 6 AP"]}, sort_order=4),
    dict(entity_type="switch", name="TP-Link LS105G", spec={"anchor": "ls105g", "type": "5-Port Gigabit · Unmanaged", "role": "My room switch (VLAN 10)", "ports": ["Uplink from SG108E P2", "P2 My PC", "P3 AX10 WiFi 6 AP", "P4 Office laptop"]}, sort_order=5),
    dict(entity_type="switch", name="Tenda 8-Port", spec={"anchor": "tenda", "type": "100 Mbps · Unmanaged", "role": "VLAN 20 IoT distribution", "ports": ["Uplink from ER605 LAN3", "P2 Camera DVR", "P3 Secondary router AP (Floor 2)"]}, sort_order=6),
]

# ---------------------------------------------------------------------------
# skills
# ---------------------------------------------------------------------------
SKILL_GROUPS = [
    ("Cloud & Data Warehousing", "Cloud", ["Amazon Redshift", "Redshift Spectrum", "AWS S3", "AWS Glue (Catalog & Jobs)", "AWS Secrets Manager", "KMS", "IAM"]),
    ("Languages", "Code", ["Python 3", "SQL", "PL/pgSQL", "Bash"]),
    ("Data Engineering", "Database", ["ETL pipeline design", "MERGE / UPSERT patterns", "MERGE REMOVE DUPLICATES", "EXCEPT-based dedup", "Watermark incremental loads", "DISTKEY / SORTKEY tuning", "MPP query optimization", "Manifest-based bulk loads"]),
    ("Python Ecosystem", "Boxes", ["psycopg2 (ThreadedConnectionPool)", "boto3", "concurrent.futures", "argparse", "configparser", "cryptography (Fernet)"]),
    ("Automation & Orchestration", "Workflow", ["Jenkins", "n8n", "systemd", "cron", "GEMINI scheduler", "ServiceNow integration"]),
    ("Infrastructure & DevOps", "Server", ["Docker / Compose", "Proxmox VE", "LXC containers", "Proxmox Backup Server", "Linux (Debian/Ubuntu)", "Tailscale", "Cloudflare Tunnel", "Prometheus / Grafana", "cAdvisor / Node Exporter"]),
    ("AI-Assisted Development", "Sparkles", ["Claude Code", "Gemini CLI", "OpenCode", "Claude / Gemini / Grok chat"]),
    ("Tooling", "Wrench", ["Git / GitHub", "Confluence", "Jira", "VS Code / Code-Server"]),
]

# ---------------------------------------------------------------------------
# academics
# ---------------------------------------------------------------------------
ACADEMICS = [
    dict(type="Degree", title="M.Tech, Control and Instrumentation", institution="Jamia Millia Islamia, New Delhi", date="2019 – 2023 · CGPA 9.05",
         description='Thesis: "Intelligent Control of Irrigation Systems Using Fuzzy Logic Controller".', sort_order=0),
    dict(type="Degree", title="B.Tech, Electrical Engineering", institution="Jamia Millia Islamia, New Delhi", date="2015 – 2019",
         description="Major in Control Systems. Capstone: density-based traffic control system using the AT89S52 microcontroller.", sort_order=1),
    dict(type="Publication", title="Analysis of Intelligent Control of Irrigation System", institution="Springer, Singapore", date="April 2023",
         description="Study of intelligent control techniques to improve irrigation systems.", url="https://doi.org/10.1007/978-981-19-7993-4_24", sort_order=2),
    dict(type="Publication", title="Intelligent Control of Irrigation Systems Using Fuzzy Logic Controller", institution="MDPI, Basel (Energies)", date="September 2022",
         description="Development of a fuzzy-logic-based control of an irrigation system.", url="https://doi.org/10.3390/en15197199", sort_order=3),
    dict(type="Certification", title="Introduction to Quantum Computing (Qiskit)", institution="Qubit by Qubit / The Coding School — sponsored by IBM Quantum", date="2020 – 2021",
         description="IBM Quantum Global Summer School.", url="https://drive.google.com/file/d/1A_6UPX2BSu54-1LhX63jC7-6rO2Rr27L/view?usp=drivesdk", sort_order=4),
    dict(type="Certification", title="Python (Basic)", institution="HackerRank", date="September 2021", url="https://www.hackerrank.com/certificates/f8ebe76a9cf0", sort_order=5),
    dict(type="Certification", title="Java (Basic)", institution="HackerRank", date="November 2021", url="https://www.hackerrank.com/certificates/a2a0b6d60ed1", sort_order=6),
]

# ---------------------------------------------------------------------------
# diagrams — static JSONB specs. The proxmox diagram stores only its static
# nodes; container nodes/edges are derived per-request from homelab_containers.
# ---------------------------------------------------------------------------
DIAGRAMS = [
    dict(diagram_key="hub", direction="TB",
         nodes=[
             {"id": "me", "kind": "root", "label": "Tabish Tariq", "sublabel": "Data Engineer · Infra", "icon": "CircleUser"},
             {"id": "about", "kind": "domain", "label": "About", "sublabel": "Who I am", "icon": "User", "route": "/about", "accent": "accent"},
             {"id": "experience", "kind": "domain", "label": "Experience", "sublabel": "Genpact · TCS", "icon": "Briefcase", "route": "/experience", "accent": "accent"},
             {"id": "redshift", "kind": "domain", "label": "Flagship Project", "sublabel": "Redshift pipeline", "icon": "Database", "route": "/projects/redshift", "accent": "sage"},
             {"id": "projects", "kind": "domain", "label": "Projects", "sublabel": "Other builds", "icon": "FolderGit2", "route": "/projects", "accent": "sage"},
             {"id": "homelab", "kind": "domain", "label": "Homelab", "sublabel": "Proxmox · RPi · Net", "icon": "Server", "route": "/homelab", "accent": "gold"},
             {"id": "skills", "kind": "domain", "label": "Skills", "sublabel": "Stack & tooling", "icon": "Layers", "route": "/skills", "accent": "blue"},
             {"id": "research", "kind": "domain", "label": "Academics", "sublabel": "Degrees · papers", "icon": "GraduationCap", "route": "/academics", "accent": "blue"},
             {"id": "contact", "kind": "domain", "label": "Contact", "sublabel": "Get in touch", "icon": "Mail", "route": "/contact", "accent": "accent"},
         ],
         edges=[{"id": f"e{i}", "source": "me", "target": t} for i, t in enumerate(
             ["about", "experience", "redshift", "projects", "homelab", "skills", "research", "contact"], start=1)]),
    dict(diagram_key="experience", direction="LR",
         nodes=[
             {"id": "trainee", "kind": "step", "label": "ASE — Trainee", "sublabel": "TCS · 2022", "icon": "Sprout", "route": "/experience/tcs-trainee", "accent": "blue"},
             {"id": "syseng", "kind": "step", "label": "System Engineer", "sublabel": "TCS · 2023–25", "icon": "Activity", "route": "/experience/tcs-system-engineer", "accent": "sage"},
             {"id": "genpact", "kind": "step", "label": "Data Engineer", "sublabel": "Genpact · 2025–", "icon": "Star", "route": "/experience/genpact", "accent": "accent"},
         ],
         edges=[
             {"id": "x1", "source": "trainee", "target": "syseng", "label": "promoted"},
             {"id": "x2", "source": "syseng", "target": "genpact", "label": "moved"},
         ]),
    dict(diagram_key="redshift", direction="TB",
         nodes=[
             {"id": "sources", "kind": "device", "label": "Telemetry Sources", "sublabel": "Edge (DWF) · DSL SCADA", "icon": "Wind"},
             {"id": "layer1", "kind": "service", "label": "Layer 1 — S3 Load UDFs", "sublabel": "source-based staging", "icon": "Download", "accent": "sage"},
             {"id": "layer2", "kind": "service", "label": "Layer 2 — 7 Final-Load Procs", "sublabel": "run_type dispatch", "icon": "GitMerge", "route": "/projects/redshift/consolidation", "accent": "accent"},
             {"id": "layer3", "kind": "service", "label": "Layer 3 — Python Orchestration", "sublabel": "parallel backfill", "icon": "Workflow", "route": "/projects/redshift/etl-framework", "accent": "sage"},
             {"id": "joinopt", "kind": "metric", "label": "Join Optimization", "sublabel": "nested-loop → hash join", "icon": "Gauge", "route": "/projects/redshift/join-optimization", "accent": "gold"},
             {"id": "locks", "kind": "metric", "label": "Lock Redesign", "sublabel": "MERGE REMOVE DUPLICATES", "icon": "Lock", "route": "/projects/redshift/deadlocks", "accent": "gold"},
             {"id": "final", "kind": "storage", "label": "Final Tables", "sublabel": "ge_opd.*_data_f_rs", "icon": "Table2", "accent": "blue"},
             {"id": "dash", "kind": "storage", "label": "Tableau Dashboards", "sublabel": "ops & coverage", "icon": "BarChart3", "accent": "blue"},
         ],
         edges=[
             {"id": "r1", "source": "sources", "target": "layer1"},
             {"id": "r2", "source": "layer1", "target": "layer2"},
             {"id": "r3", "source": "layer2", "target": "final"},
             {"id": "r4", "source": "final", "target": "dash"},
             {"id": "r5", "source": "layer3", "target": "layer2", "label": "orchestrates", "dashed": True},
             {"id": "r6", "source": "joinopt", "target": "layer2", "dashed": True},
             {"id": "r7", "source": "locks", "target": "layer2", "dashed": True},
         ]),
    dict(diagram_key="proxmox", direction="TB",
         nodes=[
             {"id": "access", "kind": "device", "label": "External Access", "sublabel": "Cloudflare Tunnel · Tailscale", "icon": "Globe", "accent": "blue"},
             {"id": "host", "kind": "root", "label": "Proxmox Host", "sublabel": "192.168.10.100 · Ryzen 5 5500", "icon": "Server"},
             {"id": "nvme", "kind": "storage", "label": "NVMe SSD", "sublabel": "OS & VMs", "icon": "HardDrive", "accent": "blue"},
             {"id": "sata", "kind": "storage", "label": "SATA HDD", "sublabel": "Media / Data", "icon": "HardDrive", "accent": "blue"},
             {"id": "ssd", "kind": "storage", "label": "Backup SSD", "sublabel": "PBS datastore", "icon": "HardDrive", "accent": "blue"},
         ],
         edges=[
             {"id": "p0", "source": "access", "target": "host"},
             {"id": "ps1", "source": "lxc-100", "target": "nvme", "dashed": True},
             {"id": "ps2", "source": "lxc-210", "target": "sata", "dashed": True},
             {"id": "ps3", "source": "lxc-999", "target": "ssd", "dashed": True},
             {"id": "ps4", "source": "lxc-101", "target": "lxc-102", "label": "uses", "dashed": True},
         ]),
    dict(diagram_key="rpi", direction="TB",
         nodes=[
             {"id": "internet", "kind": "device", "label": "Internet", "sublabel": "public users", "icon": "Globe", "accent": "blue"},
             {"id": "cf", "kind": "service", "label": "Cloudflare Tunnel", "sublabel": "outbound-only", "icon": "Shield", "route": "#cloudflared", "accent": "sage"},
             {"id": "tailscale", "kind": "device", "label": "Tailscale VPN", "sublabel": "admin mesh", "icon": "Network", "accent": "blue"},
             {"id": "rpi", "kind": "root", "label": "Raspberry Pi 4", "sublabel": "tabishrpi4 · 192.168.10.101", "icon": "Cpu"},
             {"id": "homepage", "kind": "service", "label": "Homepage", "sublabel": "dashboard :2000", "icon": "LayoutDashboard", "route": "#homepage", "accent": "accent"},
             {"id": "guac", "kind": "service", "label": "Guacamole", "sublabel": "remote desktop :8081", "icon": "MonitorSmartphone", "route": "#guacamole", "accent": "sage"},
             {"id": "mon", "kind": "service", "label": "Monitoring Stack", "sublabel": "Prometheus · Grafana", "icon": "Activity", "route": "#grafana", "accent": "gold"},
             {"id": "portainer", "kind": "service", "label": "Portainer", "sublabel": "docker mgmt :9000", "icon": "Box", "route": "#portainer", "accent": "sage"},
             {"id": "pbs", "kind": "storage", "label": "PBS Backup", "sublabel": "Sundays 02:00", "icon": "Archive", "accent": "blue"},
         ],
         edges=[
             {"id": "rp1", "source": "internet", "target": "cf"},
             {"id": "rp2", "source": "cf", "target": "homepage"},
             {"id": "rp3", "source": "cf", "target": "guac"},
             {"id": "rp4", "source": "tailscale", "target": "rpi"},
             {"id": "rp5", "source": "rpi", "target": "portainer"},
             {"id": "rp6", "source": "rpi", "target": "mon"},
             {"id": "rp7", "source": "rpi", "target": "homepage", "dashed": True},
             {"id": "rp8", "source": "rpi", "target": "guac", "dashed": True},
             {"id": "rp9", "source": "rpi", "target": "pbs", "label": "backup", "dashed": True},
         ]),
    dict(diagram_key="network", direction="TB",
         nodes=[
             {"id": "isp1", "kind": "device", "label": "ISP 1 — Fiber", "sublabel": "1 Gbps · PPPoE", "icon": "Wifi", "accent": "sage"},
             {"id": "isp2", "kind": "device", "label": "ISP 2", "sublabel": "30 Mbps · Dynamic", "icon": "Wifi", "accent": "gold"},
             {"id": "er605", "kind": "root", "label": "TP-Link ER605", "sublabel": "dual-WAN failover", "icon": "Router"},
             {"id": "vlan10", "kind": "group", "label": "VLAN 10", "sublabel": "192.168.10.0/24 · high-speed", "icon": "Layers", "accent": "sage"},
             {"id": "vlan20", "kind": "group", "label": "VLAN 20", "sublabel": "192.168.20.0/24 · IoT", "icon": "Layers", "accent": "gold"},
             {"id": "sg108e", "kind": "service", "label": "TL-SG108E", "sublabel": "8-port managed", "icon": "Network", "route": "#sg108e", "accent": "sage"},
             {"id": "ls105g", "kind": "service", "label": "LS105G", "sublabel": "room switch", "icon": "Network", "route": "#ls105g", "accent": "sage"},
             {"id": "tenda", "kind": "service", "label": "Tenda 8-Port", "sublabel": "100 Mbps IoT", "icon": "Network", "route": "#tenda", "accent": "gold"},
             {"id": "lab", "kind": "device", "label": "Homelab Nodes", "sublabel": "Proxmox · RPi · PCs", "icon": "Server", "accent": "blue"},
             {"id": "iot", "kind": "device", "label": "Cameras / IoT", "sublabel": "DVR · Floor-2 AP", "icon": "Cctv", "accent": "blue"},
         ],
         edges=[
             {"id": "n1", "source": "isp1", "target": "er605", "label": "WAN 1"},
             {"id": "n2", "source": "isp2", "target": "er605", "label": "WAN 2"},
             {"id": "n3", "source": "er605", "target": "vlan10"},
             {"id": "n4", "source": "er605", "target": "vlan20"},
             {"id": "n5", "source": "vlan10", "target": "sg108e"},
             {"id": "n6", "source": "sg108e", "target": "ls105g"},
             {"id": "n7", "source": "sg108e", "target": "lab"},
             {"id": "n8", "source": "vlan20", "target": "tenda"},
             {"id": "n9", "source": "tenda", "target": "iot"},
         ]),
    dict(diagram_key="skills", direction="TB",
         nodes=[
             {"id": "core", "kind": "root", "label": "Skill Stack", "sublabel": "8 domains", "icon": "Layers"},
             {"id": "s-cloud", "kind": "domain", "label": "Cloud & Data WH", "icon": "Cloud", "route": "#cat-0", "accent": "accent"},
             {"id": "s-lang", "kind": "domain", "label": "Languages", "icon": "Code", "route": "#cat-1", "accent": "sage"},
             {"id": "s-de", "kind": "domain", "label": "Data Engineering", "icon": "Database", "route": "#cat-2", "accent": "accent"},
             {"id": "s-py", "kind": "domain", "label": "Python Ecosystem", "icon": "Boxes", "route": "#cat-3", "accent": "sage"},
             {"id": "s-auto", "kind": "domain", "label": "Orchestration", "icon": "Workflow", "route": "#cat-4", "accent": "gold"},
             {"id": "s-infra", "kind": "domain", "label": "Infra & DevOps", "icon": "Server", "route": "#cat-5", "accent": "gold"},
             {"id": "s-ai", "kind": "domain", "label": "AI-Assisted Dev", "icon": "Sparkles", "route": "#cat-6", "accent": "blue"},
             {"id": "s-tools", "kind": "domain", "label": "Tooling", "icon": "Wrench", "route": "#cat-7", "accent": "blue"},
         ],
         edges=[{"id": f"k{i}", "source": "core", "target": t} for i, t in enumerate(
             ["s-cloud", "s-lang", "s-de", "s-py", "s-auto", "s-infra", "s-ai", "s-tools"], start=1)]),
    dict(diagram_key="homelab", direction="TB",
         nodes=[
             {"id": "lab", "kind": "root", "label": "Homelab", "sublabel": "self-hosted platform", "icon": "Server"},
             {"id": "pve", "kind": "domain", "label": "Proxmox Node", "sublabel": "~10 LXC services", "icon": "Boxes", "route": "/homelab/proxmox", "accent": "accent"},
             {"id": "rpi", "kind": "domain", "label": "Raspberry Pi", "sublabel": "observability + access", "icon": "Cpu", "route": "/homelab/raspberry-pi", "accent": "sage"},
             {"id": "net", "kind": "domain", "label": "Home Network", "sublabel": "dual-ISP · VLANs", "icon": "Network", "route": "/homelab/network", "accent": "gold"},
         ],
         edges=[
             {"id": "h1", "source": "lab", "target": "pve"},
             {"id": "h2", "source": "lab", "target": "rpi"},
             {"id": "h3", "source": "lab", "target": "net"},
         ]),
]


def seed() -> None:
    settings = get_settings()
    db = SessionLocal()
    try:
        # Children first, then parents (FK order).
        for model in (
            Skill, SkillGroup,
            ProjectDeliverable, ProjectCaseStudy, Project,
            HomelabContainer, HomelabService, HomelabNetworkEntity, HomelabDevice,
            Experience, AcademicItem, Diagram, Profile,
        ):
            db.execute(delete(model))

        db.add(Profile(**PROFILE))
        db.add_all(Experience(**e) for e in EXPERIENCES)

        redshift = Project(**REDSHIFT_PROJECT)
        redshift.case_study = ProjectCaseStudy(**REDSHIFT_CASE_STUDY)
        redshift.deliverables = [ProjectDeliverable(**d) for d in REDSHIFT_DELIVERABLES]
        db.add(redshift)
        db.add_all(Project(**p) for p in SMALL_PROJECTS)

        pve = HomelabDevice(**PROXMOX_DEVICE)
        pve.containers = [HomelabContainer(**c) for c in PROXMOX_CONTAINERS]
        rpi = HomelabDevice(**RPI_DEVICE)
        rpi.services = [HomelabService(**s) for s in RPI_SERVICES]
        net = HomelabDevice(**NETWORK_DEVICE)
        net.network_entities = [HomelabNetworkEntity(**n) for n in NETWORK_ENTITIES]
        db.add_all([pve, rpi, net])

        for order, (category, icon, skills) in enumerate(SKILL_GROUPS):
            group = SkillGroup(category=category, icon=icon, sort_order=order)
            group.skills = [Skill(label=label, sort_order=i) for i, label in enumerate(skills)]
            db.add(group)

        db.add_all(AcademicItem(**a) for a in ACADEMICS)
        db.add_all(Diagram(**d) for d in DIAGRAMS)

        # Admin UI login user from env (never committed).
        if settings.admin_username and settings.admin_password:
            existing = db.scalar(
                select(AdminUser).where(AdminUser.username == settings.admin_username)
            )
            if existing:
                existing.password_hash = hash_password(settings.admin_password)
            else:
                db.add(
                    AdminUser(
                        username=settings.admin_username,
                        password_hash=hash_password(settings.admin_password),
                    )
                )

        db.commit()
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
