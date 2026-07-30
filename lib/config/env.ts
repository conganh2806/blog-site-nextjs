import "server-only";

function requireEnvironmentValue(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function requirePositiveInteger(name: string): number {
  const value = Number(requireEnvironmentValue(name));

  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer.`);
  }

  return value;
}

function requireBoolean(name: string): boolean {
  const value = requireEnvironmentValue(name).toLowerCase();

  if (value !== "true" && value !== "false") {
    throw new Error(`${name} must be either true or false.`);
  }

  return value === "true";
}

const sessionSecret = requireEnvironmentValue("AUTH_SESSION_SECRET");

if (sessionSecret.length < 32) {
  throw new Error("AUTH_SESSION_SECRET must contain at least 32 characters.");
}

export const authConfig = Object.freeze({
  admin: Object.freeze({
    id: requireEnvironmentValue("ADMIN_ID"),
    name: requireEnvironmentValue("ADMIN_NAME"),
    email: requireEnvironmentValue("ADMIN_EMAIL"),
    password: requireEnvironmentValue("ADMIN_PASSWORD"),
    role: "admin" as const,
  }),
  cookieName: requireEnvironmentValue("AUTH_SESSION_COOKIE_NAME"),
  cookieSecure: requireBoolean("AUTH_COOKIE_SECURE"),
  sessionDurationSeconds: requirePositiveInteger("AUTH_SESSION_DURATION_SECONDS"),
  sessionSecret,
});
