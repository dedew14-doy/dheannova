/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Lazy-initialized client
let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.');
    }
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

// Proxy object to avoid refactoring all components while still preventing the "Key is required" crash
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    return (getSupabase() as any)[prop];
  }
});

export type UserRole = 'admin' | 'guru' | 'staf';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  kelas: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  user_id?: string; // For employees
  student_id?: string; // For students
  date: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alfa';
  clock_in?: string;
  recorded_by?: string; // User ID who recorded student attendance
  created_at: string;
}
