import "server-only";

import { cookies } from "next/headers";

import { verifySessionToken } from "@/lib/auth/session";
import { authConfig } from "@/lib/config/env";

export async function getAdminSession() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(authConfig.cookieName)?.value;

    return verifySessionToken(sessionToken);
}
