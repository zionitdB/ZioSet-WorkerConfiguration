import { createContext, useContext, useState, ReactNode, useEffect } from "react";

const defaultFont = "";

interface FontContextProps {
  font: string;
  setFont: (font: string) => void;
}

const FontContext = createContext<FontContextProps>({
  font: defaultFont,
  setFont: () => {},
});

export const FontProvider = ({ children }: { children: ReactNode }) => {
  const [font, setFont] = useState<string>(() => {
    // Lazy init from localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("fontFamily") || defaultFont;
    }
    return defaultFont;
  });

  useEffect(() => {
    if (font) {
      localStorage.setItem("fontFamily", font);
    }
  }, [font]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      <div style={{ font }}>{children}</div>
    </FontContext.Provider>
  );
};

export const useFont = () => useContext(FontContext);
