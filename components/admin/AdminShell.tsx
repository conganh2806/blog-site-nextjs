import Link from "next/link";

import type { AdminSession } from "@/lib/auth/session";

import { AdminNavigation } from "./AdminNavigation";
import { LogoutButton } from "./LogoutButton";
import styles from "./admin.module.scss";

interface AdminShellProps {
  children: React.ReactNode;
  session: AdminSession;
}

export function AdminShell({ children, session }: AdminShellProps) {
  return (
    <div className={styles.adminShell}>
      <aside className={styles.sidebar}>
        <Link className={styles.adminBrand} href="/admin">
          <span>A</span>
          <strong>Abstract</strong>
        </Link>

        <AdminNavigation />

        <Link className={styles.viewSiteLink} href="/">
          View public site
        </Link>
      </aside>

      <div className={styles.adminMain}>
        <header className={styles.adminHeader}>
          <div className={styles.accountSummary}>
            <span className={styles.avatar} aria-hidden="true">
              AM
            </span>
            <div>
              <strong>{session.name}</strong>
              <span>{session.role}</span>
            </div>
          </div>
          <LogoutButton />
        </header>

        <main className={styles.adminContent}>{children}</main>
      </div>
    </div>
  );
}
