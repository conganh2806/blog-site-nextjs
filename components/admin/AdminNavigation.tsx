"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./admin.module.scss";

const navigation = [
  { href: "/admin", label: "Overview", icon: "grid" },
  { href: "/admin/posts", label: "Posts", icon: "file" },
  { href: "/admin/categories", label: "Categories", icon: "tag" },
] as const;

function NavigationIcon({ name }: { name: (typeof navigation)[number]["icon"] }) {
  if (name === "file") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6.75 3.75h7.5l3 3v13.5H6.75zM14.25 3.75v3h3M9.5 11h5M9.5 15h5" />
      </svg>
    );
  }

  if (name === "tag") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="m4 12.5 8.5 8.5 8-8V4H12z" /><circle cx="15.5" cy="8.5" r="1.25" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  );
}

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation">
      <p>Workspace</p>
      <ul>
        {navigation.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                className={isActive ? styles.activeNavLink : undefined}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
              >
                <span><NavigationIcon name={item.icon} /></span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
