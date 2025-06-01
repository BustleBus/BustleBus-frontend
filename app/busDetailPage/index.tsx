import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import { router } from "expo-router";

export default function BusDetailPage() {
  const [direction, setDirection] = useState<string>("");
  const [selectedBus, setSelectedBus] = useState<any | null>(null);
  const [busStations, setBusStations] = useState<any[]>([]);
  const [reverseStations, setReverseStations] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const removeBrackets = (str: string) => str.replace(/\s*\(.*?\)\s*/g, "").trim();

  // 최초 1회: 선택한 버스 로딩
  useEffect(() => {
    const loadSelectedBus = async () => {
      const selectedBusString = await AsyncStorage.getItem("selectedBus");
      if (!selectedBusString) return;
      const parsed = JSON.parse(selectedBusString);
      setDirection(parsed?.busEndPoint);
      if (Array.isArray(parsed?.stations)) {
        setSelectedBus(parsed);
      }
    };
    loadSelectedBus();
  }, []);

  // selectedBus가 로딩된 후: 실시간 버스 정보 갱신
  useEffect(() => {
    if (!selectedBus) return;

    const updateRealTime = async () => {
      try {
        const cityCodeStr = await AsyncStorage.getItem("selectedCity");
        if (!cityCodeStr) return;
        const cityCode = JSON.parse(cityCodeStr).TagoCityCode;

        const response = await axios.get(
          `https://bustlebus.duckdns.org/api/v1/searchLocation?busNo=${selectedBus.busNo}&cityCode=${cityCode}`
        );

        console.log(response.data.result);
        const realTimeData = response.data.result;
        // 방향별 실시간 위치 추출
        const startPointBuses =
          realTimeData.find(r => removeBrackets(r.startNodeName) === selectedBus.busStartPoint)
            ?.buses || [];
        const endPointBuses =
          realTimeData.find(r => removeBrackets(r.startNodeName) === selectedBus.busEndPoint)
            ?.buses || [];

        // 방향별 정류장 리스트 매핑
        const startPointStations = selectedBus.stations.map(station => {
          const bus = startPointBuses.find(b => removeBrackets(b.nodeName) === station.stationName);
          return {
            ...station,
            nodenm: station.stationName,
            nodeord: Number(station.idx),
            nodeid: bus?.nodeId,
            vehicleno: bus?.vehicleNo,
            congestionLevel: bus ? "정보 없음" : undefined,
            direction: "startPoint",
          };
        });

        const endPointStations = selectedBus.stations.map(station => {
          const bus = endPointBuses.find(b => removeBrackets(b.nodeName) === station.stationName);
          return {
            ...station,
            nodenm: station.stationName,
            nodeord: Number(station.idx),
            nodeid: bus?.nodeId,
            vehicleno: bus?.vehicleNo,
            congestionLevel: bus ? "정보 없음" : undefined,
            direction: "endPoint",
          };
        });

        // 상태 반영
        setBusStations(startPointStations);
        setReverseStations([...endPointStations].reverse());
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("실시간 버스 정보 조회 오류:", error);
      }
    };

    updateRealTime();

    intervalRef.current = setInterval(updateRealTime, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedBus]);

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

  const stationsToShow = direction === selectedBus?.busEndPoint ? busStations : reverseStations;

  return (
    <View style={styles.container}>
      <View style={styles.toggleGroup}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            direction === selectedBus?.busEndPoint && styles.activeButton,
          ]}
          onPress={() => setDirection(selectedBus?.busEndPoint)}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.buttonText,
              direction === selectedBus?.busEndPoint && styles.activeButtonText,
            ]}
          >
            {`${selectedBus?.busEndPoint} `}방향
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            direction === selectedBus?.busStartPoint && styles.activeButton,
          ]}
          onPress={() => setDirection(selectedBus?.busStartPoint)}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.buttonText,
              direction === selectedBus?.busStartPoint && styles.activeButtonText,
            ]}
          >
            {`${selectedBus?.busStartPoint} `}방향
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingHorizontal: 20,
          paddingBottom: 10,
        }}
      >
        <TouchableOpacity
          onPressIn={() => {
            router.push("/busTimeTable");
          }}
        >
          <Text style={styles.timeTableButton}>버스 시간표</Text>
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
    backgroundColor: "#F8F5FF",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#7E57C2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lastUpdated: {
    textAlign: "right",
    fontSize: 12,
    color: "#9E9E9E",
    fontFamily: "System",
    fontWeight: "500",
  },
  toggleGroup: {
    flexDirection: "row",
    margin: 20,
    marginBottom: 12,
    borderRadius: 50,
    backgroundColor: "#EDE7F6",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#7E57C2",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  toggleButton: {
    paddingHorizontal: 10,
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 50,
  },
  activeButton: {
    backgroundColor: "#7E57C2",
    shadowColor: "#7E57C2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 14,
    color: "#7E57C2",
    fontWeight: "600",
    fontFamily: "System",
  },
  activeButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  stationItem: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    elevation: 1,
    shadowColor: "#7E57C2",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#F3EBFF",
  },
  stationWithBus: {
    backgroundColor: "#F3EBFF",
    borderLeftWidth: 4,
    borderLeftColor: "#7E57C2",
    marginLeft: 20,
    elevation: 2,
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
    backgroundColor: "#7E57C2",
    marginBottom: 4,
    borderWidth: 2,
    borderColor: "#F3E5F5",
    zIndex: 2,
  },
  stationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D1C4E9",
    borderWidth: 2,
    borderColor: "#F8F5FF",
    zIndex: 1,
  },
  stationLine: {
    position: "absolute",
    left: 19,
    top: 24,
    bottom: -16,
    width: 2,
    backgroundColor: "#E1BEE7",
    zIndex: 0,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    color: "#2D2D2D",
    marginBottom: 6,
    fontWeight: "600",
    fontFamily: "System",
  },
  busInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  busNumber: {
    fontSize: 14,
    color: "#7E57C2",
    marginRight: 8,
    fontWeight: "700",
    fontFamily: "System",
  },
  congestionLevel: {
    fontSize: 12,
    color: "#7E57C2",
    fontFamily: "System",
    fontWeight: "500",
  },
  timeTableButton: {
    borderColor: "#333",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontWeight: "bold",
    fontSize: 10,
    color: "#333",
  },
});
