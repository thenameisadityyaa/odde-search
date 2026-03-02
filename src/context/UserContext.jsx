import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import supabase from "../lib/supabase";

const UserContext = createContext();

export function UserProvider({ children }) {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tableMissing, setTableMissing] = useState(false);

    useEffect(() => {
        if (!user) {
            setProfile(null);
            setLoading(false);
            setTableMissing(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const { data, error: fetchError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (fetchError) {
                    if (fetchError.code === "PGRST116" || fetchError.status === 404) {
                        // Table missing or profile not found
                        if (fetchError.status === 404) {
                            setTableMissing(true);
                        }

                        // If table exists but profile is missing, create it
                        if (fetchError.code === "PGRST116") {
                            const newProfile = {
                                id: user.id,
                                name: user.email?.split("@")[0] || "User",
                                bio: "Searching the infinite web.",
                                avatar_color: "blue",
                                role: "user"
                            };

                            const { data: createdData, error: createError } = await supabase
                                .from("profiles")
                                .insert([newProfile])
                                .select()
                                .single();

                            if (!createError) {
                                setProfile(createdData);
                                setTableMissing(false);
                                return;
                            }
                        }

                        // Fallback profile state if creation fails or table is missing
                        setProfile({
                            id: user.id,
                            name: user.email?.split("@")[0] || "User",
                            bio: "Searching the infinite web.",
                            avatar_color: "blue",
                            role: "user"
                        });
                    } else {
                        throw fetchError;
                    }
                } else {
                    setProfile(data);
                    setTableMissing(false);
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();

        // Subscribe to profile changes
        const subscription = supabase
            .channel(`profile:${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "profiles",
                    filter: `id=eq.${user.id}`,
                },
                (payload) => {
                    setProfile(payload.new);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [user]);

    const updateProfile = async (patch) => {
        if (!user) return;
        try {
            const { error: updateError } = await supabase
                .from("profiles")
                .update(patch)
                .eq("id", user.id);

            if (updateError) throw updateError;
            // Profile will be updated via subscription or manually if needed
            setProfile((prev) => ({ ...prev, ...patch }));
        } catch (err) {
            console.error("Error updating profile:", err);
            throw err;
        }
    };

    return (
        <UserContext.Provider
            value={{
                profile,
                updateProfile,
                loading,
                error,
                tableMissing,
                isAdmin: profile?.role === "admin",
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
