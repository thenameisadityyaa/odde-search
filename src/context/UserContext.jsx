import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

const PROFILES_KEY = "odde_profiles_v1";
const CURRENT_PROFILE_KEY = "odde_current_profile_v1";

const DEFAULT_PROFILE = {
    id: "default",
    name: "Guest User",
    avatar: "👤",
    color: "blue",
    createdAt: Date.now(),
};

export function UserProvider({ children }) {
    const [profiles, setProfiles] = useState(() => {
        const saved = localStorage.getItem(PROFILES_KEY);
        return saved ? JSON.parse(saved) : [DEFAULT_PROFILE];
    });

    const [currentProfileId, setCurrentProfileId] = useState(() => {
        return localStorage.getItem(CURRENT_PROFILE_KEY) || "default";
    });

    const currentProfile = profiles.find((p) => p.id === currentProfileId) || profiles[0];

    useEffect(() => {
        localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    }, [profiles]);

    useEffect(() => {
        localStorage.setItem(CURRENT_PROFILE_KEY, currentProfileId);
    }, [currentProfileId]);

    const addProfile = (name, avatar = "👤", color = "blue") => {
        const newProfile = {
            id: Date.now().toString(),
            name,
            avatar,
            color,
            createdAt: Date.now(),
        };
        setProfiles((prev) => [...prev, newProfile]);
        return newProfile;
    };

    const deleteProfile = (id) => {
        if (id === "default") return; // Cannot delete default
        setProfiles((prev) => prev.filter((p) => p.id !== id));
        if (currentProfileId === id) {
            setCurrentProfileId("default");
        }
    };

    const switchProfile = (id) => {
        setCurrentProfileId(id);
    };

    return (
        <UserContext.Provider
            value={{
                profiles,
                currentProfile,
                addProfile,
                deleteProfile,
                switchProfile,
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
