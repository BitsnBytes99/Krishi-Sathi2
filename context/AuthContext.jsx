import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile data from your "user_rows" table
  const fetchUser = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user")  // Changed from "user" to "user_rows" to match your table
        .select("*")
        .eq("userid", userId)  // Using userid column from your CSV
        .single();

      if (error) throw error;
      
      // Set user data with the correct structure from your table
      setUser({
        ...data,
        id: data.userid  // Ensure we have the userid available
      });
    } catch (err) {
      console.error("Error fetching user:", err.message);
      setError(err.message);
    }
  };

  // Get session and fetch user on mount
  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;
        setSession(session);

        if (session?.user) {
          // Use the email from auth to find the user in your user_rows table
          await fetchUser(session.user.id);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error getting session:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          await fetchUser(session.user.id);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign in method
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setSession(data.session);
      await fetchUser(data.session.user.id);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out method
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,        // Contains all user data including userid from your table
        session,     // Auth session
        loading,
        error,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;