import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

type BusInfo = {
  busOrigin: string;
  busNumber: string;
  // Add other bus properties as needed
};

export default function MainLayout() {
  const router = useRouter();
  const [bus, setBus] = useState<BusInfo | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const selectedBusString = await AsyncStorage.getItem("selectedBus");
        if (!selectedBusString) {
          console.warn("❗ selectedBus 데이터 없음");
          return;
        }

        const selectedBus = JSON.parse(selectedBusString);
        setBus(selectedBus);

        // Load favorite status
        const favoriteString = await AsyncStorage.getItem("busFavorite");
        const favorite = favoriteString ? (JSON.parse(favoriteString) as BusInfo[]) : [];
        
        const exists = favorite.some(
          (item) => item.busNumber === selectedBus.busNumber
        );
        setIsFavorited(exists);
      } catch (error) {
        console.error("❌ 데이터 로딩 실패:", error);
      }
    };
    fetchBus();
  }, []);

  const toggleFavorite = async () => {
    if (!bus) return;

    try {
      const favoriteString = await AsyncStorage.getItem("busFavorite");
      const favorite = favoriteString ? (JSON.parse(favoriteString) as BusInfo[]) : [];
      
      const exists = favorite.some(
        (item) => item.busNumber === bus.busNumber
      );

      let updatedFavorite: BusInfo[];
      if (exists) {
        updatedFavorite = favorite.filter(
          (item) => item.busNumber !== bus.busNumber
        );
        setIsFavorited(false);
      } else {
        updatedFavorite = [...favorite, bus];
        setIsFavorited(true);
      }

      await AsyncStorage.setItem(
        "busFavorite",
        JSON.stringify(updatedFavorite)
      );
    } catch (error) {
      console.error("❌ 즐겨찾기 업데이트 실패:", error);
    }
  };

  return (
    <Stack
      screenOptions={{
        headerTitle: () => (
          <Text style={{ fontSize: 16 }}>
            {" "}
            {bus?.busOrigin ? `${bus.busOrigin}` : "버스 정보 없음"}
          </Text>
        ),
        headerTitleAlign: "left",

        headerLeft: () => (
          <TouchableOpacity onPressIn={() => router.back()} style={{ paddingHorizontal: 12 }}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
        ),

        headerRight: () => (
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={toggleFavorite} style={{ paddingHorizontal: 12 }}>
              <Ionicons
                name={isFavorited ? "star" : "star-outline"}
                size={24}
                color={isFavorited ? "#f1c40f" : "black"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPressIn={() => {
                router.replace("/main");
              }}
              style={{ paddingHorizontal: 12 }}
            >
              <Ionicons name="home" size={24} />
            </TouchableOpacity>
          </View>
        ),
      }}
    />
  );
}
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
  },
});
