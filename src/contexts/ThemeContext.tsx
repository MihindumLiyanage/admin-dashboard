import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Theme } from "@carbon/react";

type ThemeName = "white" | "g100";

interface ThemeContextType {
  theme: ThemeName;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "white",
  toggleTheme: () => {},
});

const themes: ThemeName[] = ["white", "g100"];

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeName>("white");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const saved = localStorage.getItem("app-theme") as ThemeName | null;
    if (saved && themes.includes(saved)) {
      setTheme(saved);
    }
    setLoading(false);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = themes[(themes.indexOf(prev) + 1) % themes.length];
      localStorage.setItem("app-theme", next);
      return next;
    });
  };

  if (loading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Theme theme={theme}>{children}</Theme>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
