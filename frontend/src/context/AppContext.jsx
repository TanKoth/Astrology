import React, { createContext, useState, useEffect, useContext } from "react";

// Create the context
const AppContext = createContext();

export const useAuth = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

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

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
