import { createAuthClient } from "better-auth/react";
import { useState, useEffect } from "react";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
});

export const { signIn, signUp, signOut, changePassword } = authClient;

export function useSession() {
  const [sessionState, setSessionState] = useState({
    data: null,
    isPending: true,
    error: null,
  });

  useEffect(() => {
    let isSubscribed = true;

    authClient.getSession()
      .then((res) => {
        if (isSubscribed) {
          setSessionState({
            data: res?.data || null,
            isPending: false,
            error: res?.error || null,
          });
        }
      })
      .catch((err) => {
        if (isSubscribed) {
          setSessionState({
            data: null,
            isPending: false,
            error: err,
          });
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  return sessionState;
}

