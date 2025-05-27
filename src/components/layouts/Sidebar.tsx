"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
} from "@carbon/react";
import { ChevronRight, Menu } from "@carbon/icons-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { sidebarItems } from "@/data/sidebarItems";
import styles from "@/styles/layouts/sidebar.module.scss";

export const Sidebar = () => {
  const { isOpen, toggle } = useSidebar();

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.collapsed : ""}`}>
      <div className={styles.sidebarHeader}>
        {isOpen && (
          <Image
            className={styles.logo}
            src="/images/logo.png"
            alt="Logo"
            width={150}
            height={32}
          />
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
                  <SideNavMenuItem key={sub.name}>
                    <Link href={sub.path}>{sub.name}</Link>
                  </SideNavMenuItem>
                ))}
              </SideNavMenu>
            ) : (
              <SideNavLink
                key={item.id}
                renderIcon={item.icon}
                href={item.href}
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
