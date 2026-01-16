import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the context's state
interface GlobalUIContextType {
  isSideNavCollapsed: boolean;
  setSideNavCollapsed: (value: boolean) => void;
  toggleSideNavCollapsed: () => void;
  userType: string | null;
  setUserType: (value: string | null) => void;
}

// Create a context with an undefined value initially
const GlobalUIContext = createContext<GlobalUIContextType | undefined>(undefined);

// Define the type for the props of GlobalUIProvider
interface GlobalUIProviderProps {
  children: ReactNode;
}

// Global UI Provider component
export const GlobalUIProvider: React.FC<GlobalUIProviderProps> = ({ children }) => {
  const [isSideNavCollapsed, setSideNavCollapsed] = useState<boolean>(false);
  const [userType, setUserType] = useState<string | null>(null);

  const toggleSideNavCollapsed = () => setSideNavCollapsed((prev) => !prev);

  const values: GlobalUIContextType = {
    isSideNavCollapsed,
    setSideNavCollapsed,
    toggleSideNavCollapsed,
    userType,
    setUserType,
  };

  return (
    <GlobalUIContext.Provider value={values}>
      {children}
    </GlobalUIContext.Provider>
  );
};

// Custom hook for using the context
export const useGlobalUIContext = (): GlobalUIContextType => {
  const context = useContext(GlobalUIContext);
  if (!context) {
    throw new Error("useGlobalUIContext must be used within a GlobalUIProvider");
  }
  return context;
};
