import React, { createContext, useContext, useState } from 'react';

const PermissionsContext = createContext();

const PermissionsProvider = ({ children }) => {
    const [permissions, setPermissions] = useState({});

    const value = {
        permissions,
        setPermissions
    }
  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

export { PermissionsProvider, usePermissions };