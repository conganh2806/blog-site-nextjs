import type { ContentPost } from '@/lib/content/types';

import { GalleryPost } from './gallery-post';
import { PostCard } from './post-card';

interface PostGridProps {
  posts: ContentPost[];
}

export function PostGrid({ posts }: PostGridProps) {
  return (
    <>
      {posts.map((post) => {
        if (post.format === 'gallery' && post.galleryImages?.length) {
          return <GalleryPost key={post.id} post={post} />;
        }

        const media = post.format === 'audio' && post.audioUrl ? (
          <div className="audio-wrap">
            <audio src={post.audioUrl} controls preload="metadata">
              Your browser does not support audio playback.
            </audio>
          </div>
        ) : undefined;

        return (
          <PostCard
            key={post.id}
            alt={post.title}
            categories={post.categories.map((category) => category.name)}
            excerpt={post.excerpt}
            formatClass={`format-${post.format}`}
            href={`/blog/${post.slug}`}
            image={post.image}
            imageHeight={post.imageHeight}
            media={media}
            title={post.title}
          />
        );
      })}
    </>
  );
}
