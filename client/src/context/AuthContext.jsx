import { createContext, useState } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';

// 1. Bypass Vite's strict export rule for this specific line
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 2. Initialize state synchronously. This prevents the useEffect warning 
  // and stops the UI from flickering on initial page load!
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return { id: decoded.userId };
      } catch { 
        // 3. Removed the unused 'err' variable here
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

 const login = async (formData) => {
  try {
    // If you were doing { formData }, change it to just formData
    const res = await api.post('/users/login', formData); 
    
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

  const register = async (name, collegeEmail, password) => {
    setLoading(true);
    try {
      const res = await api.post('/users/register', { name, collegeEmail, password });
      localStorage.setItem('token', res.data.token);
      setUser({ id: res.data.userId, name: res.data.name });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};