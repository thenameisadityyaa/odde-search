import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(false);
            return;
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signIn = (email, password) => {
        if (!supabase) return Promise.reject(new Error("Supabase not configured"));
        return supabase.auth.signInWithPassword({ email, password });
    };

    const signUp = (email, password) => {
        if (!supabase) return Promise.reject(new Error("Supabase not configured"));
        return supabase.auth.signUp({ email, password });
    };

    const signOut = () => {
        if (!supabase) return Promise.resolve();
        return supabase.auth.signOut();
    };

    const signInWithGoogle = () => {
        if (!supabase) return Promise.reject(new Error("Supabase not configured"));
        return supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin.replace(/\/$/, ""),
            },
        });
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, signInWithGoogle, isConfigured: !!supabase }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
