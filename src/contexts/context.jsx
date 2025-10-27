import { createContext, useState, useEffect, useContext } from "react";
const ThemeContext = createContext(undefined);
export default function Context({ children }) {
    const [activeBar, setActiveBar] = useState(false);
    const [currentMode, setCurrentMode] = useState(localStorage.getItem('theme'));
    const toggleTheme = () => {
        const Html = document.documentElement;
        const body = document.body;
        if (currentMode === 'dark') {
            body.classList.remove('light');
            body.classList.add('dark');
            Html.classList.remove('light');
            Html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark');
            body.classList.add('light');
                        Html.classList.remove('dark');
            Html.classList.add('light');
            localStorage.setItem('theme', 'light');
        }
    };
    useEffect(() => {
        toggleTheme();
    }, [currentMode]);

    return (
        <ThemeContext.Provider 
            value={{
                currentMode,
                setCurrentMode,
                toggleTheme,
                activeBar,
                setActiveBar,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export { ThemeContext };
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};