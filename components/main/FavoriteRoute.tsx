import { Text, View } from "react-native";
import ListItemBox from "@/components/common/ListItemBox";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FavoriteRouteItem = {
  startPlaceName: string;
  endPlaceName: string;
  startX: string;
  startY: string;
  endX: string;
  endY: string;
};

export default function FavoriteRoute({
  start,
  end,
  route,
  onRemove,
}: {
  start: string;
  end: string;
  route: FavoriteRouteItem;
  onRemove?: () => void;
}) {
  const router = useRouter();

  const handleClick = async () => {
    try {
      console.log("route", route);
      await AsyncStorage.setItem("selectedBus", JSON.stringify(route));
      console.log("✅ selectedBus 저장 완료:", route);
      router.push("/searchResultRoute"); // 또는 navigate
    } catch (e) {
      console.error("❌ selectedBus 저장 실패:", e);
    }
  };

  return (
    <ListItemBox onPress={handleClick} onRemove={onRemove}>
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 16, marginRight: 6 }}>🚩</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontSize: 16, fontWeight: "600", color: "#2F3542", flex: 1 }}
          >
            {start}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 16, marginRight: 6 }}>🏁</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontSize: 16, fontWeight: "600", color: "#2F3542", flex: 1 }}
          >
            {end}
          </Text>
        </View>
      </View>
    </ListItemBox>
  );
}
