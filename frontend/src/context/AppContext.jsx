import React, { createContext, useState, useEffect } from "react";

// Create the context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user data from localStorage or an API
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
