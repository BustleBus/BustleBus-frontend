import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Divider } from "react-native-paper";
import FavoriteRoute from "@/components/main/FavoriteRoute";
import FavoriteBus, { FavoriteBusItem } from "@/components/main/FavoriteBus";
import { useRouter } from "expo-router";
import { sharedStyles } from "@/styles/shared";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

type FavoriteRouteItem = {
  startPlaceName: string;
  endPlaceName: string;
  startX: string;
  startY: string;
  endX: string;
  endY: string;
};

export default function Index() {
  const [favoriteRoutes, setFavoriteRoutes] = useState<FavoriteRouteItem[]>([]);
  const [favoriteBuses, setFavoriteBuses] = useState<FavoriteBusItem[]>([]);
  const router = useRouter();
  console.log("favoriteBuses", favoriteBuses);
  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          // Load route favorites
          const routeJson = await AsyncStorage.getItem("routeFavorite");
          if (routeJson) {
            const parsedRoutes = JSON.parse(routeJson);
            setFavoriteRoutes(parsedRoutes);
          }

          // Load bus favorites
          const busJson = await AsyncStorage.getItem("busFavorite");
          if (busJson) {
            const parsedBuses = JSON.parse(busJson);
            setFavoriteBuses(parsedBuses);
          }
        } catch (e) {
          console.error("❌ 즐겨찾기 로드 실패:", e);
        }
      };

      loadFavorites();
    }, [])
  );

  const handleFavoriteDelete = async (route: FavoriteRouteItem) => {
    try {
      const updatedFavorites = favoriteRoutes.filter(
        r => r.startPlaceName !== route.startPlaceName || r.endPlaceName !== route.endPlaceName
      );
      setFavoriteRoutes(updatedFavorites);
      await AsyncStorage.setItem("routeFavorite", JSON.stringify(updatedFavorites));
    } catch (e) {
      console.error("❌ 경로 즐겨찾기 삭제 실패:", e);
    }
  };

  const handleBusFavoriteDelete = async (bus: FavoriteBusItem) => {
    try {
      const updatedFavorites = favoriteBuses.filter(
        b => b.busNumber !== bus.busNumber || b.busOrigin !== bus.busOrigin
      );
      setFavoriteBuses(updatedFavorites);
      await AsyncStorage.setItem("busFavorite", JSON.stringify(updatedFavorites));
    } catch (e) {
      console.error("❌ 버스 즐겨찾기 삭제 실패:", e);
    }
  };

  const handleBusPress = async (bus: FavoriteBusItem) => {
    try {
      // Save selected bus to AsyncStorage
      await AsyncStorage.setItem("selectedBus", JSON.stringify(bus));

      // Navigate to bus detail page
      router.push("/busDetailPage");
    } catch (e) {
      console.error("❌ 버스 정보 저장 실패:", e);
    }
  };

  return (
    <ScrollView>
      <View style={styles.body}>
        <View style={{ flexDirection: "column" }}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.navigate("/searchRoute")}
          >
            <Text>경로검색</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => router.navigate("/searchBus")}>
            <Text>버스번호 검색</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>경로 즐겨 찾기</Text>
          <Divider style={styles.divider} />
          <View style={sharedStyles.column}>
            {Array.from({ length: Math.ceil(favoriteRoutes.length / 2) }).map((_, rowIdx) => {
              const pair = favoriteRoutes.slice(rowIdx * 2, rowIdx * 2 + 2);
              return (
                <View key={rowIdx} style={sharedStyles.row}>
                  {pair.map((route, i) => (
                    <View key={i} style={[sharedStyles.flexOne, styles.padding]}>
                      <FavoriteRoute
                        route={route}
                        start={route.startPlaceName}
                        end={route.endPlaceName}
                        onRemove={() => handleFavoriteDelete(route)}
                      />
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>버스번호 즐겨찾기</Text>
          <Divider style={styles.divider} />
          <View style={sharedStyles.column}>
            {Array.from({ length: Math.ceil(favoriteBuses.length / 2) }).map((_, rowIdx) => {
              const pair = favoriteBuses.slice(rowIdx * 2, rowIdx * 2 + 2);
              return (
                <View key={rowIdx} style={sharedStyles.row}>
                  {pair.map((bus, i) => (
                    <View key={i} style={[sharedStyles.flexOne, styles.padding]}>
                      <FavoriteBus
                        onPress={() => handleBusPress(bus)}
                        onDelete={() => handleBusFavoriteDelete(bus)}
                      >
                        {bus.busNo}번
                      </FavoriteBus>
                    </View>
                  ))}
                </View>
              );
            })}
            {favoriteBuses.length === 0 && (
              <Text style={styles.emptyText}>저장된 버스가 없습니다</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#000",
  },
  body: {
    padding: 10,
  },
  padding: {
    padding: 4,
  },
  menuButton: {
    backgroundColor: "#e8def8",
    marginHorizontal: 5,
    marginVertical: 10,
    padding: 20,
    alignItems: "center",
    borderRadius: 7,
    borderColor: "#79747e",
    borderWidth: 0.1,
  },
  section: {
    marginTop: 25,
  },
  divider: {
    marginTop: 5,
    marginBottom: 10,
    height: 2,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 10,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
