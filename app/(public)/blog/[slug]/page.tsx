import type { Metadata } from "next";
import { Suspense } from "react";

import { PostPageContent } from "@/components/blog/post-page-content";
import { getPostDetail } from "@/lib/content/store";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = getPostDetail(slug);

  return {
    title: result?.post.title ?? "Post not found",
    description: result?.post.excerpt,
  };
}

async function PostRouteContent({ params }: BlogPostPageProps) {
  const { slug } = await params;
  return <PostPageContent slug={slug} />;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <main>
      <Suspense fallback={<div className="single-post-state">Loading article…</div>}>
        <PostRouteContent params={params} />
      </Suspense>
    </main>
  );
}
