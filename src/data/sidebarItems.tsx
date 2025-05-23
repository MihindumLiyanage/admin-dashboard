import { Dashboard, Task, CarbonIconType } from "@carbon/icons-react";

export type NavItem = {
  id: string;
  label: string;
  icon: CarbonIconType;
  href: string;
  subItems?: {
    name: string;
    path: string;
  }[];
};

export const sidebarItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Dashboard,
    href: "/",
  },
  {
    id: "submissions",
    label: "Submissions",
    icon: Task,
    href: "/submissions",
  },
];
