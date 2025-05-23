import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SearchRoute = {
  startPlaceName: string;
  endPlaceName: string;
  startX: string;
  startY: string;
  endX: string;
  endY: string;
};

export default function MainLayout() {
  const router = useRouter();
  const [searchRoute, setSearchRoute] = useState<SearchRoute | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const selectedBusString = await AsyncStorage.getItem("selectedBus");
        if (!selectedBusString) {
          console.warn("❗ selectedBus 데이터 없음");
          return;
        }

        const route: SearchRoute = JSON.parse(selectedBusString);
        setSearchRoute(route);

        const favoriteString = await AsyncStorage.getItem("routeFavorite");
        const favorite = favoriteString
          ? (JSON.parse(favoriteString) as SearchRoute[])
          : [];

        const exists = favorite.some(
          (item) =>
            item.startPlaceName === route.startPlaceName &&
            item.endPlaceName === route.endPlaceName &&
            item.startX === route.startX &&
            item.startY === route.startY &&
            item.endX === route.endX &&
            item.endY === route.endY,
        );

        setIsFavorited(exists);
      } catch (error) {
        console.error("❌ 데이터 로딩 실패:", error);
      }
    };

    getData();
  }, []);

  const toggleFavorite = async () => {
    if (!searchRoute) return;

    const favoriteString = await AsyncStorage.getItem("routeFavorite");
    const favorite = favoriteString
      ? (JSON.parse(favoriteString) as SearchRoute[])
      : [];

    const exists = favorite.some(
      (item) =>
        item.startPlaceName === searchRoute.startPlaceName &&
        item.endPlaceName === searchRoute.endPlaceName &&
        item.startX === searchRoute.startX &&
        item.startY === searchRoute.startY &&
        item.endX === searchRoute.endX &&
        item.endY === searchRoute.endY,
    );

    let updatedFavorite: SearchRoute[];
    if (exists) {
      updatedFavorite = favorite.filter(
        (item) =>
          !(
            item.startPlaceName === searchRoute.startPlaceName &&
            item.endPlaceName === searchRoute.endPlaceName &&
            item.startX === searchRoute.startX &&
            item.startY === searchRoute.startY &&
            item.endX === searchRoute.endX &&
            item.endY === searchRoute.endY
          ),
      );
      setIsFavorited(false);
    } else {
      updatedFavorite = [...favorite, searchRoute];
      setIsFavorited(true);
    }

    await AsyncStorage.setItem(
      "routeFavorite",
      JSON.stringify(updatedFavorite),
    );
  };

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
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={toggleFavorite}
              style={{ paddingHorizontal: 12 }}
            >
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
