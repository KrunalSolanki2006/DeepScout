import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../api/auth.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkSession = useCallback(async () => {
    try {
      const data = await authApi.getMe();
      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      // 401 or network error on initial session check is expected for guest/unauthenticated users
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async ({ email, password }) => {
    setError(null);
    try {
      const res = await authApi.login({ email, password });
      setUser(res.user);
      return res.user;
    } catch (err) {
      setError(err.message || "Failed to sign in");
      throw err;
    }
  };

  const register = async ({ name, email, password }) => {
    setError(null);
    try {
      const res = await authApi.register({ name, email, password });
      setUser(res.user);
      return res.user;
    } catch (err) {
      setError(err.message || "Failed to create account");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
