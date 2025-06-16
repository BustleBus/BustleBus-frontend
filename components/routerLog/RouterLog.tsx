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
    console.log("history", history);
    try {
      await AsyncStorage.setItem("selectedBus", JSON.stringify(history));
      console.log("✅ 선택된 버스 위치 저장 완료");
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
        console.log("🔄 검색 히스토리 삭제 완료:", updatedHistory);

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
        <Text numberOfLines={1} ellipsizeMode="tail">
          🚩 {history.startPlaceName}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          🏁 {history.endPlaceName}
        </Text>
      </ListItemBox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 3,
  },
});
