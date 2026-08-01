"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import type { CategoryWithCount, ContentPost, PostStatus } from "@/lib/content/types";

import styles from "./admin.module.scss";

interface PostsResponse { posts: ContentPost[] }
interface CategoriesResponse { categories: CategoryWithCount[] }
interface PostResponse { post: ContentPost }

function formatUpdated(value: string) {
  const date = new Date(value);
  if (Date.now() - date.getTime() < 60_000) return "Just now";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function PostManager() {
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | PostStatus>("All");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [busyIds, setBusyIds] = useState<string[]>([]);

  useEffect(() => {
    let isActive = true;

    async function loadPosts() {
      try {
        const [postsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/posts?scope=admin", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);
        if (!postsResponse.ok || !categoriesResponse.ok) throw new Error("Request failed");
        const postsResult = (await postsResponse.json()) as PostsResponse;
        const categoriesResult = (await categoriesResponse.json()) as CategoriesResponse;
        if (isActive) {
          setPosts(postsResult.posts);
          setCategories(categoriesResult.categories);
        }
      } catch {
        if (isActive) setError("Content could not be loaded from the simulated API.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadPosts();
    return () => { isActive = false; };
  }, []);

  const visiblePosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const searchable = `${post.title} ${post.categories.map((category) => category.name).join(" ")}`.toLowerCase();
      return (!normalizedQuery || searchable.includes(normalizedQuery)) && (status === "All" || post.status === status);
    });
  }, [posts, query, status]);

  async function addDraft() {
    setError("");
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled story", status: "Draft", categoryIds: categories[0] ? [categories[0].id] : [] }),
      });
      const result = (await response.json()) as PostResponse & { message?: string };
      if (!response.ok) throw new Error(result.message);
      setPosts((current) => [result.post, ...current]);
      setQuery("");
      setStatus("All");
    } catch (requestError) {
      setError(requestError instanceof Error && requestError.message ? requestError.message : "The draft could not be created.");
    }
  }

  async function togglePublished(post: ContentPost) {
    setBusyIds((current) => [...current, post.id]);
    setError("");
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: post.status === "Published" ? "Draft" : "Published" }),
      });
      const result = (await response.json()) as PostResponse & { message?: string };
      if (!response.ok) throw new Error(result.message);
      setPosts((current) => current.map((item) => item.id === post.id ? result.post : item));
    } catch (requestError) {
      setError(requestError instanceof Error && requestError.message ? requestError.message : "The post could not be updated.");
    } finally {
      setBusyIds((current) => current.filter((id) => id !== post.id));
    }
  }

  async function removePost(post: ContentPost) {
    setBusyIds((current) => [...current, post.id]);
    setError("");
    try {
      const response = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = (await response.json()) as { message?: string };
        throw new Error(result.message);
      }
      setPosts((current) => current.filter((item) => item.id !== post.id));
    } catch (requestError) {
      setError(requestError instanceof Error && requestError.message ? requestError.message : "The post could not be deleted.");
    } finally {
      setBusyIds((current) => current.filter((id) => id !== post.id));
    }
  }

  return (
    <>
      <div className={styles.pageHeading}>
        <div><span className={styles.eyebrow}>Content API</span><h1>Posts</h1><p>Create, review and publish stories for your readers.</p></div>
        <button className={styles.newPostButton} type="button" onClick={() => void addDraft()}><span aria-hidden="true">+</span> New draft</button>
      </div>

      {error ? <p className={styles.formError} role="alert">{error}</p> : null}
      <section className={styles.contentCard} aria-labelledby="posts-title">
        <div className={styles.tableToolbar}>
          <div className={styles.searchField}><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4 4" /></svg><input aria-label="Search posts" placeholder="Search posts..." type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
          <label className={styles.filterField}><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as "All" | PostStatus)}><option>All</option><option>Published</option><option>Draft</option><option>Scheduled</option></select></label>
        </div>

        <div className={styles.tableScroll}>
          <table className={`${styles.postsTable} ${styles.managementTable}`}>
            <thead><tr><th id="posts-title" scope="col">Post</th><th scope="col">Category</th><th scope="col">Status</th><th scope="col">Updated</th><th scope="col"><span className={styles.srOnly}>Actions</span></th></tr></thead>
            <tbody>
              {visiblePosts.map((post) => {
                const isBusy = busyIds.includes(post.id);
                return (
                  <tr key={post.id}>
                    <td><div className={styles.postIdentity}><Image src={post.image} alt="" width={54} height={42} /><span>{post.title}</span></div></td>
                    <td>{post.categories.map((category) => category.name).join(", ") || "Uncategorized"}</td>
                    <td><span className={`${styles.status} ${post.status === "Draft" ? styles.statusDraft : ""} ${post.status === "Scheduled" ? styles.statusScheduled : ""}`}>{post.status}</span></td>
                    <td>{formatUpdated(post.updatedAt)}</td>
                    <td><div className={styles.rowActions}><button type="button" disabled={isBusy} onClick={() => void togglePublished(post)}>{post.status === "Published" ? "Unpublish" : "Publish"}</button><button className={styles.dangerAction} type="button" disabled={isBusy} onClick={() => void removePost(post)} aria-label={`Delete ${post.title}`}>Delete</button></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {isLoading ? <div className={styles.noResults}><strong>Loading posts…</strong><span>Reading from the simulated API.</span></div> : null}
        {!isLoading && visiblePosts.length === 0 ? <div className={styles.noResults}><strong>No posts found</strong><span>Try a different search or status filter.</span></div> : null}
        <div className={styles.tableFooter}>Showing {visiblePosts.length} of {posts.length} API posts</div>
      </section>
    </>
  );
}
