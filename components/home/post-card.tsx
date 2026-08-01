import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

interface PostCardProps {
  alt: string;
  categories: string[];
  excerpt: string;
  image: string;
  imageHeight: number;
  title: string;
  formatClass?: string;
  href?: string;
  media?: ReactNode;
  thumbHref?: string;
}

export function PostCard({
  alt,
  categories,
  excerpt,
  image,
  imageHeight,
  title,
  formatClass = '',
  href = '/blog/standard',
  media,
  thumbHref,
}: PostCardProps) {
  const imageElement = (
    <Image
      src={image}
      alt={alt}
      width={700}
      height={imageHeight}
      sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 25vw"
      style={{ width: '100%', height: 'auto' }}
    />
  );

  return (
    <article className={`brick entry ${formatClass}`.trim()}>
      <div className="entry-thumb">
        {thumbHref ? (
          <a
            href={thumbHref}
            className="thumb-link"
            target="_blank"
            rel="noreferrer"
          >
            {imageElement}
          </a>
        ) : (
          <Link href={href} className="thumb-link">
            {imageElement}
          </Link>
        )}

        {media}
      </div>

      <div className="entry-text">
        <div className="entry-header">
          <div className="entry-meta">
            <span className="cat-links">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/category?name=${encodeURIComponent(
                    category.toLowerCase()
                  )}`}
                >
                  {category}
                </Link>
              ))}
            </span>
          </div>

          <h1 className="entry-title">
            <Link href={href}>{title}</Link>
          </h1>
        </div>

        <div className="entry-excerpt">{excerpt}</div>
      </div>
    </article>
  );
}
