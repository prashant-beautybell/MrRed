import type { BaseURLConfig } from "better-auth";

function trimTrailingSlash(url: string) {
  return url.replace(/\/$/, "");
}

/**
 * Public app URL for the current environment (server-side).
 * Optional overrides: BETTER_AUTH_URL or NEXT_PUBLIC_APP_URL.
 */
export function getAppUrl(): string {
  const explicit =
    process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return trimTrailingSlash(explicit);

  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL;
    const protocol = host.includes("localhost") ? "http" : "https";
    return `${protocol}://${host}`;
  }

  const port = process.env.PORT ?? "3000";
  return `http://localhost:${port}`;
}

/**
 * Better Auth base URL — static override or dynamic multi-host (Vercel previews + custom domains).
 * Optional: BETTER_AUTH_ALLOWED_HOSTS=comma,separated,hosts
 */
export function getAuthBaseURL(): BaseURLConfig {
  const explicit =
    process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return trimTrailingSlash(explicit);

  const allowedHosts = ["localhost", "127.0.0.1", "*.vercel.app"];
  const extraHosts = process.env.BETTER_AUTH_ALLOWED_HOSTS?.split(",")
    .map((host) => host.trim())
    .filter(Boolean);
  if (extraHosts?.length) allowedHosts.push(...extraHosts);

  return {
    allowedHosts,
    protocol: "auto",
    fallback: getAppUrl(),
  };
}

/** Session cookie names Better Auth may set (plain dev vs __Secure- production). */
export const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
] as const;

export function hasAuthSessionCookie(
  cookies: { name: string; value: string }[]
): boolean {
  return cookies.some(
    (cookie) =>
      SESSION_COOKIE_NAMES.includes(
        cookie.name as (typeof SESSION_COOKIE_NAMES)[number]
      ) && cookie.value.length > 0
  );
}
