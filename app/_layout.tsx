import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "../global.css";
import { AuthProvider, useAuth } from "@/app/context/auth";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { isLoggedIn } = useAuth();
  return (
    <GluestackUIProvider mode={"dark"}>
      <ThemeProvider value={DarkTheme}>
        <Stack
          initialRouteName="splash"
          screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}
        >
          <Stack.Screen name="splash" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          {isLoggedIn && <Stack.Screen name="home" />}
        </Stack>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
