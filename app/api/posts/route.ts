import { getAdminSession } from "@/lib/auth/auth";
import { createPost, listPosts } from "@/lib/content/store";
import type { CreatePostInput, PostStatus } from "@/lib/content/types";

const validStatuses: PostStatus[] = ["Draft", "Published", "Scheduled"];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const includeUnpublished = url.searchParams.get("scope") === "admin";

  if (includeUnpublished && !(await getAdminSession())) {
    return Response.json({ message: "Authentication required." }, { status: 401 });
  }

  return Response.json(
    { posts: listPosts({ includeUnpublished }) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return Response.json({ message: "Authentication required." }, { status: 401 });
  }

  let input: CreatePostInput;
  try {
    input = (await request.json()) as CreatePostInput;
  } catch {
    return Response.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof input.title !== "string" || !input.title.trim()) {
    return Response.json({ message: "A post title is required." }, { status: 400 });
  }
  if (input.status && !validStatuses.includes(input.status)) {
    return Response.json({ message: "Invalid post status." }, { status: 400 });
  }

  return Response.json({ post: createPost(input) }, { status: 201 });
}
