import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile data from your "user" table
  const fetchUser = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("userid", userId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setUser({
          ...data,
          id: data.userid
        });
        return data;
      }
      return null;
    } catch (err) {
      console.error("Error fetching user:", err.message);
      setError(err.message);
      throw err;
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
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const userData = await fetchUser(data.session.user.id);
      
      if (!userData) {
        console.warn("Auth succeeded but no user record found");
        throw new Error("User profile not found");
      }

      setSession(data.session);
      return data;
    } catch (error) {
      console.error("SignIn error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up method
  const signUp = async (email, password, userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // First check if email exists in your user table
      const { data: existingUser, error: checkError } = await supabase
        .from('user')
        .select('email')
        .eq('email', email)
        .maybeSingle();
  
      if (checkError) throw checkError;
      if (existingUser) throw new Error("Email already registered");
  
      // Create auth user with email confirmation disabled
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
          data: {
            // Any additional user metadata you want to store in auth.users
            name: userData.name,
            phone: userData.phone,
            district: userData.district
          }
        }
      });
  
      if (authError) throw authError;
  
      if (authData.user) {
        // Insert user data into your "user" table
        const { data: userDataResponse, error: userError } = await supabase
          .from('user')
          .insert([{
            userid: authData.user.id,
            name: userData.name,
            email: email,
            phone: userData.phone,
            district: userData.district,
            userType: 'farmer',
            language: 'en',
            crops: null,
            location: null
          }])
          .select()
          .single();
  
        if (userError) throw userError;
  
        // Automatically sign in the user after registration
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
  
        if (signInError) throw signInError;
  
        setUser(userDataResponse);
        setSession(signInData.session);
        return authData;
      }
    } catch (error) {
      console.error("SignUp error:", error);
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
        user,
        session,
        loading,
        error,
        signIn,
        signUp,
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