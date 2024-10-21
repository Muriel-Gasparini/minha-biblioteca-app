import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import axiosInstance from "../utils/axios-instance";
import { isAxiosError } from "axios";
import { AppState, AppStateStatus } from "react-native";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await retryRequest(() => axiosInstance.get("/me"));
        setIsLoggedIn(true);
        router.replace("./home");
      } catch (error) {
        router.replace("./login");
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    const checkToken = async () => {
      const accessToken = await AsyncStorage.getItem("access_token");
      if (!accessToken) {
        checkAuth();
      } else {
        setIsLoggedIn(true);
        router.replace("./home");
      }
    };
    checkToken();
  }, [isLoggedIn]);

  const retryRequest = async (requestFn: () => Promise<any>, retries = 3) => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        if (attempt === retries - 1) throw error;
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await retryRequest(() =>
        axiosInstance.post("/auth/login", {
          email,
          senha: password,
        })
      );
      await AsyncStorage.setItem("access_token", response.data.access_token);
      setIsLoggedIn(true);
      setError(null);
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        setError(
          err.response.data.message || "O login falhou. Tente novamente."
        );
      } else {
        setError("Erro desconhecido. Tente novamente.");
      }
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("access_token");
    setIsLoggedIn(false);
  };

  const checkAuthStatus = async () => {
    try {
      const response = await axiosInstance.get("/auth/status");
      setIsLoggedIn(response.data.isAuthenticated);
    } catch (error) {
      console.error("Failed to check auth status", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        checkAuthStatus();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, login, logout, error, setIsLoggedIn }}
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
