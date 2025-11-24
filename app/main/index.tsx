import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Divider } from "react-native-paper";
import FavoriteRoute from "@/components/main/FavoriteRoute";
import FavoriteBus from "@/components/main/FavoriteBus";
import { useRouter } from "expo-router";
import { Colors, sharedStyles } from "@/styles/shared";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { FavoriteBusItem, FavoriteRouteItem } from "@/types/bus";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
      await AsyncStorage.removeItem("routeContext"); // Clear route context

      // Navigate to bus detail page
      router.push("/busDetailPage");
    } catch (e) {
      console.error("❌ 버스 정보 저장 실패:", e);
    }
  };

  return (
    <ScrollView>
      <View style={styles.body}>
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.navigate("/searchRoute")}
          >
            <View style={{ alignItems: "center" }}>
              <Ionicons name="navigate" size={32} color={Colors.primary} />
              <Text style={styles.menuText}>경로찾기</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => router.navigate("/searchBus")}>
            <View style={{ alignItems: "center" }}>
              <Ionicons name="search" size={32} color={Colors.secsub} />
              <Text style={styles.menuText}>버스번호 검색</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
            <LinearGradient
              colors={[Colors.primary, Colors.secsub]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 6,
                height: 24,
                borderRadius: 4,
                marginRight: 10,
              }}
            />
            <Text style={styles.sectionTitle}>즐겨 찾는 경로</Text>
          </View>

          <View style={sharedStyles.column}>
            {favoriteRoutes.map((route, i) => (
              <View key={i} style={styles.padding}>
                <FavoriteRoute
                  route={route}
                  start={route.startPlaceName}
                  end={route.endPlaceName}
                  onRemove={() => handleFavoriteDelete(route)}
                />
              </View>
            ))}
            {favoriteRoutes.length === 0 && (
              <Text style={styles.emptyText}>저장된 경로가 없습니다</Text>
            )}
          </View>
        </View>
        <View style={styles.section}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
            <LinearGradient
              colors={[Colors.secsub, Colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 6,
                height: 24,
                borderRadius: 4,
                marginRight: 10,
              }}
            />
            <Text style={styles.sectionTitle}>즐겨찾는 버스</Text>
          </View>
          <View style={sharedStyles.column}>
            {favoriteBuses.map((bus, i) => (
              <View key={i} style={styles.padding}>
                <FavoriteBus
                  onPress={() => handleBusPress(bus)}
                  onDelete={() => handleBusFavoriteDelete(bus)}
                  busNo={bus.busNumber}
                  start={bus.busOrigin}
                  end={undefined}
                />
              </View>
            ))}
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
    flex: 1,
    paddingVertical: 20,
    marginHorizontal: 8,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },

  menuText: {
    marginTop: 8,
    fontSize: 16,
    color: Colors.text,
    fontWeight: "700",
  },

  section: {
    marginTop: 30,
    paddingHorizontal: 5,
  },
  divider: {
    marginTop: 5,
    marginBottom: 10,
    height: 2,
    backgroundColor: Colors.sub,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: Colors.textSub,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.5,
  },
});
