import { getAdminSession } from "@/lib/auth/auth";
import { deleteCategory } from "@/lib/content/store";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) {
    return Response.json({ message: "Authentication required." }, { status: 401 });
  }

  const { id } = await params;
  const result = deleteCategory(id);
  if (result === "not-found") return Response.json({ message: "Category not found." }, { status: 404 });
  if (result === "in-use") return Response.json({ message: "Remove this category from its posts before deleting it." }, { status: 409 });
  return new Response(null, { status: 204 });
}
