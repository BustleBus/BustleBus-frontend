import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListItemBox from "../common/ListItemBox";

type SearchHistoryItem = {
  startPlaceName: string;
  startAddress: string;
  startX: string;
  startY: string;
  endPlaceName: string;
  endAddress: string;
  endX: string;
  endY: string;
};
export default function RouterLog({
  text,
  index,
  onDelete,
  history,
}: {
  text: string;
  index: number;
  onDelete: (index: number) => void;
  history: SearchHistoryItem;
}) {
  const router = useRouter();
  // ✅ 검색 로그 클릭 시: index 저장 후 페이지 이동
  const handlePress = async () => {
    try {
      await AsyncStorage.setItem("selectedBus", JSON.stringify(history));
      router.navigate("/searchResultRoute");
    } catch (error) {
      console.error("❌ 선택된 버스 위치 저장 실패:", error);
    }
  };
  // 🔄 히스토리 삭제
  const handleDelete = async (index: number) => {
    try {
      const storedValue = await AsyncStorage.getItem("search_history");
      if (storedValue !== null) {
        const history = JSON.parse(storedValue);

        // 🔄 특정 인덱스 삭제
        const updatedHistory = history.filter((_, i) => i !== index);
        await AsyncStorage.setItem("search_history", JSON.stringify(updatedHistory));

        // 🔄 부모에게 알리기
        onDelete(index);
      }
    } catch (error) {
      console.error("🔄 검색 히스토리 삭제 오류:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ListItemBox onPress={handlePress} onRemove={() => handleDelete(index)}>
        <View style={{ gap: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 16, marginRight: 6 }}>🚩</Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontSize: 16, fontWeight: "600", color: "#2F3542", flex: 1 }}
            >
              {history.startPlaceName}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 16, marginRight: 6 }}>🏁</Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontSize: 16, fontWeight: "600", color: "#2F3542", flex: 1 }}
            >
              {history.endPlaceName}
            </Text>
          </View>
        </View>
      </ListItemBox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 3,
  },
});
