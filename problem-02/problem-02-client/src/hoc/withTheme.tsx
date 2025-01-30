import { useState } from "react";

export interface WithThemeProps {
    toggleTheme: () => void;
    theme: string;
}

export const withTheme = <P extends object>(Component: React.ComponentType<P & WithThemeProps>) => {
  return (props: P) => {
    const [theme, setTheme] = useState("dark");

    const toggleTheme = () => {
      const newTheme = theme === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      document.body.setAttribute('data-theme', newTheme);
      setTheme(newTheme);
    };

    return <Component {...props} toggleTheme={toggleTheme} theme={theme} />;
  };
};
