import { cookies } from "next/headers";

import { createSessionToken } from "@/lib/auth/session";
import { authConfig } from "@/lib/config/env";
import { loginSchema } from "@/lib/validations/login.schema";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }

  const result = loginSchema.safeParse(payload);

  if (!result.success) {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }

  const { email, password } = result.data;

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
