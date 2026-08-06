'use client';

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

// Explicit exports to avoid React hook context issues during Next.js SSG
export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
export const changePassword = authClient.changePassword;
export const updateUser = authClient.updateUser;

// Custom hook safe wrapper
export const useSession = () => authClient.useSession();