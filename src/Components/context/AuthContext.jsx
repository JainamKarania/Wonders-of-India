import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on load/refresh
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Keep state in sync with login/logout/token refresh, including
    // across other browser tabs.
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const signup = async ({ name, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Create the app-specific profile row (fullName/phone live here,
    // separate from what Supabase Auth itself stores). Requires an RLS
    // policy allowing a user to insert their own profile — see the SQL
    // shared alongside this file.
    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({ id: data.user.id, full_name: name });

      if (profileError) {
        console.error("Failed to create profile row:", profileError);
      }
    }

    return {
      success: true,
      // If email confirmation is required, Supabase returns a user but
      // no session yet — the caller needs to know this to avoid treating
      // signup as an immediate login.
      needsEmailConfirmation: !data.session,
    };
  };

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);