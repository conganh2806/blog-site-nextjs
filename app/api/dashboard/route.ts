import { getAdminSession } from "@/lib/auth/auth";
import { getDashboard } from "@/lib/content/store";

export async function GET() {
  if (!(await getAdminSession())) {
    return Response.json({ message: "Authentication required." }, { status: 401 });
  }

  return Response.json(getDashboard(), {
    headers: { "Cache-Control": "no-store" },
  });
}
