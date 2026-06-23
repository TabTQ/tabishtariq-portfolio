export interface NavItem {
  label: string;
  href: string;
  icon: string; // lucide icon name
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    title: "Workspace",
    items: [
      { label: "Dashboard", href: "/", icon: "LayoutDashboard", badge: "home" },
      { label: "About", href: "/about", icon: "User" },
      { label: "Experience", href: "/experience", icon: "Briefcase", badge: "3" },
      { label: "Projects", href: "/projects", icon: "FolderGit2" },
      { label: "Homelab", href: "/homelab", icon: "Server" },
      { label: "Skills", href: "/skills", icon: "Layers" },
    ],
  },
  {
    title: "Quick",
    items: [
      { label: "Academics", href: "/academics", icon: "GraduationCap" },
      { label: "Contact", href: "/contact", icon: "Mail" },
    ],
  },
];
