'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { ContentPost } from '@/lib/content/types';

interface FeaturedPostsProps {
  posts: ContentPost[];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [transition, setTransition] = useState<{
    direction: 'next' | 'previous';
    from: number;
    to: number;
  } | null>(null);
  const activeSlideRef = useRef(0);
  const transitionTimerRef = useRef<number | null>(null);

  const changeSlide = useCallback((direction: 'next' | 'previous') => {
    const currentSlide = activeSlideRef.current;
    const offset = direction === 'next' ? 1 : -1;
    const nextSlide =
      (currentSlide + offset + posts.length) % posts.length;

    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
    }

    activeSlideRef.current = nextSlide;
    setTransition({ direction, from: currentSlide, to: nextSlide });
    setActiveSlide(nextSlide);

    transitionTimerRef.current = window.setTimeout(() => {
      setTransition(null);
      transitionTimerRef.current = null;
    }, 680);
  }, [posts.length]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      changeSlide('next');
    }, 7000);

    return () => {
      window.clearInterval(intervalId);

      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, [changeSlide]);

  const showPreviousSlide = () => {
    changeSlide('previous');
  };

  const showNextSlide = () => {
    changeSlide('next');
  };

  return (
    <div className="brick entry featured-grid">
      <div className="entry-content">
        <div
          id="featured-post-slider"
          className="flexslider react-slider"
          aria-label="Featured posts"
        >
          <ul className="slides" aria-live="polite">
            {posts.map((post, index) => {
              const slideClasses = [
                index === activeSlide ? 'is-active' : '',
                transition?.to === index ? `is-entering is-entering-${transition.direction}` : '',
                transition?.from === index ? `is-leaving is-leaving-${transition.direction}` : '',
              ].filter(Boolean).join(' ');

              return (
                <li
                  key={post.id}
                  className={slideClasses}
                  aria-hidden={index !== activeSlide}
                >
                <div className="featured-post-slide">
                  <div
                    className="post-background"
                    style={{ backgroundImage: `url("${post.image}")` }}
                  />
                  <div className="overlay" />

                  <div className="post-content">
                    <ul className="entry-meta">
                      <li>{formatDate(post.publishedAt)}</li>
                      <li>
                        <Link href="/about">{post.author}</Link>
                      </li>
                    </ul>

                    <h1 className="slide-title">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h1>
                  </div>
                </div>
                </li>
              );
            })}
          </ul>

          <ul className="flex-direction-nav" aria-label="Slider controls">
            <li className="flex-nav-prev">
              <button
                type="button"
                className="flex-prev"
                aria-label="Previous featured post"
                onClick={showPreviousSlide}
              >
                Previous
              </button>
            </li>

            <li className="flex-nav-next">
              <button
                type="button"
                className="flex-next"
                aria-label="Next featured post"
                onClick={showNextSlide}
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
