import type { Experience } from "./types";

export const experiences: Experience[] = [
  {
    slug: "genpact",
    role: "Consultant / Data Engineer",
    company: "Genpact",
    client: "GE Renewables — Wind Energy Data Services",
    duration: "May 2025 – Present",
    location: "New Delhi, India",
    summary:
      "Offshore delivery lead for the Amazon Redshift telemetry pipeline ingesting 10-minute SCADA data from thousands of onshore and offshore wind turbines globally.",
    skills: [
      "Amazon Redshift",
      "PL/pgSQL",
      "Python",
      "psycopg2",
      "AWS S3 / Glue",
      "Redshift Spectrum",
      "MERGE REMOVE DUPLICATES",
    ],
    highlights: [
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
  },
  {
    slug: "tcs-system-engineer",
    role: "System Engineer",
    company: "Tata Consultancy Services",
    client: "GE Renewables — Wind Energy Data Services",
    duration: "Jan 2023 – May 2025",
    location: "Noida, India",
    summary:
      "Owned the monitoring, alerting, and data-quality surface of the same Redshift wind-turbine pipeline — keeping data flows visible, auditable, and self-healing.",
    skills: ["AWS Redshift", "SQL", "PL/pgSQL", "Python", "ServiceNow", "Tableau"],
    highlights: [
      "Built an auto-alerting framework on ServiceNow that scans data health for all contracted sources and raises incidents only for SLA-bound sources — cutting mean-time-to-detect data gaps from hours to minutes.",
      "Developed a source-level Data Coverage dashboard in Tableau surfacing daily completeness per site, turbine, and signal — adopted by operations teams globally as the primary data-health view.",
      "Added root-cause auto-classification into ServiceNow alerts, tagging each incident with its most likely cause (missing mapping, Edge box down, UDF failure, stale source).",
      "Built monitoring procedures covering UDF failures, Edge box health, and source-level health-message telemetry, consolidating ad-hoc scripts into a single operational view.",
      "Improved the data-lake-to-data-lake sync with a stage-table approach that isolated in-flight writes from reader queries, reducing contention and removing partial-write risk.",
    ],
  },
  {
    slug: "tcs-trainee",
    role: "Assistant System Engineer — Trainee",
    company: "Tata Consultancy Services",
    client: "GE Renewables — Wind Energy Data Services",
    duration: "Feb 2022 – Dec 2022",
    location: "Noida, India",
    summary:
      "Joined the GE Renewables data-engineering engagement as a trainee, focused on source onboarding and ETL build-out for the Amazon Redshift / S3 data lakes.",
    skills: ["ETL", "Amazon Redshift", "Amazon S3", "Python", "SQL Server", "Java"],
    highlights: [
      "Configured end-to-end ingestion for new wind-farm data sources — from SCADA source through staging to Redshift data lakes — including schema mapping, validation, and cutover.",
      "Developed Redshift stored procedures that synchronize data between data lakes, unifying daily feeds into a common consumption layer.",
      "Built and debugged a source-to-staging data-movement process, making raw telemetry available for downstream ETL and reporting.",
      "Automated an analysis-and-report pipeline delivering daily data-health summaries, replacing manual Excel compilation.",
      "Improved data-lake coverage by ~30% by onboarding ~6,000 new data sources.",
    ],
  },
];

export function getExperience(slug: string): Experience | undefined {
  return experiences.find((e) => e.slug === slug);
}
