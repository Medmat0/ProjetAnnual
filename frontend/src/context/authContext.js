import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { BASE_URL } from "../apiCall";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authInfo, setAuthInfo] = useState({
      token: localStorage.getItem('token'), 
      userId: localStorage.getItem('userId'),
      name: '',
    });
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          setAuthInfo(prevState => ({ ...prevState, token }));
        }
      }, []);
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      const { tokn, user } = response.data;
      localStorage.setItem('token', tokn);
      localStorage.setItem('userId', user.id) 
      setAuthInfo({ token : tokn, userId: user.id, name: user.name });
    
      console.log('user', authInfo.name);
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    setAuthInfo({ token: null, userId: null });
  };

  return (
    <AuthContext.Provider value={{ ...authInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
