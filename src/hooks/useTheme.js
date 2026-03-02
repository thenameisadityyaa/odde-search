import { useEffect, useState } from "react";
import { getPrefs, savePrefs } from "../utils/preferences";

export default function useTheme() {
    const [theme, setTheme] = useState(() => {
        const prefs = getPrefs();
        return prefs?.theme || "dark";
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);

        // Update preferences in local storage
        const prefs = getPrefs();
        savePrefs({ ...prefs, theme });
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return { theme, setTheme, toggleTheme };
}
