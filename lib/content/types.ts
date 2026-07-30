export type PostStatus = "Draft" | "Published" | "Scheduled";
export type PostFormat = "standard" | "audio" | "video" | "gallery";

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  image: string;
  imageHeight: number;
  categoryIds: string[];
  status: PostStatus;
  format: PostFormat;
  featured: boolean;
  publishedAt: string;
  updatedAt: string;
  audioUrl?: string;
  videoUrl?: string;
  galleryImages?: string[];
}

export interface ContentPost extends NewsPost {
  categories: Category[];
}

export interface CategoryWithCount extends Category {
  postCount: number;
}

export interface PublicContentResponse {
  posts: ContentPost[];
  featuredPosts: ContentPost[];
  categories: CategoryWithCount[];
}

export interface DashboardResponse {
  stats: {
    published: number;
    drafts: number;
    scheduled: number;
    categories: number;
  };
  recentPosts: ContentPost[];
}

export interface PostDetailResponse {
  post: ContentPost;
  previousPost: Pick<ContentPost, "slug" | "title"> | null;
  nextPost: Pick<ContentPost, "slug" | "title"> | null;
}

export interface ApiErrorResponse {
  message: string;
}

export interface CreatePostInput {
  title: string;
  categoryIds?: string[];
  status?: PostStatus;
  excerpt?: string;
  image?: string;
  featured?: boolean;
  format?: PostFormat;
}

export type UpdatePostInput = Partial<CreatePostInput>;
