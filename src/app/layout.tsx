import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "@xyflow/react/dist/style.css";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { getProfile } from "@/lib/api";

export const dynamic = "force-dynamic";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: {
      default: `${profile.name} — ${profile.title}`,
      template: `%s · ${profile.name}`,
    },
    description: profile.summary,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await getProfile();
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full bg-bg text-text">
        <AppShell profile={profile}>{children}</AppShell>
      </body>
    </html>
  );
}
