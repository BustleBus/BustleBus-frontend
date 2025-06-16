import { StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ListItemBox from "@/components/common/ListItemBox";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { loadingAtom } from "@/atoms/loadingState";
import { useAtom } from "jotai";

export default function SearchResultListItem({
  time,
  bus,
  crowdLevel,
  busNo,
}: {
  time: string;
  bus: string;
  crowdLevel: string;
  busNo: string;
}) {
  const [, setLoading] = useAtom(loadingAtom);
  const fetchBusData = async () => {
    try {
      setLoading(true);

      const cityCode = await AsyncStorage.getItem("selectedCity");

      if (!cityCode) {
        console.error("도시 정보를 찾을 수 없습니다.");
        return;
      }
      const odsayCityCode = JSON.parse(cityCode).OdsayCityCode;
      console.log("버스번호:", busNo);
      console.log("도시 코드:", odsayCityCode);
      const response = await axios.get(
        `https://bustlebus.duckdns.org/api/v1/busDetails?busNo=${busNo}&cityCode=${odsayCityCode}`
      );

      console.log("API 응답 데이터:", response.data.result[0]);
      await AsyncStorage.setItem("selectedBus", JSON.stringify(response.data.result[0]));
      console.log("저장됨");
      setLoading(false);
      router.navigate("/busDetailPage");
    } catch (error) {
      console.error("버스 검색 중 오류 발생:", error);
    }
  };
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ListItemBox
        showClose={false}
        onPress={() => {
          fetchBusData();
        }}
      >
        <View style={styles.card}>
          <View style={styles.leftSection}>
            <Text style={styles.optimalText}>최적</Text>
            <Ionicons name="bus-outline" size={20} color="blue" style={{ marginTop: 2 }} />
            <Text style={styles.timeText}>{time}</Text>
          </View>
          <View>
            <Text style={styles.routeText}>
              <Text>{bus}</Text>
            </Text>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.crowdText}>{crowdLevel}</Text>
          </View>
        </View>
      </ListItemBox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 16,
    borderColor: "black",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
  },
  leftSection: {
    alignItems: "center",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  optimalText: {
    color: "#555",
    marginBottom: 4,
    fontSize: 14,
  },
  timeText: {
    color: "#555",
    marginTop: 4,
    fontSize: 14,
  },
  routeText: {
    color: "#000",
    fontSize: 16,
  },

  routeMultiView: {
    color: "#000",
    flexDirection: "column",
  },
  crowdText: {
    color: "#d32f2f",
    fontWeight: "bold",
    fontSize: 16,
  },
});
