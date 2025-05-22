// app/main/_layout.tsx or MainLayout.tsx
import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SearchRoute = {
  startPlaceName: string;
  endPlaceName: string;
};
export default function MainLayout() {
  const router = useRouter();
  const [searchRoute, setSearchRoute] = useState<SearchRoute | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const selectedBusString = await AsyncStorage.getItem("selectedBus");
        if (!selectedBusString) {
          console.warn("❗ selectedBus 데이터 없음");
          return;
        }
        const { startPlaceName, endPlaceName } = JSON.parse(selectedBusString);
        setSearchRoute({ startPlaceName, endPlaceName });
      } catch (error) {
        console.error("❌ 버스 경로 요청 실패:", error);
      }
    };

    getData();
  }, []);
  const shorten = (text: string | undefined, maxLen = 6) => {
    if (!text) return "";
    return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
  };
  return (
    <Stack
      screenOptions={{
        headerTitle: () => (
          <View>
            <Text
              style={{ fontSize: 16 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {shorten(searchRoute?.startPlaceName)} →{" "}
              {shorten(searchRoute?.endPlaceName)}
            </Text>
          </View>
        ),
        headerTitleAlign: "left",

        headerLeft: () => (
          <TouchableOpacity
            onPressIn={() => router.back()}
            style={{ paddingHorizontal: 12 }}
          >
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
        ),

        headerRight: () => (
          <TouchableOpacity
            onPressIn={() => {
              router.replace("/main");
            }}
            style={{ paddingHorizontal: 12 }}
          >
            <Ionicons name="home" size={24} />
          </TouchableOpacity>
        ),
      }}
    />
  );
}
