import React from "react";
import { Navigate } from "react-router-dom";
import {useAuth} from "./context/authContext";



function CheckAuth() {
    
    const {token , userId} = useAuth(); 
    return token && userId;
  }

export default function ProtectedRoute({ children }) {
    const isAuthenticated = CheckAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
  }
