import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DEV_SESSION, isAuthSkipped } from "@/lib/dev-auth";

const DEV_LOGGED_OUT_COOKIE = "mrred_dev_logged_out";

export async function getSession() {
  if (isAuthSkipped()) {
    const cookieStore = await cookies();
    if (cookieStore.has(DEV_LOGGED_OUT_COOKIE)) {
      return null;
    }
    return DEV_SESSION;
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
