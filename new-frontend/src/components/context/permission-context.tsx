
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./auth-context";
import { useGetPermissionsAndActionsByRole } from "../Screens/Configuration/rolepermission/hook";

type Route = {
  selected: boolean;
  permissionsName: string;
  navigationUrl: string;
  actions: string[];
};

type PermissionsContextType = {
  routes: { [key: string]: Route[] }; 
  setRoutes: React.Dispatch<React.SetStateAction<{ [key: string]: Route[] }>>; 
  userHasPermission: (url: string) => boolean; 
  isLoadings:any;
  
};

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<{ [key: string]: Route[] }>({}); 
  const [loading, setLoading] = useState<boolean>(true); 
   const [isLoadings, setIsLoadings] = useState<boolean>(true); 
  const [roleId, setRoleId] = useState<string | null>(null); 
  const { user } = useAuth();

  const userHasPermission = (url: string) => {
    return Object.values(routes).some((category) =>
      category.some((route) => route.navigationUrl === url && route.selected)
    );
  };
  

  useEffect(() => {
   
      const storedRoleId = user?.role?.roleId||0; 

      if (user) {
        setRoleId(storedRoleId);
        setLoading(false); 
      } else {
        setLoading(false);
      }
   
  }, [user]); 

  const { data, isLoading } = useGetPermissionsAndActionsByRole(roleId);

  useEffect(() => {

    if (data) {
      setRoutes(data); 
        setIsLoadings(false);
    }
  }, [data]);

  return (
    <PermissionsContext.Provider value={{ routes, setRoutes, userHasPermission,isLoadings }}>
      { isLoading || loading ? (
     <div className="flex justify-center items-center min-h-screen bg-background">
  <div className="relative w-16 h-16">

    <div className="absolute inset-0 rounded-full border-4 border-gray-300 dark:border-gray-700 border-t-transparent dark:border-t-transparent animate-spin"></div>
    
    <div className="absolute inset-2 rounded-full border-4 border-cyan-400 dark:border-purple-500 border-t-transparent animate-spin-slow"></div>
    
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="w-4 h-4 bg-violet-500 dark:bg-cyan-400 rounded-full shadow-lg animate-pulse"></div>
    </div>
  </div>
  <span className="sr-only">Loading...</span>

  <style>{`
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 2s linear infinite;
    }
  `}</style>
</div>

      ) : (
        children
      )}
    </PermissionsContext.Provider>
  );
};


export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};

