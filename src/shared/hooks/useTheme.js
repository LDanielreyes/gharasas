import { useEffect, useState } from "react";

export default function useTheme() {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme) {
                return savedTheme;
            }
            return window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        }
        return "light";
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Check if browser supports View Transitions API
        const supportsViewTransitions = 'startViewTransition' in document;

        const applyTheme = (newTheme) => {
            root.classList.remove("light", "dark");
            root.classList.add(newTheme);
            localStorage.setItem("theme", newTheme);
        };

        if (supportsViewTransitions) {
            // Use View Transition API for ultra-smooth transitions
            document.startViewTransition(() => {
                applyTheme(theme);
            });
        } else {
            // Fallback: standard smooth transition
            applyTheme(theme);
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === "light" ? "dark" : "light";
            return newTheme;
        });
    };

    return { theme, toggleTheme };
}
