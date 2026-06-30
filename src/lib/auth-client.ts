"use client";

import { createAuthClient } from "better-auth/react";

/** Same-origin `/api/auth` — avoids baking a wrong host into the client bundle on Vercel. */
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
