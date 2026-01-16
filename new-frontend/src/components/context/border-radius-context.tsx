import  { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface BorderRadiusContextProps {
  borderRadius: number;
  setBorderRadius: (value: number) => void;
}

const defaultRadius = 10; // 10px default

const BorderRadiusContext = createContext<BorderRadiusContextProps>({
  borderRadius: defaultRadius,
  setBorderRadius: () => {},
});

export const BorderRadiusProvider = ({ children }: { children: ReactNode }) => {
  const [borderRadius, setBorderRadius] = useState<number>(defaultRadius);
useEffect(() => {
  document.documentElement.style.setProperty('--app-border-radius', `${borderRadius}px`);
}, [borderRadius]);

  return (
    <BorderRadiusContext.Provider value={{ borderRadius, setBorderRadius }}>
      {children}
    </BorderRadiusContext.Provider>
  );
};

export const useBorderRadius = () => useContext(BorderRadiusContext);
