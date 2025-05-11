import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export const colors = {
  light: {
    primary: '#6A7FDB',
    secondary: '#9AC4F8',
    background: '#FFFFFF',
    cardBackground: '#F7F9FC',
    text: '#333333',
    textSecondary: '#666666',
    border: '#E1E5EA',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3',
    userBubble: '#E3F2FD',
    assistantBubble: '#F5F5F5',
    inputBackground: '#F0F2F5',
  },
  dark: {
    primary: '#5A6FC7',
    secondary: '#7EAEF8',
    background: '#121212',
    cardBackground: '#1E1E1E',
    text: '#E0E0E0',
    textSecondary: '#AAAAAA',
    border: '#2A2A2A',
    success: '#66BB6A',
    error: '#EF5350',
    warning: '#FFCA28',
    info: '#42A5F5',
    userBubble: '#1A344D',
    assistantBubble: '#2A2A2A',
    inputBackground: '#1E1E1E',
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 26
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  circle: 999
};

type ThemeType = {
  colors: typeof colors.light;
  spacing: typeof spacing;
  fontSizes: typeof fontSizes;
  borderRadius: typeof borderRadius;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeType>({
  colors: colors.light,
  spacing,
  fontSizes,
  borderRadius,
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const theme: ThemeType = {
    colors: isDark ? colors.dark : colors.light,
    spacing,
    fontSizes,
    borderRadius,
    isDark,
  };
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
