"use client";

import Image from "next/image";
import Link from "next/link";
import { SubmitEvent, useEffect, useState } from "react";

import type { ContentPost, PostDetailResponse } from "@/lib/content/types";

interface PostPageContentProps {
  slug: string;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function PostMedia({ post }: { post: ContentPost }) {
  const [activeImage, setActiveImage] = useState(0);

  if (post.format === "video" && post.videoUrl) {
    return (
      <div className="content-media">
        <div className="fluid-video-wrapper">
          <iframe
            src={`${post.videoUrl}?title=0&byline=0&portrait=0`}
            title={post.title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (post.format === "gallery" && post.galleryImages?.length) {
    return (
      <div className="content-media single-post-gallery">
        <Image
          src={post.galleryImages[activeImage]}
          alt={`${post.title}, image ${activeImage + 1}`}
          width={950}
          height={700}
          priority
        />
        <div className="single-gallery-controls" aria-label="Gallery images">
          {post.galleryImages.map((image, index) => (
            <button
              key={image}
              type="button"
              className={index === activeImage ? "is-active" : ""}
              aria-label={`Show gallery image ${index + 1}`}
              aria-pressed={index === activeImage}
              onClick={() => setActiveImage(index)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="content-media">
      <div className="post-thumb">
        <Image src={post.image} alt={post.title} width={950} height={post.imageHeight} priority />
      </div>
      {post.format === "audio" && post.audioUrl ? (
        <div className="audio-wrap">
          <audio src={post.audioUrl} controls preload="metadata">
            Your browser does not support audio playback.
          </audio>
        </div>
      ) : null}
    </div>
  );
}

export function PostPageContent({ slug }: PostPageContentProps) {
  const [result, setResult] = useState<PostDetailResponse | null>(null);
  const [error, setError] = useState("");
  const [commentSent, setCommentSent] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadPost() {
      try {
        const response = await fetch(`/api/posts/${encodeURIComponent(slug)}`, { cache: "no-store" });
        if (!response.ok) throw new Error(response.status === 404 ? "not-found" : "request-failed");
        const data = (await response.json()) as PostDetailResponse;
        if (isActive) setResult(data);
      } catch (requestError) {
        if (!isActive) return;
        setError(requestError instanceof Error && requestError.message === "not-found"
          ? "This article could not be found."
          : "This article could not be loaded.");
      }
    }

    void loadPost();
    return () => { isActive = false; };
  }, [slug]);

  function submitComment(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setCommentSent(true);
  }

  if (error) {
    return <div className="single-post-state" role="alert"><p>{error}</p><Link href="/">Return to the front page</Link></div>;
  }

  if (!result) return <div className="single-post-state" aria-live="polite">Loading article…</div>;

  const { post, previousPost, nextPost } = result;

  return (
    <section id="content-wrap" className="blog-single">
      <div className="row">
        <div className="col-twelve">
          <article className={`format-${post.format}`}>
            <PostMedia post={post} />

            <div className="primary-content">
              <h1 className="entry-title">{post.title}</h1>
              <ul className="entry-meta">
                <li className="date">{formatDate(post.publishedAt || post.updatedAt)}</li>
                <li className="cat">
                  {post.categories.map((category) => (
                    <Link key={category.id} href={`/category?name=${category.slug}`}>{category.name}</Link>
                  ))}
                </li>
              </ul>

              <p className="lead">{post.excerpt}</p>
              <p>
                Good stories begin with a clear idea and enough room for the details to breathe.
                This article brings together practical observations, visual thinking, and useful
                lessons for people building thoughtful creative work.
              </p>

              <p>
                <Image src="/images/shutterbug.jpg" alt="Creative work in progress" width={1050} height={700} />
              </p>

              <h2>Designing with purpose</h2>
              <p>
                Strong work is rarely the result of decoration alone. It comes from understanding
                the audience, choosing a clear hierarchy, and removing anything that distracts
                from the central message. Every element should earn its place.
              </p>

              <blockquote><p>Good design makes the important things clear, memorable, and meaningful.</p></blockquote>

              <p>
                A consistent process makes those decisions easier. Start broadly, test the main
                assumptions, and then refine the details as the direction becomes clearer. The
                result feels simple because the difficult decisions happened earlier.
              </p>

              <h3>Keep improving the system</h3>
              <p>
                Review the finished work in context, gather useful feedback, and carry what you
                learn into the next project. Small improvements compound into a stronger visual
                language over time.
              </p>

              <p className="tags"><span>Tagged in:</span>{post.categories.map((category) => <Link key={category.id} href={`/category?name=${category.slug}`}>{category.name}</Link>)}</p>

              <div className="author-profile">
                <Image src="/images/avatars/user-05.jpg" alt={post.author} width={60} height={60} />
                <div className="about">
                  <h4><Link href="/about">{post.author}</Link></h4>
                  <p>Editor at Abstract, writing about design, photography, creativity, and the systems that help good ideas become useful work.</p>
                  <ul className="author-social"><li><a href="#">Facebook</a></li><li><a href="#">Twitter</a></li><li><a href="#">Instagram</a></li></ul>
                </div>
              </div>
            </div>

            {(previousPost || nextPost) ? (
              <nav className="pagenav group" aria-label="Adjacent posts">
                <div className="prev-nav">{previousPost ? <Link href={`/blog/${previousPost.slug}`} rel="prev"><span>Previous</span>{previousPost.title}</Link> : null}</div>
                <div className="next-nav">{nextPost ? <Link href={`/blog/${nextPost.slug}`} rel="next"><span>Next</span>{nextPost.title}</Link> : null}</div>
              </nav>
            ) : null}
          </article>
        </div>
      </div>

      <div className="comments-wrap">
        <div id="comments" className="row">
          <div className="col-full">
            <h3>2 Comments</h3>
            <ol className="commentlist">
              <li className="depth-1">
                <div className="avatar"><Image width={50} height={50} className="avatar" src="/images/avatars/user-01.jpg" alt="Itachi Uchiha" /></div>
                <div className="comment-content"><div className="comment-info"><cite>Itachi Uchiha</cite><div className="comment-meta"><time className="comment-time">Jul 29, 2026 @ 09:05</time></div></div><div className="comment-text"><p>A thoughtful perspective. The emphasis on clarity makes this especially useful.</p></div></div>
              </li>
              <li className="depth-1">
                <div className="avatar"><Image width={50} height={50} className="avatar" src="/images/avatars/user-04.jpg" alt="John Doe" /></div>
                <div className="comment-content"><div className="comment-info"><cite>John Doe</cite><div className="comment-meta"><time className="comment-time">Jul 30, 2026 @ 11:20</time></div></div><div className="comment-text"><p>I enjoyed the practical approach and will use these ideas in my next project.</p></div></div>
              </li>
            </ol>

            <div className="respond">
              <h3>Leave a Comment</h3>
              {commentSent ? <p className="comment-success" role="status">Thanks—your simulated comment was submitted.</p> : null}
              <form onSubmit={submitComment}>
                <fieldset>
                  <div className="form-field"><input name="name" type="text" className="full-width" placeholder="Your Name" required /></div>
                  <div className="form-field"><input name="email" type="email" className="full-width" placeholder="Your Email" required /></div>
                  <div className="message form-field"><textarea name="message" className="full-width" placeholder="Your Message" required /></div>
                  <button type="submit" className="submit button-primary">Submit</button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
