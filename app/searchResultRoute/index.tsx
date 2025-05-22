import { ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import SearchResultListItem from "@/components/searchRouterResult/SearchResultListItem";
import SearchResultListItems from "@/components/searchRouterResult/SearchResultListItems";

export default function SearchResultRoute() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const selectedBusString = await AsyncStorage.getItem("selectedBus");

        if (!selectedBusString) {
          console.warn("❗ selectedBus 데이터 없음");
          return;
        }

        const { startX, startY, endX, endY } = JSON.parse(selectedBusString);
        console.log(startX, startY, endX, endY);
        if (!startX || !startY || !endX || !endY) {
          console.warn("❗ 필수 좌표 데이터가 누락되었습니다.");
          return;
        }

        const response = await axios.get(
          `http://takaoracle2.duckdns.org:5000/api/v1/searchBusRoutes?SX=${startX}&SY=${startY}&EX=${endX}&EY=${endY}`,
        );

        console.log("✅ 버스 경로 응답:", response.data.result);
        setData(response.data.result);
      } catch (error) {
        console.error("❌ 버스 경로 요청 실패:", error);
      }
    };

    getData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        {data.map((route, index) =>
          route.busSubPaths.length === 1 ? (
            <SearchResultListItem
              key={index}
              time={`${route.totalTime}분`}
              bus={`${route.busSubPaths[0].busNo}`}
              crowdLevel=""
            />
          ) : (
            <SearchResultListItems
              key={index}
              time={`${route.totalTime}분`}
              firstBus={`${route.busSubPaths[0].busNo}`}
              secondBus={`${route.busSubPaths[1].busNo}`}
              crowdLevel=""
            />
          ),
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
