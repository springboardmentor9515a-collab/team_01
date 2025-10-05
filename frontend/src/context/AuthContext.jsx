import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    try {
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      // ignore storage errors
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
