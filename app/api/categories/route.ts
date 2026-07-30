import { getAdminSession } from "@/lib/auth/auth";
import { createCategory, listCategories } from "@/lib/content/store";

export async function GET() {
  return Response.json(
    { categories: listCategories() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return Response.json({ message: "Authentication required." }, { status: 401 });
  }

  let input: { name?: unknown };
  try {
    input = (await request.json()) as { name?: unknown };
  } catch {
    return Response.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof input.name !== "string" || !input.name.trim()) {
    return Response.json({ message: "A category name is required." }, { status: 400 });
  }
  if (listCategories().some((category) =>
    category.name.toLowerCase() === input.name!.toString().trim().toLowerCase())) {
    return Response.json({ message: "That category already exists." }, { status: 409 });
  }

  return Response.json({ category: createCategory(input.name) }, { status: 201 });
}
