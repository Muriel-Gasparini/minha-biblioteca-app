import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";

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
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await axios.get("/me");
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

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://192.168.1.23:3000/auth/login", {
        email,
        senha: password,
      });
      await AsyncStorage.setItem("access_token", response.data.access_token);
      setIsLoggedIn(true);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
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
