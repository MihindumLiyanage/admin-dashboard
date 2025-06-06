import { Dashboard, Task, CarbonIconType, Time } from "@carbon/icons-react";

export type SidebarItem = {
  id: string;
  label: string;
  icon: CarbonIconType;
  href: string;
  subItems?: {
    name: string;
    path: string;
  }[];
};

export const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Dashboard,
    href: "/home",
  },
  {
    id: "submissions",
    label: "Submissions",
    icon: Task,
    href: "/submissions",
  },
  {
    id: "activity",
    label: "Activity",
    icon: Time,
    href: "/activity",
  },
];
