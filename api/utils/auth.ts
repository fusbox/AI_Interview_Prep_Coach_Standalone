import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase Environment Variables in API");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function validateUser(req) {
    const authHeader = req.headers['authorization'];

    // Allow Guest Access (Missing Header)
    // If no header is present, we assume it's a guest user and proceed without a user object.
    // The individual handlers can decide if they strictly need a user, but for AI generation, we allow it.
    if (!authHeader) {
        console.warn("API Access: Guest User (No Auth Header)");
        return null;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new Error("Invalid Bearer Token");
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        throw new Error("Invalid or Expired Token");
    }

    return user;
}
