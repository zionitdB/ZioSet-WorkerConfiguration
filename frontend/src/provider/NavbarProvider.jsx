import React, { useState } from "react";

export const NavigationContext = React.createContext();

function NavbarProvider({ children }) {
  const [openMenuContext, setOpenMenuContext] = useState({
    MasterContext: false,
    DashboardContext: false,
    TransactionContext: false,
    ReportContext: false,
    ConfigContext: false,
  });

  const contextValue = { openMenuContext, setOpenMenuContext };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

export default NavbarProvider;
