"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  gradeInfo: { grade: string } | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [gradeInfo, setGradeInfo] = useState<{ grade: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGrade = async (userId: string, email?: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("grade")
      .eq("id", userId)
      .single();

    if (error) {
      setGradeInfo({ grade: "silver" });
    } else {
      setGradeInfo(data);
    }
  };

  useEffect(() => {
    let mounted = true;

    const handleSession = async (session: any) => {
      const currentUser = session?.user ?? null;

      if (!mounted) return;

      setUser(currentUser);

      if (currentUser) {
        await fetchGrade(currentUser.id, currentUser.email);
      } else {
        setGradeInfo(null);
      }

      if (mounted) {
        setLoading(false);
      }
    };

    const initialize = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      await handleSession(session);
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await handleSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, gradeInfo, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
