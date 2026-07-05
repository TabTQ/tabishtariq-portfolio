import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import type { Profile } from "@/lib/types";

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-border-soft px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 text-xs text-text-faint sm:flex-row sm:items-center">
        <p>
          © {new Date().getFullYear()} {profile.brand} · PostgreSQL + FastAPI +
          Next.js, React Flow & a self-hosted homelab.
        </p>
        <div className="flex items-center gap-4">
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-text"
          >
            <GithubIcon size={14} /> GitHub
          </a>
          <a
            href={profile.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-text"
          >
            <LinkedinIcon size={14} /> LinkedIn
          </a>
          <Link
            href="/contact"
            className="flex items-center gap-1.5 hover:text-text"
          >
            <Mail size={14} /> Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
