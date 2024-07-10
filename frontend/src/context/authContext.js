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
      const login = async (tokn, user) => {
        localStorage.setItem('token', tokn);
        localStorage.setItem('userId', user.id) ;
        localStorage.setItem('name', user.name);
        setAuthInfo({ token : tokn, userId: user.id, name: user.name });
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
