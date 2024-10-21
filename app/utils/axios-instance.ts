import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const axiosInstance = axios.create({ timeout: 5000 });

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("access_token");
    const customHost = await AsyncStorage.getItem("host");
    const host = customHost || process.env.EXPO_PUBLIC_API_URL;
    config.baseURL = host;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      console.error("Response Error:", {
        url: error.response.config.url,
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.error("Network Error:", error.message);
    }

    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem("access_token");
      router.push("/login");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
