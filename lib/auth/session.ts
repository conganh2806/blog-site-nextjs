import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { authConfig } from "@/lib/config/env";

export interface AdminSession {
    userId: string;
    name: string;
    role: "admin";
    expiresAt: number;
}

function createSignature(payload: string): string {
    return createHmac("sha256", authConfig.sessionSecret)
        .update(payload)
        .digest("base64url");
}

function isAdminSession(value: unknown): value is AdminSession {
    if (!value || typeof value !== "object") {
        return false;
    }

    const session = value as Partial<AdminSession>;

    return (
        typeof session.userId === "string" &&
        typeof session.name === "string" &&
        session.role === "admin" &&
        typeof session.expiresAt === "number"
    );
}

export function createSessionToken(
    session: Omit<AdminSession, "expiresAt">,
): string {
    const sessionWithExpiry: AdminSession = {
        ...session,
        expiresAt: Date.now() + authConfig.sessionDurationSeconds * 1000,
    };

    const payload = Buffer.from(
        JSON.stringify(sessionWithExpiry),
    ).toString("base64url");

    const signature = createSignature(payload);

    return `${payload}.${signature}`;
}

export function verifySessionToken(
    token: string | undefined,
): AdminSession | null {
    if (!token) {
        return null;
    }

    try {
        const [payload, receivedSignature, extraPart] = token.split(".");

        if (!payload || !receivedSignature || extraPart) {
            return null;
        }

        const expectedSignature = createSignature(payload);

        const receivedBuffer = Buffer.from(receivedSignature);
        const expectedBuffer = Buffer.from(expectedSignature);

        if (receivedBuffer.length !== expectedBuffer.length) {
            return null;
        }

        if (!timingSafeEqual(receivedBuffer, expectedBuffer)) {
            return null;
        }

        const decodedSession: unknown = JSON.parse(
            Buffer.from(payload, "base64url").toString("utf8"),
        );

        if (!isAdminSession(decodedSession)) {
            return null;
        }

        if (decodedSession.expiresAt <= Date.now()) {
            return null;
        }

        return decodedSession;
    } catch {
        return null;
    }
}
