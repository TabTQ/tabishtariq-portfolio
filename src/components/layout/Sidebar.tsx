"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navGroups } from "./nav";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { Profile } from "@/lib/types";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar({
  profile,
  onNavigate,
}: {
  profile: Profile;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-bg-2">
      {/* Brand */}
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-3 px-5 py-5"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent font-serif text-lg font-semibold text-bg-2">
          t
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-text">tabish tariq</span>
          <span className="text-[11px] text-text-faint">{profile.title}</span>
        </span>
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="eyebrow px-3 pb-2">{group.title}</div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-surface text-text"
                          : "text-text-muted hover:bg-surface/60 hover:text-text",
                      )}
                    >
                      <Icon
                        name={item.icon}
                        size={17}
                        className={cn(active ? "text-accent" : "text-text-faint")}
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.badge ? (
                        <span className="text-[11px] text-text-faint">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Status footer */}
      <div className="border-t border-border-soft px-5 py-4">
        <div className="eyebrow pb-2">Status</div>
        <div className="flex items-center gap-2 text-sm text-text">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
          </span>
          {profile.status}
        </div>
        <p className="mt-1 text-[11px] text-text-faint">{profile.location}</p>
      </div>
    </div>
  );
}
