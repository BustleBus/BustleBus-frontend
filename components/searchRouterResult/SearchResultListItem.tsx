import { StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ListItemBox from "@/components/common/ListItemBox";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { loadingAtom } from "@/atoms/loadingState";
import { useAtom } from "jotai";
import { Colors } from "@/styles/shared";

export default function SearchResultListItem({
  time,
  bus,
  crowdLevel,
  busNo,
  startName,
  endName,
}: {
  time: string;
  bus: string;
  crowdLevel: string;
  busNo: string;
  startName?: string;
  endName?: string;
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
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/v1/busDetails?busNo=${busNo}&cityCode=${odsayCityCode}`
      );

      await AsyncStorage.setItem("selectedBus", JSON.stringify(response.data.result[0]));
      
      // Store route context if coming from route search
      if (startName && endName) {
        await AsyncStorage.setItem("routeContext", JSON.stringify({
          startName,
          endName,
          fromRouteSearch: true
        }));
      } else {
        await AsyncStorage.removeItem("routeContext");
      }
      
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
            <Ionicons name="bus-outline" size={20} color="blue" style={{ marginTop: 2 }} />
            <Text style={styles.timeText}>{time}</Text>
          </View>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
    marginVertical: 6,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#F0F4F8",
    padding: 8,
    borderRadius: 12,
    minWidth: 60,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  optimalText: {
    color: Colors.primary,
    marginBottom: 4,
    fontSize: 12,
    fontWeight: "700",
  },
  timeText: {
    color: Colors.text,
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
  },
  routeText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    justifyContent: "center",
    textAlignVertical: "center",
  },
  routeMultiView: {
    color: Colors.text,
    flexDirection: "column",
  },
  crowdText: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },
});
