import { getAdminSession } from "@/lib/auth/auth";
import { deletePost, getPostDetail, updatePost } from "@/lib/content/store";
import type { PostStatus, UpdatePostInput } from "@/lib/content/types";

const validStatuses: PostStatus[] = ["Draft", "Published", "Scheduled"];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getAdminSession();
  const result = getPostDetail(id, { includeUnpublished: Boolean(session) });

  if (!result) return Response.json({ message: "Post not found." }, { status: 404 });
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) {
    return Response.json({ message: "Authentication required." }, { status: 401 });
  }

  let input: UpdatePostInput;
  try {
    input = (await request.json()) as UpdatePostInput;
  } catch {
    return Response.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  if (input.status && !validStatuses.includes(input.status)) {
    return Response.json({ message: "Invalid post status." }, { status: 400 });
  }

  const { id } = await params;
  const post = updatePost(id, input);
  if (!post) return Response.json({ message: "Post not found." }, { status: 404 });
  return Response.json({ post });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) {
    return Response.json({ message: "Authentication required." }, { status: 401 });
  }

  const { id } = await params;
  if (!deletePost(id)) return Response.json({ message: "Post not found." }, { status: 404 });
  return new Response(null, { status: 204 });
}
