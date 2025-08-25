import { createContext, useState, useEffect, useContext } from "react";
const ThemeContext = createContext(undefined);
export default function Context({ children }) {
    const [currentMode, setCurrentMode] = useState("light");
    const [activeBar, setActiveBar] = useState(false);

    const toggleTheme = () => {
        const root = document.documentElement;
        const body = document.body;
        
        if (currentMode === 'dark') {
            root.classList.remove('light');
            root.classList.add('dark');
            body.classList.remove('light');
            body.classList.add('dark');
        } else {
            root.classList.remove('dark');
            root.classList.add('light');
            body.classList.remove('dark');
            body.classList.add('light');
        }
    };

    // Effect for theme toggle
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
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};