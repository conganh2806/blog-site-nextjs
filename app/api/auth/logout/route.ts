import { cookies } from "next/headers";

import { authConfig } from "@/lib/config/env";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.set(authConfig.cookieName, "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: authConfig.cookieSecure,
  });

  return Response.json({ success: true });
}
