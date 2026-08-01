'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import type { ContentPost } from '@/lib/content/types';

interface GalleryPostProps {
  post: ContentPost;
}

export function GalleryPost({ post }: GalleryPostProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const galleryImages = post.galleryImages ?? [post.image];

  const showNextSlide = () => {
    setActiveSlide((currentSlide) =>
      (currentSlide + 1) % galleryImages.length
    );
  };

  return (
    <article className="brick entry format-gallery group">
      <div className="entry-thumb">
        <div
          className="post-slider flexslider react-slider"
          aria-label="Workspace gallery"
          onClick={showNextSlide}
        >
          <ul className="slides" aria-live="polite">
            {galleryImages.map((image, index) => (
              <li
                key={image}
                className={index === activeSlide ? 'is-active' : ''}
                aria-hidden={index !== activeSlide}
              >
                <Image
                  src={image}
                  alt={`Workspace design ${index + 1}`}
                  width={700}
                  height={1000}
                  sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 25vw"
                  style={{ width: '100%', height: 'auto' }}
                />
              </li>
            ))}
          </ul>

          <ol
            className="flex-control-nav flex-control-paging"
            aria-label="Choose gallery image"
          >
            {galleryImages.map((image, index) => (
              <li key={image}>
                <button
                  type="button"
                  className={index === activeSlide ? 'is-active' : ''}
                  aria-label={`Show gallery image ${index + 1}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveSlide(index);
                  }}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="entry-text">
        <div className="entry-header">
          <div className="entry-meta">
            <span className="cat-links">
              {post.categories.map((category) => (
                <Link key={category.id} href={`/category?name=${category.slug}`}>
                  {category.name}
                </Link>
              ))}
            </span>
          </div>

          <h1 className="entry-title">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h1>
        </div>

        <div className="entry-excerpt">{post.excerpt}</div>
      </div>
    </article>
  );
}
