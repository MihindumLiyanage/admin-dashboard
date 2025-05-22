"use client";

import React from "react";
import Image from "next/image";
import {
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
} from "@carbon/react";
import { ChevronRight, Menu } from "@carbon/icons-react";
import { useSidebar } from "../../contexts/SidebarContext";
import { sidebarItems } from "../../data/sidebarItems";
import styles from "./Sidebar.module.scss";

export const Sidebar = () => {
  const { isOpen, toggle } = useSidebar();

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.collapsed : ""}`}>
      <div className={styles.sidebarHeader}>
        {isOpen && (
          <Image src="/images/logo.png" alt="Logo" width={150} height={32} />
        )}
        <button
          onClick={() => toggle()}
          className={styles.toggleButton}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <Menu size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <SideNav
        className={styles.sideNav}
        isRail={!isOpen}
        expanded={isOpen}
        isPersistent
        aria-label="Side navigation"
        addFocusListeners={false}
        addMouseListeners={false}
      >
        <SideNavItems>
          {sidebarItems.map((item) =>
            item.subItems ? (
              <SideNavMenu
                key={item.id}
                title={item.label}
                renderIcon={item.icon}
              >
                {item.subItems.map((sub) => (
                  <SideNavMenuItem href={sub.path} key={sub.name}>
                    {sub.name}
                  </SideNavMenuItem>
                ))}
              </SideNavMenu>
            ) : (
              <SideNavLink
                key={item.id}
                href={item.href}
                renderIcon={item.icon}
              >
                {item.label}
              </SideNavLink>
            )
          )}
        </SideNavItems>
      </SideNav>
    </aside>
  );
};
