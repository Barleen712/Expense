// ThemeContext.js
import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  const themes = {
    light: {
      backgroundColor: '#fff',
      color: '#000',
      LinearGradient:["rgb(229, 255, 243)", "rgba(205, 230, 200, 0.09)"],
      textcolor:"rgb(56, 88, 85)",
      borderColor:"grey",
      listView:"rgba(237, 234, 234, 0.28)",
      budgetView: "rgba(241, 241, 250, 1)",
      profileView:"white",
      icon:"rgba(220, 234, 233, 0.6)",
      financialReport:"rgba(173, 210, 189, 0.6)",
      reportText:"rgb(25, 75, 72)",
      
    },
    dark: {
      backgroundColor: '#000',
      textcolor: 'white',
      LinearGradient:["rgb(86, 101, 91)", "rgba(99, 117, 95, 0.09)"],
      color:"white",
      borderColor:"black",
      listView:"rgba(73, 69, 69, 0.62)",
      budgetView:"rgba(98, 88, 88, 0.43)",
      profileView:"rgb(15, 15, 15)",
      icon:"rgba(51, 56, 56, 0.6)",
      financialReport:"rgb(25, 75, 72)",
      reportText:"white"
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};
