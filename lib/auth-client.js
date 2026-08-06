'use client';

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
export const changePassword = authClient.changePassword;
export const updateUser = authClient.updateUser;

// Client-safe hook wrapper
export const useSession = (...args) => {
  if (typeof window === 'undefined') {
    return { data: null, isPending: true, error: null };
  }
  return authClient.useSession(...args);
};