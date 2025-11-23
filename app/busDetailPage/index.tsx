import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import { router } from "expo-router";

import { useAtom } from "jotai";
import { loadingAtom } from "@/atoms/loadingState";
import { Colors } from "@/styles/shared"; // Colors import

export default function BusDetailPage() {
  const [direction, setDirection] = useState<string>("");
  const [selectedBus, setSelectedBus] = useState<any | null>(null);
  const [busStations, setBusStations] = useState<any[]>([]);
  const [reverseStations, setReverseStations] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const removeBrackets = (str: string) => str.replace(/\s*\(.*?\)\s*/g, "").trim();
  const [, setLoading] = useAtom(loadingAtom);
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
        setLoading(true);
        const cityCodeStr = await AsyncStorage.getItem("selectedCity");
        if (!cityCodeStr) return;
        const cityCode = JSON.parse(cityCodeStr).TagoCityCode;

        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/api/v1/searchLocation?busNo=${selectedBus.busNo}&cityCode=${cityCode}`
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
            congestionLevel: bus?.congestionLevel ?? "정보 없음", // ← 수정
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
            congestionLevel: bus?.congestionLevel ?? "정보 없음", // ← 수정
            direction: "endPoint",
          };
        });

        // 상태 반영
        setBusStations(startPointStations);
        setReverseStations([...endPointStations].reverse());
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("실시간 버스 정보 조회 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    updateRealTime();

    intervalRef.current = setInterval(updateRealTime, 15000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedBus]);

  const renderItem = ({ item }: { item: any }) => {
    const hasBus = !!item.vehicleno;
    const getStationColor = (level: string) => {
      switch (level) {
        case "여유":
          return "#81C784"; // 초록색
        case "보통":
          return "#F57F17"; // 주황색
        case "혼잡":
          return "red"; // 빨간색
        default:
          return Colors.secsub; // 기본 회색
      }
    };
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
              <Text style={[styles.busNumber, { color: getStationColor(item.congestionLevel) }]}>
                {item.vehicleno}
              </Text>
              <Text
                style={[styles.congestionLevel, { color: getStationColor(item.congestionLevel) }]}
              >
                {item.congestionLevel || "정보 없음"}
              </Text>
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
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  toggleGroup: {
    flexDirection: "row",
    margin: 20,
    marginBottom: 12,
    borderRadius: 30,
    backgroundColor: Colors.surface,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toggleButton: {
    paddingHorizontal: 10,
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 24,
  },
  activeButton: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 14,
    color: Colors.textSub,
    fontWeight: "600",
    fontFamily: "System",
  },
  activeButtonText: {
    color: Colors.surface,
    fontWeight: "800",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  stationItem: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 12,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  stationWithBus: {
    backgroundColor: "#FFF5F5", // Light tint of primary
    borderWidth: 1,
    borderColor: Colors.primary,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
  },
  stationMarker: {
    width: 40,
    alignItems: "center",
    marginRight: 12,
    justifyContent: "center",
  },
  busIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: "white",
    zIndex: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  stationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.textSub,
    borderWidth: 2,
    borderColor: Colors.surface,
    zIndex: 1,
  },
  stationLine: {
    position: "absolute",
    left: 19,
    top: 24,
    bottom: -24,
    width: 2,
    backgroundColor: "#E0E0E0",
    zIndex: 0,
  },
  stationInfo: {
    flex: 1,
    justifyContent: "center",
  },
  stationName: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
    fontWeight: "600",
    fontFamily: "System",
  },
  busInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  busNumber: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 8,
    fontWeight: "800",
    fontFamily: "System",
  },
  congestionLevel: {
    fontSize: 12,
    color: Colors.primary,
    fontFamily: "System",
    fontWeight: "600",
  },
  timeTableButton: {
    backgroundColor: Colors.secsub,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontWeight: "700",
    fontSize: 14,
    color: "white",
    borderRadius: 20,
    overflow: "hidden",
    textAlign: "center",
    shadowColor: Colors.secsub,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});
