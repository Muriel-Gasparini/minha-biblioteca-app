import React, { useEffect } from "react";
import { Animated, Easing } from "react-native";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Book } from "lucide-react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";

const SplashScreen = () => {
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <SafeAreaView>
      <LinearGradient
        className="md:flex flex-col items-center justify-center md:w-full h-full"
        colors={["#111827", "#1e3a8a", "#111827"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Book color="#fff" size={100} />
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SplashScreen;
