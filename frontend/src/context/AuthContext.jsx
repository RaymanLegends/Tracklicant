import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        // Only set user if valid user data returned
        if (res.data && (res.data._id || res.data.email)) {
          setAuthUser(res.data);
        } else {
          setAuthUser(null);
        }
      } catch (error) {
        setAuthUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const signup = async (formData) => {
    try {
      const res = await api.post("/auth/signup", formData);
      setAuthUser(res.data);
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      return false;
    }
  };

  const login = async (formData) => {
    try {
      const res = await api.post("/auth/login", formData);
      setAuthUser(res.data);
      toast.success("Logged in successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
      return false;
    }
  };

  const googleLogin = async (credential, createAccount = false) => {
    try {
      const res = await api.post("/auth/google", { credential, createAccount });
      setAuthUser(res.data);
      toast.success("Signed in with Google!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Google sign-in failed");
      return false;
    }
  };

  const setPassword = async (password) => {
    try {
      await api.patch("/auth/password", { password });
      toast.success("Password updated successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setAuthUser(null);
      toast.success("Signed out");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isCheckingAuth,
        signup,
        login,
        googleLogin,
        setPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);