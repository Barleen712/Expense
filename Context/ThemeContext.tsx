import React, { createContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { useColorScheme } from "react-native";
import { RootState } from "../Store/Store";
export type ThemeContextType = {
  theme: "Light" | "Dark";
  colors: {
    backgroundColor: string;
    color?: string;
    LinearGradient: string[];
    textcolor: string;
    borderColor: string;
    listView: string;
    budgetView: string;
    profileView: string;
    icon: string;
    financialReport: string;
    reportText: string;
    line: string;
    editColor: string;
    nobutton: string;
    seeall: string;
    selected: string;
    about: string;
    gray: string;
  };
};
export const ThemeContext = createContext<ThemeContextType | null>(null);
export const ThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const theme = useSelector((state: RootState) => state.Money.preferences.theme);
  const deviceTheme = useColorScheme();
  const themes = {
    Light: {
      backgroundColor: "#fff",
      color: "#000",
      LinearGradient: ["rgb(229, 255, 243)", "rgba(205, 230, 200, 0.09)"],
      textcolor: "rgb(56, 88, 85)",
      borderColor: "grey",
      listView: "rgba(237, 234, 234, 0.28)",
      budgetView: "rgba(241, 241, 250, 1)",
      profileView: "white",
      icon: "rgba(220, 234, 233, 0.6)",
      financialReport: "rgba(173, 210, 189, 0.6)",
      reportText: "rgb(25, 75, 72)",
      line: "rgba(56, 88, 85, 0.11)",
      editColor: "rgb(4, 73, 69)",
      nobutton: "rgba(220, 234, 233, 0.6)",
      seeall: "rgba(220, 234, 233, 0.6)",
      selected: "rgba(4, 73, 69, 0.53)",
      about: "#F9FAFB",
      gray: "#666",
    },
    Dark: {
      backgroundColor: "#000",
      textcolor: "white",
      LinearGradient: ["rgb(86, 101, 91)", "rgba(99, 117, 95, 0.09)"],
      color: "white",
      borderColor: "black",
      listView: "rgba(73, 69, 69, 0.62)",
      budgetView: "rgba(98, 88, 88, 0.43)",
      profileView: "rgb(15, 15, 15)",
      icon: "rgba(51, 56, 56, 0.6)",
      financialReport: "rgb(25, 75, 72)",
      reportText: "white",
      line: "rgba(150, 148, 148, 0.28)",
      editColor: "rgb(39, 176, 192)",
      nobutton: "rgba(255, 255, 255, 0.9)",
      seeall: "white",
      selected: "rgb(39, 176, 192)",
      about: "rgba(0, 0, 0, 0.83)",
      gray: "rgba(255, 255, 255, 0.9)",
    },
  };
  let selectedThemeName: "Light" | "Dark";

  if (theme === "Using device theme") {
    selectedThemeName = deviceTheme === "dark" ? "Dark" : "Light";
  } else {
    selectedThemeName = theme as "Light" | "Dark";
  }

  // Wrap the ENTIRE context value in useMemo
  const contextValue = useMemo(() => {
    const selectedColors = themes[selectedThemeName] || themes.Light;
    return {
      theme: selectedThemeName,
      colors: selectedColors,
    };
  }, [selectedThemeName]);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};
