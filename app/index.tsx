// app/index.tsx

import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkFlow = async () => {
      // 3초 스플래시 효과
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const hasCompletedSetup = await AsyncStorage.getItem("hasCompletedSetup");

      if (hasCompletedSetup !== "true") {
        router.replace("/onboarding");
      } else {
        router.replace("/main");
      }
    };

    checkFlow();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🚌 버슬버스</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
