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

/** Browser origin when available; otherwise same resolution as getAppUrl(). */
export function getClientAppUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return getAppUrl();
}
