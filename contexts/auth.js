import React, { useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [session, setSession] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // only update the react state if the component is still mounted
      if (mounted) {
        if (session) {
          setSession(session);
        }

        setIsLoading(false);
      }
    }

    getInitialSession();

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      mounted = false;

      subscription?.unsubscribe();
    };
  }, []);

  async function signOut() {
    // Ends user session
    router.push("/");
    await supabase.auth.signOut();
  }
  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => signOut,
    session,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
