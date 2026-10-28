import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, fetchMe, logoutRequest } from "@/lib/auth";
import {
  clearAuthSession,
  getStoredToken,
  getStoredUser,
  storeAuthSession,
  updateStoredUser,
} from "@/lib/auth-storage";
import type { AuthSession, AuthUser } from "@/types/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  useEffect(() => {
    if (!getStoredToken()) return;

    let active = true;

    fetchMe()
      .then(({ user: me }) => {
        if (!active) return;
        updateStoredUser(me);
        setUser(me);
      })
      .catch(() => {
        if (!active) return;
        clearAuthSession();
        setUser(null);
      });

    return () => {
      active = false;
    };
  }, []);

  function signIn(session: AuthSession) {
    storeAuthSession(session.token, session.user);
    setUser(session.user);
  }

  async function signOut() {
    try {
      await logoutRequest();
    } catch {
      // Local session is cleared regardless of network state.
    } finally {
      clearAuthSession();
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}