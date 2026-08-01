'use client';

import { useEffect, useState } from 'react';

import type { PublicContentResponse } from '@/lib/content/types';

import { FeaturedPosts } from './featured-posts';
import { MasonryGrid } from './masonry-grid';
import { PostGrid } from './post-grid';

export function HomeContent() {
  const [content, setContent] = useState<PublicContentResponse | null>(null);
  const [error, setError] = useState('');

  async function loadContent() {
    setError('');

    try {
      const response = await fetch('/api/content', { cache: 'no-store' });
      if (!response.ok) throw new Error('Content request failed');
      setContent((await response.json()) as PublicContentResponse);
    } catch {
      setError('The latest stories could not be loaded.');
    }
  }

  useEffect(() => {
    let isActive = true;

    async function loadInitialContent() {
      try {
        const response = await fetch('/api/content', { cache: 'no-store' });
        if (!response.ok) throw new Error('Content request failed');
        const result = (await response.json()) as PublicContentResponse;
        if (isActive) setContent(result);
      } catch {
        if (isActive) setError('The latest stories could not be loaded.');
      }
    }

    void loadInitialContent();
    return () => { isActive = false; };
  }, []);

  if (error) {
    return (
      <div className="row content-state" role="alert">
        <p>{error}</p>
        <button type="button" onClick={() => void loadContent()}>Try again</button>
      </div>
    );
  }

  if (!content) {
    return <div className="row content-state" aria-live="polite">Loading latest stories…</div>;
  }

  return (
    <MasonryGrid>
      {content.featuredPosts.length > 0 ? <FeaturedPosts posts={content.featuredPosts} /> : null}
      <PostGrid posts={content.posts} />
    </MasonryGrid>
  );
}
