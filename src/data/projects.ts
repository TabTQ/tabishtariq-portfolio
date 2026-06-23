import type { Metric, SmallProject } from "./types";

/** Flagship project: Amazon Redshift pipeline optimization for GE Renewables. */
export const redshift = {
  title: "Amazon Redshift Pipeline Optimization",
  client: "GE Renewables — Wind Energy Data Services",
  role: "Data Engineer (Offshore Delivery Lead)",
  duration: "2025 – 2026",
  platform: ["Amazon Redshift", "AWS S3", "AWS Glue", "Secrets Manager", "KMS", "Python 3", "PL/pgSQL"],
  summary:
    "End-to-end redesign and optimization of GE Renewables' global wind-turbine telemetry pipeline on Amazon Redshift — ingesting 10-minute SCADA data from thousands of onshore (ONW) and offshore (OFW) turbines and synchronizing it into Redshift for operations, reporting, and analytics.",
  context:
    "The pipeline had years of technical debt: chronic deadlocks, inconsistent deduplication across 21+ siloed stored procedures, sites hardcoded into UDF bodies, data gaps from legacy reject logic, ~260 sites missing from ECDL analytics, and manual backfills that took days to recover from a single outage.",

  metrics: [
    { label: "Stored procedures", before: "21+ across 2 schemas", after: "7 unified procedures", emphasis: "accent" },
    { label: "Backfill recovery (1 yr)", before: "Days to weeks (manual)", after: "Under 2 hours (parallel)", emphasis: "sage" },
    { label: "Channel/Statistic join", before: "Nested loop on 3.5B rows, disk spill", after: "Hash join, single-pass, no spill", emphasis: "sage" },
    { label: "Deduplication", before: "6 inconsistent approaches", after: "EXCEPT + MERGE, 80% faster", emphasis: "gold" },
    { label: "Deadlock incidents", before: "Chronic — multiple per week", after: "Zero since go-live", emphasis: "accent" },
    { label: "ECDL site coverage", before: "2 OFW sites", after: "All ~260+ sites globally", emphasis: "sage" },
    { label: "OFW dashboard coverage", before: ">100% (up to 200%)", after: "Accurate, deduplicated", emphasis: "gold" },
    { label: "Missing records (watermark bug)", before: "23,784/day silently dropped", after: "Fixed — zero systematic loss", emphasis: "accent" },
  ] satisfies Metric[],

  // Deliverable deep-dives — surfaced as clickable nodes on the project map.
  deliverables: [
    {
      id: "consolidation",
      title: "7 Unified Final-Load Procedures",
      tag: "PL/pgSQL",
      body: "Replaced 15+ legacy procedures with 7 parameterized procedures. A single run_type parameter (daily, backfill, backfill_dsl, backfill_copy, backfill_copy_dsl) covers daily operations and multi-year backfills using the same validated transformation logic — no divergence, no separate maintenance.",
    },
    {
      id: "etl-framework",
      title: "Python ETL Orchestration Framework",
      tag: "Python · concurrency",
      body: "etl_workflow_final.py — a thread-safe RedshiftManager (psycopg2.ThreadedConnectionPool) + S3Manager + ETLWorkflow. Dynamic worker auto-scaling sizes the pool from the number of outstanding dates (capped at 25 for the WLM queue). Pre-checks stv_recents for Coreflow conflicts, processes dates in parallel via ThreadPoolExecutor, then bulk COPY FROM MANIFEST. Fully config-driven and dry-run capable.",
    },
    {
      id: "join-optimization",
      title: "Channel & Statistic Join Optimization",
      tag: "MPP tuning",
      body: "The 3.5B-row Channel join used an OR predicate (sourcesignalid = channel_name OR alt_channel_name), forcing a nested-loop join. Pre-materialized a union-based equality lookup table with aligned DISTKEY/SORTKEY, making the join hash-eligible and single-pass. Same fix applied to the ~480M-row Statistic join. Validated with EXCEPT in both directions — zero data difference.",
    },
    {
      id: "deadlocks",
      title: "Deadlock & Lock-Strategy Redesign",
      tag: "Concurrency",
      body: "Legacy procedures locked the final table for the entire transformation. The new design locks only the staging table and adopts MERGE REMOVE DUPLICATES, dramatically reducing lock duration. Verified with live concurrency testing against svv_transactions / pg_locks — zero lock-contention incidents post go-live.",
    },
    {
      id: "ecdl",
      title: "ECDL Expansion & Duplicate Fix",
      tag: "Data quality",
      body: "Expanded ECDL (30-second aggregation) coverage from 2 OFW sites to all ~260+ streaming sites, with a dedicated ge_opd_ecdl schema preventing signal mixing. Root-caused duplicate accumulation from upstream late-arrival inserttimestamp updates; evaluated four approaches and adopted MERGE REMOVE DUPLICATES (\"latest value as final value\").",
    },
    {
      id: "dsl",
      title: "DSL SCADA Update Script",
      tag: "Python · security",
      body: "dsl_update.py replaced three uncoordinated cron scripts + a separate UDF. Adds a pre-flight check of svl_stored_proc_call that blocks S3 re-upload if the prior run was aborted or stale (closing a real data-loss race), Fernet-encrypted credentials, and Prod→QA atomic sync.",
    },
    {
      id: "monitoring",
      title: "DSL Log Monitor & Duplicate Alerting",
      tag: "Observability",
      body: "dsl_log_monitor.py verifies remote job completion purely from S3 (file age, failure-keyword scan, completion marker) — no SSH to the source EC2. KMS ARNs are regex-masked in logs. A consolidate_duplicate_logs procedure aggregates duplicate detection across all 7 sources and raises a ServiceNow incident when values genuinely conflict.",
    },
    {
      id: "watermark",
      title: "Missing Records Investigation",
      tag: "Root-cause",
      body: "A 3-day structured investigation (snapshot → re-query Spectrum on the same watermark → dedup → EXCEPT) revealed dwf_10min_s3_load's inserttimestamp watermark logic silently dropped records visible in source. Identified 23,784 missing records across statistic and channel categories; root cause fixed and validated.",
    },
  ],

  // 3-layer architecture (used to build the project SystemMap).
  layers: {
    layer1: [
      "dwf.dwf_10min_s3_load → Channel + Statistic + CMS Static staging",
      "dwf.dwf_spectrum_s3_load → CMS Spectrum staging",
      "dwf.dwf_ecdl_s3_load → ECDL Channel + Statistic staging",
      "dwf.dwf_event_s3_load → Event staging",
      "grods.dsl_scada_s3_load → DSL Channel + Statistic + Event staging",
    ],
    layer2: [
      "ge_opd.final_load_channel",
      "ge_opd.final_load_statistic",
      "ge_opd.final_load_event",
      "ge_opd_ecdl.final_load_ecdl_channel",
      "ge_opd_ecdl.final_load_ecdl_statistic",
      "cms.final_load_cms_spectrum",
      "cms.final_load_cms_static",
    ],
    layer3: [
      "etl_workflow_final.py — parallel backfill + manifest management",
      "dsl_update.py — DSL consolidation + S3 upload + UDF call",
      "dsl_log_monitor.py — remote S3 log monitoring",
    ],
  },

  techStack: [
    { layer: "Data Warehouse", tech: "Amazon Redshift — PL/pgSQL, Spectrum, MERGE, WLM" },
    { layer: "External Tables", tech: "AWS Glue Catalog + Redshift Spectrum (Parquet)" },
    { layer: "Orchestration", tech: "Python 3 — ThreadPoolExecutor, ThreadedConnectionPool, boto3" },
    { layer: "Storage", tech: "Amazon S3 — Parquet, KMS, manifest-based COPY" },
    { layer: "Secrets", tech: "AWS Secrets Manager, Fernet symmetric encryption" },
    { layer: "Scheduling", tech: "GEMINI (GE internal scheduler)" },
    { layer: "Version Control", tech: "GitHub (introduced to the engagement)" },
  ],
};

export function getDeliverable(id: string) {
  return redshift.deliverables.find((d) => d.id === id);
}

/** Smaller / earlier projects. */
export const smallProjects: SmallProject[] = [
  {
    id: "algo-trading-bot",
    title: "Algo Trading Bot",
    description:
      "A simple algorithmic trading bot built on the Binance API with NumPy and Pandas for signal computation and order logic in Python.",
    tags: ["Binance API", "NumPy", "Pandas", "Python"],
    repoUrl: "https://github.com/TabTQ/Binance-Trading-Bot",
    type: "Automation",
  },
  {
    id: "greenhouse-irrigation",
    title: "Automatic Greenhouse Irrigation",
    description:
      "Fuzzy-logic automation of a greenhouse irrigation system, controlling water flow rate from multiple environmental factors. Basis of two published papers (Springer & MDPI).",
    tags: ["Fuzzy Logic", "MATLAB", "Simulink", "Arduino", "C++", "Control Systems"],
    repoUrl:
      "https://github.com/TabTQ/Intelligent-Control-of-Irrigation-System-using-Fuzzy-Logic-Controller",
    type: "Control Systems",
  },
  {
    id: "spring-shopping-cart",
    title: "Spring Framework Shopping Cart",
    description:
      "A shopping-cart web app built with the Spring framework and Hibernate to demonstrate cart flow and MVC fundamentals.",
    tags: ["Java", "Spring", "Hibernate", "JSP"],
    repoUrl: "https://github.com/TabTQ/Shopping-Cart-Spring-Framework",
    type: "Web App",
  },
];

export function getSmallProject(id: string) {
  return smallProjects.find((p) => p.id === id);
}
