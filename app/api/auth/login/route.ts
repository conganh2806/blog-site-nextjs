import { cookies } from "next/headers";

import { createSessionToken } from "@/lib/auth/session";
import { authConfig } from "@/lib/config/env";

interface LoginPayload {
  email?: unknown;
  password?: unknown;
}

export async function POST(request: Request) {
  let payload: LoginPayload;

  try {
    payload = (await request.json()) as LoginPayload;
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (email !== authConfig.admin.email.toLowerCase() || password !== authConfig.admin.password) {
    return Response.json({ message: "Email or password is incorrect." }, { status: 401 });
  }

  const token = createSessionToken({
    name: authConfig.admin.name,
    role: authConfig.admin.role,
    userId: authConfig.admin.id,
  });
  const cookieStore = await cookies();

  cookieStore.set(authConfig.cookieName, token, {
    httpOnly: true,
    maxAge: authConfig.sessionDurationSeconds,
    path: "/",
    sameSite: "lax",
    secure: authConfig.cookieSecure,
  });

  return Response.json({ success: true });
}
