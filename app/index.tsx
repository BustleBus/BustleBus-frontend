import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

// 스플래시 자동 숨김 방지
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const router = useRouter();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const checkFlow = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 3초 대기

      const hasCompletedSetup = await AsyncStorage.getItem("hasCompletedSetup");

      if (hasCompletedSetup !== "true") {
        router.replace("/onboarding");
      } else {
        router.replace("/main");
      }

      setAppReady(true);
      await SplashScreen.hideAsync();
    };

    checkFlow();
  }, []);

  return <View />; // 아무것도 렌더링하지 않음
}
