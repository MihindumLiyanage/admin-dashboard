import {
  Dashboard,
  Settings,
  UserMultiple,
  ReportData,
  CarbonIconType,
} from "@carbon/icons-react";

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
    id: "users",
    label: "Users",
    icon: UserMultiple,
    href: "/users",
    subItems: [
      { name: "All Users", path: "/users/all" },
      { name: "Add User", path: "/users/add" },
      { name: "User Reports", path: "/users/reports" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: ReportData,
    href: "/reports",
    subItems: [
      { name: "Monthly", path: "/reports/monthly" },
      { name: "Annual", path: "/reports/annual" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];
