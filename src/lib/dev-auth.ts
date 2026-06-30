/** Dev-only: set SKIP_AUTH=true in .env.local to bypass login */
export function isAuthSkipped() {
  return process.env.SKIP_AUTH === "true";
}

/**
 * In-memory dev store only works on a long-lived local Node process.
 * On Vercel/serverless each request may hit a cold instance — chats vanish.
 */
export function useLocalStore() {
  if (process.env.VERCEL === "1") return false;
  if (process.env.NODE_ENV === "production") return false;
  return isAuthSkipped() || process.env.DEMO_DATA === "true";
}

export const DEV_SESSION = {
  session: {
    id: "dev-session",
    userId: "dev-user",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    token: "dev-token",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  user: {
    id: "dev-user",
    name: "Dev User",
    email: "dev@localhost",
    emailVerified: true,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
} as const;
