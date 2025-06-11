"use client";

import React from "react";
import { useRouter } from "next/navigation";
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

export const Sidebar = React.memo(() => {
  const { isOpen, toggle } = useSidebar();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

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
            priority
          />
        )}

        <button
          onClick={() => toggle()}
          className={styles.toggleButton}
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <Menu size={20} />
          ) : (
            <ChevronRight size={20} style={{ marginLeft: "8px" }} />
          )}
        </button>
      </div>
      <SideNav
        isRail={!isOpen}
        expanded={isOpen}
        isPersistent
        aria-label="Side navigation"
        addFocusListeners={false}
        addMouseListeners={false}
      >
        <SideNavItems>
          {sidebarItems?.length ? (
            sidebarItems.map((item) => (
              <div
                key={item.id}
                style={{ marginBottom: "1rem", marginLeft: "0.1rem" }}
              >
                {item.subItems ? (
                  <SideNavMenu title={item.label} renderIcon={item.icon}>
                    {item.subItems.map((sub) => (
                      <SideNavMenuItem key={sub.name}>
                        <a
                          href={sub.path}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavigation(sub.path);
                          }}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {sub.name}
                        </a>
                      </SideNavMenuItem>
                    ))}
                  </SideNavMenu>
                ) : (
                  <SideNavLink
                    renderIcon={item.icon}
                    onClick={() => handleNavigation(item.href)}
                  >
                    {item.label}
                  </SideNavLink>
                )}
              </div>
            ))
          ) : (
            <SideNavLink onClick={() => handleNavigation("/home")}>
              Home
            </SideNavLink>
          )}
        </SideNavItems>
      </SideNav>
    </aside>
  );
});
