import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const realTimeBusDummy = {
  success: true,
  result: [
    {
      nodeord: 15,
      nodeid: "JJB381247008",
      nodenm: "경상국립대학교가좌캠퍼스후문",
      vehicleno: "경남71자5840",
      congestionLevel: "정보 없음",
    },
    {
      nodeord: 38,
      nodeid: "JJB381239018",
      nodenm: "경남서부보훈지청",
      vehicleno: "경남71자5887",
      congestionLevel: "정보 없음",
    },
  ],
};

const getRealTimeBusData = async () => {
  // TODO: 실제 API 요청으로 대체 가능
  return Promise.resolve(realTimeBusDummy);
};

export default function BusDetailPage() {
  const [direction, setDirection] = useState<"기점 방향" | "종점 방향">("기점 방향");
  const [busStations, setBusStations] = useState<any[]>([]);
  const [reverseStations, setReverseStations] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchInitialData = async () => {
    try {
      const selectedBusString = await AsyncStorage.getItem("selectedBus");
      if (!selectedBusString) return;

      const selectedBus = JSON.parse(selectedBusString);
      if (!Array.isArray(selectedBus?.stations)) return;

      const enriched = selectedBus.stations.map(station => {
        const bus = realTimeBusDummy.result.find(
          b => b.nodenm === station.stationName || b.nodeord === Number(station.idx)
        );

        return {
          ...station,
          nodenm: station.stationName,
          nodeord: Number(station.idx),
          nodeid: bus?.nodeid,
          vehicleno: bus?.vehicleno,
          congestionLevel: bus?.congestionLevel,
        };
      });

      setBusStations(enriched);
      setReverseStations([...enriched].reverse());
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error loading bus stations:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();

    intervalRef.current = setInterval(() => {
      fetchInitialData();
    }, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    const hasBus = !!item.vehicleno;

    return (
      <View style={[styles.stationItem, hasBus && styles.stationWithBus]}>
        <View style={styles.stationMarker}>
          {hasBus && <View style={styles.busIndicator} />}
          <View style={styles.stationDot} />
          {!hasBus && <View style={styles.stationLine} />}
        </View>
        <View style={styles.stationInfo}>
          <Text style={styles.stationName}>{item.nodenm || `정류장 ${item.nodeord}`}</Text>
          {hasBus && (
            <View style={styles.busInfoContainer}>
              <Text style={styles.busNumber}>{item.vehicleno}</Text>
              <Text style={styles.congestionLevel}>{item.congestionLevel || "정보 없음"}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const stationsToShow = direction === "기점 방향" ? busStations : reverseStations;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.lastUpdated}>
          {lastUpdated ? `마지막 업데이트: ${lastUpdated}` : "데이터 로드 중..."}
        </Text>
      </View>

      <View style={styles.toggleGroup}>
        <TouchableOpacity
          style={[styles.toggleButton, direction === "기점 방향" && styles.activeButton]}
          onPress={() => setDirection("기점 방향")}
        >
          <Text style={[styles.buttonText, direction === "기점 방향" && styles.activeButtonText]}>
            기점 방향
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, direction === "종점 방향" && styles.activeButton]}
          onPress={() => setDirection("종점 방향")}
        >
          <Text style={[styles.buttonText, direction === "종점 방향" && styles.activeButtonText]}>
            종점 방향
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={stationsToShow}
        renderItem={renderItem}
        keyExtractor={(item, index) => `station-${index}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  lastUpdated: {
    textAlign: "right",
    fontSize: 12,
    color: "#666",
  },
  toggleGroup: {
    flexDirection: "row",
    margin: 16,
    borderRadius: 50,
    backgroundColor: "#EDE7F6",
    overflow: "hidden",
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#EDE7F6",
    borderRadius: 50,
  },
  activeButton: {
    backgroundColor: "#D1C4E9",
  },
  buttonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  activeButtonText: {
    color: "#fff",
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  stationItem: {
    flexDirection: "row",
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  stationWithBus: {
    backgroundColor: "#f8f9ff",
  },
  stationMarker: {
    width: 40,
    alignItems: "center",
    marginRight: 12,
  },
  busIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    marginBottom: 4,
  },
  stationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ccc",
    borderWidth: 2,
    borderColor: "#fff",
  },
  stationLine: {
    position: "absolute",
    left: 19,
    top: 24,
    bottom: -12,
    width: 2,
    backgroundColor: "#e0e0e0",
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  busInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  busNumber: {
    fontSize: 14,
    color: "#007AFF",
    marginRight: 8,
    fontWeight: "500",
  },
  congestionLevel: {
    fontSize: 12,
    color: "#666",
  },
});
