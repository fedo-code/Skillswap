import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ FIXED: named import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginUser = (data) => {
    setUser(data.user);
    localStorage.setItem('token', data.token);
  };  

  const logout = () => {
    setUser(null );
    localStorage.removeItem('token');
  }; 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      try { 
        const decoded = jwtDecode(token); // ✅ works now
        setUser({ _id: decoded.id });     // or other fields in your token
      } catch {
        logout();
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);