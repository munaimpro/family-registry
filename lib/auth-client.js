'use client';

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

// Better Auth React package built-in useSession প্রদান করে
export const { signIn, signUp, signOut, useSession, changePassword, updateUser } = authClient;