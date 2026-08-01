"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { DashboardResponse } from "@/lib/content/types";

import styles from "./admin.module.scss";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export function AdminDashboard() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadDashboard() {
      try {
        const response = await fetch("/api/dashboard", { cache: "no-store" });
        if (!response.ok) throw new Error();
        const result = (await response.json()) as DashboardResponse;
        if (isActive) setDashboard(result);
      } catch {
        if (isActive) setError("Dashboard data could not be loaded from the simulated API.");
      }
    }

    void loadDashboard();
    return () => { isActive = false; };
  }, []);

  const stats = dashboard ? [
    { label: "Published posts", value: dashboard.stats.published, trend: "Visible on the front page" },
    { label: "Drafts", value: dashboard.stats.drafts, trend: "Private to administrators" },
    { label: "Scheduled", value: dashboard.stats.scheduled, trend: "Awaiting publication" },
    { label: "Categories", value: dashboard.stats.categories, trend: "Active content topics" },
  ] : [];

  return (
    <>
      <div className={styles.pageHeading}>
        <div><span className={styles.eyebrow}>Live API snapshot</span><h1>Overview</h1><p>Here is what is happening with Abstract today.</p></div>
        <Link className={styles.newPostButton} href="/admin/posts">Manage posts</Link>
      </div>

      {error ? <p className={styles.formError} role="alert">{error}</p> : null}
      <section className={styles.statsGrid} aria-label="Publishing statistics">
        {dashboard ? stats.map((stat) => <article className={styles.statCard} key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong><small>{stat.trend}</small></article>) :
          [1, 2, 3, 4].map((item) => <article className={`${styles.statCard} ${styles.loadingCard}`} key={item} aria-hidden="true" />)}
      </section>

      <section className={styles.contentCard}>
        <div className={styles.cardHeader}><h2>Recent posts</h2><Link href="/admin/posts">View all posts</Link></div>
        {dashboard ? (
          <div className={styles.tableScroll}>
            <table className={styles.postsTable}>
              <thead><tr><th scope="col">Title</th><th scope="col">Category</th><th scope="col">Status</th><th scope="col">Updated</th></tr></thead>
              <tbody>{dashboard.recentPosts.map((post) => <tr key={post.id}><td>{post.title}</td><td>{post.categories.map((category) => category.name).join(", ") || "Uncategorized"}</td><td><span className={`${styles.status} ${post.status === "Draft" ? styles.statusDraft : ""} ${post.status === "Scheduled" ? styles.statusScheduled : ""}`}>{post.status}</span></td><td>{formatDate(post.updatedAt)}</td></tr>)}</tbody>
            </table>
          </div>
        ) : <div className={styles.noResults}><strong>Loading dashboard…</strong><span>Reading live content totals.</span></div>}
      </section>
    </>
  );
}
