import { getPublicContent } from "@/lib/content/store";

export async function GET() {
  return Response.json(getPublicContent(), {
    headers: { "Cache-Control": "no-store" },
  });
}
