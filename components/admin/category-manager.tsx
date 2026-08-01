"use client";

import { SubmitEvent, useEffect, useMemo, useState } from "react";

import type { CategoryWithCount } from "@/lib/content/types";

import styles from "./admin.module.scss";

interface CategoriesResponse { categories: CategoryWithCount[] }

export function CategoryManager() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories", { cache: "no-store" });
        if (!response.ok) throw new Error();
        const result = (await response.json()) as CategoriesResponse;
        if (isActive) setCategories(result.categories);
      } catch {
        if (isActive) setError("Categories could not be loaded from the simulated API.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadCategories();
    return () => { isActive = false; };
  }, []);

  const visibleCategories = useMemo(() => categories.filter((category) =>
    category.name.toLowerCase().includes(query.trim().toLowerCase())), [categories, query]);

  async function addCategory(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    setError("");
    try {
      const response = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
      const result = (await response.json()) as { category?: CategoryWithCount; message?: string };
      if (!response.ok || !result.category) throw new Error(result.message);
      setCategories((current) => [...current, result.category!]);
      setName("");
    } catch (requestError) {
      setError(requestError instanceof Error && requestError.message ? requestError.message : "The category could not be created.");
    }
  }

  async function removeCategory(category: CategoryWithCount) {
    setError("");
    try {
      const response = await fetch(`/api/categories/${category.id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = (await response.json()) as { message?: string };
        throw new Error(result.message);
      }
      setCategories((current) => current.filter((item) => item.id !== category.id));
    } catch (requestError) {
      setError(requestError instanceof Error && requestError.message ? requestError.message : "The category could not be deleted.");
    }
  }

  return (
    <>
      <div className={styles.pageHeading}><div><span className={styles.eyebrow}>Content API</span><h1>Categories</h1><p>Organize your stories into clear, useful topics.</p></div></div>
      {error ? <p className={styles.formError} role="alert">{error}</p> : null}
      <div className={styles.categoryLayout}>
        <section className={`${styles.contentCard} ${styles.categoryFormCard}`} aria-labelledby="add-category-title">
          <div className={styles.cardHeader}><h2 id="add-category-title">Add category</h2></div>
          <form onSubmit={(event) => void addCategory(event)}><label htmlFor="category-name">Name</label><input id="category-name" placeholder="e.g. Web design" value={name} onChange={(event) => setName(event.target.value)} /><small>The API generates the slug automatically.</small><button className={styles.newPostButton} type="submit" disabled={!name.trim()}>Add category</button></form>
        </section>

        <section className={styles.contentCard} aria-labelledby="category-list-title">
          <div className={styles.tableToolbar}><div><h2 id="category-list-title">All categories</h2><p>{categories.length} topics from the API</p></div><div className={styles.searchField}><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4 4" /></svg><input aria-label="Search categories" placeholder="Search..." type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></div></div>
          <div className={styles.categoryList}>
            {visibleCategories.map((category) => <article key={category.id}><span className={styles.categoryColor} style={{ backgroundColor: category.color }} aria-hidden="true" /><div><strong>{category.name}</strong><span>/{category.slug}</span></div><span>{category.postCount} posts</span><button type="button" onClick={() => void removeCategory(category)} aria-label={`Delete ${category.name}`}>Delete</button></article>)}
          </div>
          {isLoading ? <div className={styles.noResults}><strong>Loading categories…</strong></div> : null}
          {!isLoading && visibleCategories.length === 0 ? <div className={styles.noResults}><strong>No categories found</strong><span>Try another search term.</span></div> : null}
        </section>
      </div>
    </>
  );
}
