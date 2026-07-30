import "server-only";

import { randomUUID } from "node:crypto";

import type {
  Category,
  CategoryWithCount,
  ContentPost,
  CreatePostInput,
  DashboardResponse,
  NewsPost,
  PostStatus,
  PostDetailResponse,
  PublicContentResponse,
  UpdatePostInput,
} from "./types";

interface ContentStore {
  categories: Category[];
  posts: NewsPost[];
}

const defaultExcerpt =
  "Ideas, practical details and thoughtful inspiration for designers and creative professionals.";

const seedCategories: Category[] = [
  { id: "design", name: "Design", slug: "design", color: "#d96c47" },
  { id: "photography", name: "Photography", slug: "photography", color: "#5d7f9f" },
  { id: "inspiration", name: "Inspiration", slug: "inspiration", color: "#8d6fa8" },
  { id: "branding", name: "Branding", slug: "branding", color: "#bf8b3d" },
  { id: "ui", name: "UI", slug: "ui", color: "#4d9271" },
  { id: "html", name: "HTML", slug: "html", color: "#657c96" },
  { id: "music", name: "Music", slug: "music", color: "#ad5f73" },
  { id: "wordpress", name: "Wordpress", slug: "wordpress", color: "#557a8f" },
];

const seedPosts: NewsPost[] = [
  { id: "minimalism", title: "Minimalism Never Goes Out of Style", slug: "minimalism-never-goes-out-of-style", excerpt: defaultExcerpt, author: "Naruto Uzumaki", image: "/images/thumbs/featured/featured-1.jpg", imageHeight: 700, categoryIds: ["design", "inspiration"], status: "Published", format: "standard", featured: true, publishedAt: "2026-07-29T09:00:00.000Z", updatedAt: "2026-07-29T09:00:00.000Z" },
  { id: "negative-space", title: "Enhancing Your Designs with Negative Space", slug: "enhancing-designs-with-negative-space", excerpt: defaultExcerpt, author: "Sasuke Uchiha", image: "/images/thumbs/featured/featured-2.jpg", imageHeight: 700, categoryIds: ["design", "ui"], status: "Published", format: "standard", featured: true, publishedAt: "2026-07-28T08:30:00.000Z", updatedAt: "2026-07-28T08:30:00.000Z" },
  { id: "album-covers", title: "Music Album Cover Designs for Inspiration", slug: "music-album-cover-designs", excerpt: defaultExcerpt, author: "Naruto Uzumaki", image: "/images/thumbs/featured/featured-3.jpg", imageHeight: 700, categoryIds: ["music", "inspiration"], status: "Published", format: "standard", featured: true, publishedAt: "2026-07-27T07:15:00.000Z", updatedAt: "2026-07-27T07:15:00.000Z" },
  { id: "standard-format", title: "Just a Standard Format Post.", slug: "standard-format-post", excerpt: defaultExcerpt, author: "Abstract Editor", image: "/images/thumbs/diagonal-building.jpg", imageHeight: 700, categoryIds: ["design", "photography"], status: "Published", format: "standard", featured: false, publishedAt: "2026-07-26T10:00:00.000Z", updatedAt: "2026-07-26T10:00:00.000Z" },
  { id: "another-standard", title: "This Is Another Standard Format Post.", slug: "another-standard-format-post", excerpt: defaultExcerpt, author: "Abstract Editor", image: "/images/thumbs/ferris-wheel.jpg", imageHeight: 800, categoryIds: ["design", "ui"], status: "Published", format: "standard", featured: false, publishedAt: "2026-07-25T10:00:00.000Z", updatedAt: "2026-07-25T10:00:00.000Z" },
  { id: "audio-format", title: "This Is an Audio Format Post.", slug: "audio-format-post", excerpt: defaultExcerpt, author: "Abstract Editor", image: "/images/thumbs/concert.jpg", imageHeight: 800, categoryIds: ["design", "music"], status: "Published", format: "audio", featured: false, publishedAt: "2026-07-24T10:00:00.000Z", updatedAt: "2026-07-24T10:00:00.000Z", audioUrl: "/media/AirReview-Landmarks-02-ChasingCorporate.mp3" },
  { id: "photography-skills", title: "Photography Skills Can Improve Your Graphic Design.", slug: "photography-skills-improve-design", excerpt: defaultExcerpt, author: "Abstract Editor", image: "/images/thumbs/shutterbug.jpg", imageHeight: 700, categoryIds: ["photography", "html"], status: "Published", format: "standard", featured: false, publishedAt: "2026-07-23T10:00:00.000Z", updatedAt: "2026-07-23T10:00:00.000Z" },
  { id: "golden-rules", title: "The 10 Golden Rules of Clean Simple Design.", slug: "golden-rules-clean-design", excerpt: defaultExcerpt, author: "Abstract Editor", image: "/images/thumbs/usaf-rocket.jpg", imageHeight: 1000, categoryIds: ["branding", "design"], status: "Published", format: "standard", featured: false, publishedAt: "2026-07-22T10:00:00.000Z", updatedAt: "2026-07-22T10:00:00.000Z" },
  { id: "workspace-gallery", title: "Workspace Design Trends and Ideas.", slug: "workspace-design-trends", excerpt: defaultExcerpt, author: "Abstract Editor", image: "/images/thumbs/gallery/work1.jpg", imageHeight: 1000, categoryIds: ["branding", "wordpress"], status: "Published", format: "gallery", featured: false, publishedAt: "2026-07-21T10:00:00.000Z", updatedAt: "2026-07-21T10:00:00.000Z", galleryImages: ["/images/thumbs/gallery/work1.jpg", "/images/thumbs/gallery/work2.jpg", "/images/thumbs/gallery/work3.jpg"] },
  { id: "patterns", title: "You Can See Patterns Everywhere.", slug: "patterns-everywhere", excerpt: defaultExcerpt, author: "Abstract Editor", image: "/images/thumbs/diagonal-pattern.jpg", imageHeight: 700, categoryIds: ["design", "ui"], status: "Published", format: "standard", featured: false, publishedAt: "2026-07-20T10:00:00.000Z", updatedAt: "2026-07-20T10:00:00.000Z" },
  { id: "video-format", title: "This Is a Video Post Format.", slug: "video-post-format", excerpt: defaultExcerpt, author: "Abstract Editor", image: "/images/thumbs/ottawa-bokeh.jpg", imageHeight: 900, categoryIds: ["design", "branding"], status: "Published", format: "video", featured: false, publishedAt: "2026-07-19T10:00:00.000Z", updatedAt: "2026-07-19T10:00:00.000Z", videoUrl: "https://player.vimeo.com/video/14592941" },
  { id: "lighthouses", title: "Breathtaking Photos of Lighthouses.", slug: "breathtaking-lighthouse-photos", excerpt: defaultExcerpt, author: "Abstract Editor", image: "/images/thumbs/lighthouse.jpg", imageHeight: 900, categoryIds: ["photography", "design"], status: "Published", format: "standard", featured: false, publishedAt: "2026-07-18T10:00:00.000Z", updatedAt: "2026-07-18T10:00:00.000Z" },
  { id: "black-white", title: "Designing With Black and White.", slug: "designing-black-and-white", excerpt: defaultExcerpt, author: "Abstract Editor", image: "/images/thumbs/liberty.jpg", imageHeight: 1000, categoryIds: ["branding", "html"], status: "Published", format: "standard", featured: false, publishedAt: "2026-07-17T10:00:00.000Z", updatedAt: "2026-07-17T10:00:00.000Z" },
  { id: "creative-workspace", title: "Workspace Ideas for Creative Professionals", slug: "workspace-ideas-creative-professionals", excerpt: defaultExcerpt, author: "Abstract Editor", image: "/images/thumbs/wall-clock.jpg", imageHeight: 700, categoryIds: ["inspiration"], status: "Draft", format: "standard", featured: false, publishedAt: "", updatedAt: "2026-07-30T08:00:00.000Z" },
  { id: "story-images", title: "How to Tell a Better Story Through Images", slug: "tell-better-story-through-images", excerpt: defaultExcerpt, author: "Abstract Editor", image: "/images/thumbs/lighthouse.jpg", imageHeight: 900, categoryIds: ["photography"], status: "Scheduled", format: "standard", featured: false, publishedAt: "2026-08-02T08:00:00.000Z", updatedAt: "2026-07-30T07:00:00.000Z" },
];

const globalContent = globalThis as typeof globalThis & {
  __abstractContentStore?: ContentStore;
};

function getStore(): ContentStore {
  globalContent.__abstractContentStore ??= {
    categories: structuredClone(seedCategories),
    posts: structuredClone(seedPosts),
  };

  return globalContent.__abstractContentStore;
}

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function hydratePost(post: NewsPost): ContentPost {
  const store = getStore();
  return {
    ...structuredClone(post),
    categories: post.categoryIds
      .map((categoryId) => store.categories.find((category) => category.id === categoryId))
      .filter((category): category is Category => Boolean(category))
      .map((category) => ({ ...category })),
  };
}

function sortPosts(posts: NewsPost[]): NewsPost[] {
  return [...posts].sort((left, right) =>
    Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
}

export function listPosts(options: { includeUnpublished?: boolean } = {}): ContentPost[] {
  const posts = options.includeUnpublished
    ? getStore().posts
    : getStore().posts.filter((post) => post.status === "Published");
  return sortPosts(posts).map(hydratePost);
}

export function getPostDetail(
  idOrSlug: string,
  options: { includeUnpublished?: boolean } = {},
): PostDetailResponse | null {
  const posts = listPosts({ includeUnpublished: options.includeUnpublished });
  const index = posts.findIndex((post) => post.id === idOrSlug || post.slug === idOrSlug);
  if (index === -1) return null;

  const post = posts[index];
  const previousPost = posts[index + 1];
  const nextPost = posts[index - 1];

  return {
    post,
    previousPost: previousPost ? { slug: previousPost.slug, title: previousPost.title } : null,
    nextPost: nextPost ? { slug: nextPost.slug, title: nextPost.title } : null,
  };
}

export function getPublicContent(): PublicContentResponse {
  const publishedPosts = listPosts();
  return {
    featuredPosts: publishedPosts.filter((post) => post.featured),
    posts: publishedPosts.filter((post) => !post.featured),
    categories: listCategories(),
  };
}

export function listCategories(): CategoryWithCount[] {
  const store = getStore();
  return store.categories.map((category) => ({
    ...category,
    postCount: store.posts.filter((post) => post.categoryIds.includes(category.id)).length,
  }));
}

export function createPost(input: CreatePostInput): ContentPost {
  const now = new Date().toISOString();
  const status: PostStatus = input.status ?? "Draft";
  const post: NewsPost = {
    id: randomUUID(),
    title: input.title.trim(),
    slug: `${slugify(input.title) || "untitled"}-${Date.now().toString(36)}`,
    excerpt: input.excerpt?.trim() || defaultExcerpt,
    author: "Abstract Admin",
    image: input.image || "/images/thumbs/diagonal-pattern.jpg",
    imageHeight: 700,
    categoryIds: input.categoryIds ?? [],
    status,
    format: input.format ?? "standard",
    featured: input.featured ?? false,
    publishedAt: status === "Published" ? now : "",
    updatedAt: now,
  };
  getStore().posts.unshift(post);
  return hydratePost(post);
}

export function updatePost(id: string, input: UpdatePostInput): ContentPost | null {
  const post = getStore().posts.find((item) => item.id === id);
  if (!post) return null;

  if (typeof input.title === "string" && input.title.trim()) {
    post.title = input.title.trim();
    post.slug = slugify(input.title);
  }
  if (Array.isArray(input.categoryIds)) post.categoryIds = input.categoryIds;
  if (input.status) {
    post.status = input.status;
    if (input.status === "Published" && !post.publishedAt) post.publishedAt = new Date().toISOString();
  }
  if (typeof input.excerpt === "string") post.excerpt = input.excerpt.trim();
  if (typeof input.image === "string" && input.image) post.image = input.image;
  if (typeof input.featured === "boolean") post.featured = input.featured;
  if (input.format) post.format = input.format;
  post.updatedAt = new Date().toISOString();
  return hydratePost(post);
}

export function deletePost(id: string): boolean {
  const store = getStore();
  const index = store.posts.findIndex((post) => post.id === id);
  if (index === -1) return false;
  store.posts.splice(index, 1);
  return true;
}

export function createCategory(name: string): CategoryWithCount {
  const trimmedName = name.trim();
  const category: Category = {
    id: `${slugify(trimmedName)}-${Date.now().toString(36)}`,
    name: trimmedName,
    slug: slugify(trimmedName),
    color: "#708090",
  };
  getStore().categories.push(category);
  return { ...category, postCount: 0 };
}

export function deleteCategory(id: string): "deleted" | "in-use" | "not-found" {
  const store = getStore();
  if (store.posts.some((post) => post.categoryIds.includes(id))) return "in-use";
  const index = store.categories.findIndex((category) => category.id === id);
  if (index === -1) return "not-found";
  store.categories.splice(index, 1);
  return "deleted";
}

export function getDashboard(): DashboardResponse {
  const posts = listPosts({ includeUnpublished: true });
  return {
    stats: {
      published: posts.filter((post) => post.status === "Published").length,
      drafts: posts.filter((post) => post.status === "Draft").length,
      scheduled: posts.filter((post) => post.status === "Scheduled").length,
      categories: getStore().categories.length,
    },
    recentPosts: posts.slice(0, 5),
  };
}
