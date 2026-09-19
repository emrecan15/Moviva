"use client";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  getAuthStatus,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  resetPassword as resetPasswordRequest,
  resetPasswordConfirm as resetPasswordConfirmRequest,
  changePassword as changePasswordRequest,
} from "@/api/authService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const login = async (data) => {
    const response = await loginRequest(data);

    setUser(response.data);
    setIsAuthenticated(true);

    return response;
  };

  const register = (data) => registerRequest(data);

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const resetPassword = (data) => resetPasswordRequest(data);
  const resetPasswordConfirm = (data) => resetPasswordConfirmRequest(data);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getAuthStatus();
        if (response.data.authenticated) {
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const changePassword = (data) => changePasswordRequest(data);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    resetPassword,
    resetPasswordConfirm,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
