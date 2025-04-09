import { createClient } from "@supabase/supabase-js";
import 'react-native-url-polyfill/auto';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define your credentials (better to keep these in environment variables)
const supabaseUrl = "https://tberfxdhhauhrxqztved.supabase.co";
const supabasekey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZXJmeGRoaGF1aHJ4cXp0dmVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMTA2MjUsImV4cCI6MjA1NTc4NjYyNX0.usQKwUDrxvfwvNjhp2wJP7ytLTuz9QBAMRc8mlO1xO0";

// Creating a Supabase client instance
export const supabase = createClient(supabaseUrl, supabasekey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Note: Remove or properly secure the service role key from your code