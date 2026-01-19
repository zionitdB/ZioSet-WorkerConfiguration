
import { fetchData } from '@/serviceAPI/serviceApi';
import React, { createContext, useEffect, useState } from 'react';

const AUTH_MODE = (import.meta.env.VITE_AUTH_MODE || "header") as "header" | "cookie";

interface AuthContextType {
  user: any;
  login: (user: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  

 useEffect(() => {
  const storedUser = sessionStorage.getItem("user");
  if (storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch {
      setUser(null); 
    }
  } else {
    setUser(null);
  }
  setLoading(false);
}, []);


const login = (user: any) => {
  sessionStorage.setItem("user", JSON.stringify(user));
  if (AUTH_MODE === "header" && user?.token) {
    sessionStorage.setItem("token", user.token);
  }
  setUser(user);
};

const logout = async () => {
  if (AUTH_MODE === "cookie") {
    await fetchData(`/api/auth/signout`);
  }
  sessionStorage.removeItem("user");
  if (AUTH_MODE === "header") sessionStorage.removeItem("token");
  setUser(null);
};

const isAuthenticated = Boolean(!loading && user && (user.id || user.userId));
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
