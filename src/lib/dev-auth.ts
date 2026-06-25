/** Dev-only: set SKIP_AUTH=true in .env.local to bypass login */
export function isAuthSkipped() {
  return process.env.SKIP_AUTH === "true";
}

/** Use in-memory store (dev + optional demo data) */
export function useLocalStore() {
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
