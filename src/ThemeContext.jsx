import { createContext, useContext, useEffect, useState, useRef } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const isInitial = useRef(true);

    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved : 'light'; // всегда default = light
    });

    useEffect(() => {
        // ⚠️ Убедимся, что не перезаписываем localStorage на первом рендере, если там уже есть значение
        if (!isInitial.current) {
            localStorage.setItem('theme', theme);
        } else {
            isInitial.current = false;
        }
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
