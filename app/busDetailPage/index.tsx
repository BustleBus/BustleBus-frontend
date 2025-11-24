import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState, useRef, useMemo } from "react";
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
  const [routeContext, setRouteContext] = useState<{
    startName: string;
    endName: string;
    fromRouteSearch: boolean;
  } | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const removeBrackets = (str: string) => str.replace(/\s*\(.*?\)\s*/g, "").trim();
  const [, setLoading] = useAtom(loadingAtom);
  
  // 최초 1회: 선택한 버스 로딩 및 경로 검색 컨텍스트 로딩
  useEffect(() => {
    const loadSelectedBus = async () => {
      try {
        const selectedBusString = await AsyncStorage.getItem("selectedBus");
        if (!selectedBusString) return;
        let parsed = JSON.parse(selectedBusString);

        // If stations are missing (e.g. from favorites), fetch full details
        if (!parsed.stations || parsed.stations.length === 0) {
          setLoading(true);
          const cityCodeStr = await AsyncStorage.getItem("selectedCity");
          if (cityCodeStr) {
            const cityCode = JSON.parse(cityCodeStr).OdsayCityCode;
            const busNo = parsed.busNumber || parsed.busNo;
            
            const response = await axios.get(
              `${process.env.EXPO_PUBLIC_API_URL}/api/v1/busDetails?busNo=${busNo}&cityCode=${cityCode}`
            );
            
            if (response.data && response.data.result && response.data.result.length > 0) {
              // Find the correct bus if multiple results (though usually one for specific busNo)
              // We might need to match by origin/destination if possible, but for now take the first or match busNo
              const busDetail = response.data.result.find((b: any) => b.busNo === busNo) || response.data.result[0];
              
              // Merge fetched details into parsed object
              parsed = {
                ...parsed,
                ...busDetail,
                stations: busDetail.stations || [],
                busEndPoint: busDetail.busEndPoint,
                busStartPoint: busDetail.busStartPoint,
              };
              
              // Update selectedBus in storage so it has the full data for next time (optional but good for caching)
              // await AsyncStorage.setItem("selectedBus", JSON.stringify(parsed));
            }
          }
          setLoading(false);
        }

        // Load route context if available
        const routeContextString = await AsyncStorage.getItem("routeContext");
        const routeCtx = routeContextString ? JSON.parse(routeContextString) : null;

        // Only set default direction if NOT from route search
        // Route search will auto-select the correct direction later
        if (!routeCtx?.fromRouteSearch) {
          setDirection(parsed?.busEndPoint);
        }

        if (Array.isArray(parsed?.stations)) {
          setSelectedBus(parsed);
          // 초기 정류장 데이터 설정 (실시간 정보 실패 시에도 노선이 보이도록 함)
          const initialStations = parsed.stations.map((station: any) => ({
            ...station,
            nodenm: station.stationName,
            nodeord: Number(station.idx),
            congestionLevel: "정보 없음",
          }));
          setBusStations(initialStations);
          setReverseStations([...initialStations].reverse());
        }

        if (routeCtx) {
          setRouteContext(routeCtx);
        }
      } catch (error) {
        console.error("Error loading bus details:", error);
        setLoading(false);
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

        let response;
        let retries = 3;
        while (retries > 0) {
          try {
            response = await axios.get(
              `${process.env.EXPO_PUBLIC_API_URL}/api/v1/searchLocation?busNo=${selectedBus.busNo}&cityCode=${cityCode}`
            );
            break; // 성공 시 루프 탈출
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 500) {
              console.warn(`500 Error detected. Retrying... (${3 - retries + 1}/3)`);
              retries--;
              if (retries === 0) throw error; // 재시도 횟수 초과 시 에러 throw
              await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기 후 재시도
            } else {
              throw error; // 500 에러가 아니면 바로 throw
            }
          }
        }

        if (!response || !response.data) throw new Error("No response data");

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

  // Determine which stations to show based on direction
  const stationsToShow = useMemo(() => {
    return direction === selectedBus?.busEndPoint ? busStations : reverseStations;
  }, [direction, selectedBus, busStations, reverseStations]);

  // Auto-select the correct direction tab when coming from route search
  useEffect(() => {
    if (routeContext?.fromRouteSearch && selectedBus && busStations.length > 0 && reverseStations.length > 0) {
      
      const startNameNormalized = removeBrackets(routeContext.startName);
      const endNameNormalized = removeBrackets(routeContext.endName);
      
      // Helper to find index
      const findIndex = (stations: any[], name: string) => 
        stations.findIndex(s => removeBrackets(s.nodenm) === name);

      // Check EndPoint Direction (busStations)
      const startIdxEndPoint = findIndex(busStations, startNameNormalized);
      const endIdxEndPoint = findIndex(busStations, endNameNormalized);
      
      // Check StartPoint Direction (reverseStations)
      const startIdxStartPoint = findIndex(reverseStations, startNameNormalized);
      const endIdxStartPoint = findIndex(reverseStations, endNameNormalized);

      // Logic: Prefer direction where Start appears BEFORE End (Start < End)
      // If End is not found (-1), we can't strictly determine order, but if Start is found, we might default to it.
      // However, usually for a valid route, both should be present in the correct direction.

      const isValidEndPoint = startIdxEndPoint !== -1 && endIdxEndPoint !== -1 && startIdxEndPoint < endIdxEndPoint;
      const isValidStartPoint = startIdxStartPoint !== -1 && endIdxStartPoint !== -1 && startIdxStartPoint < endIdxStartPoint;

      if (isValidEndPoint) {
        setDirection(selectedBus.busEndPoint);
      } else if (isValidStartPoint) {
        setDirection(selectedBus.busStartPoint);
      } else {
        // Fallback: If we can't determine by order (maybe circular or partial data), 
        // just try to find where Start exists.
        if (startIdxEndPoint !== -1) {
           setDirection(selectedBus.busEndPoint);
        } else if (startIdxStartPoint !== -1) {
           setDirection(selectedBus.busStartPoint);
        }
      }
    }
  }, [routeContext, selectedBus, busStations, reverseStations]);

  // Auto-scroll to departure station when coming from route search
  useEffect(() => {
    if (routeContext?.fromRouteSearch && stationsToShow.length > 0) {
      const departureIndex = stationsToShow.findIndex(
        station => removeBrackets(station.nodenm) === removeBrackets(routeContext.startName)
      );
      
      if (departureIndex !== -1 && flatListRef.current) {
        // Small delay to ensure FlatList is fully rendered
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: departureIndex,
            animated: true,
            viewPosition: 0.2, // Position the item at 20% from top for better visibility
          });
        }, 300);
      }
    }
  }, [stationsToShow, routeContext]);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
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
    
    // Check if this station should show departure or arrival indicator
    const isDeparture = routeContext?.fromRouteSearch && 
                        removeBrackets(item.nodenm) === removeBrackets(routeContext.startName);
    const isArrival = routeContext?.fromRouteSearch && 
                      removeBrackets(item.nodenm) === removeBrackets(routeContext.endName);
    
    return (
      <View style={[styles.stationItem, hasBus && styles.stationWithBus]}>
        <View style={styles.stationMarker}>
          {hasBus && <View style={styles.busIndicator} />}
          <View style={styles.stationDot} />
          {!hasBus && <View style={styles.stationLine} />}
        </View>
        <View style={styles.stationInfo}>
          <View style={styles.stationNameContainer}>
            <Text style={styles.stationName}>{item.nodenm || `정류장 ${item.nodeord}`}</Text>
            {isDeparture && (
              <View style={styles.departureBadge}>
                <Text style={styles.badgeText}>출발</Text>
              </View>
            )}
            {isArrival && (
              <View style={styles.arrivalBadge}>
                <Text style={styles.badgeText}>도착</Text>
              </View>
            )}
          </View>
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
        ref={flatListRef}
        data={stationsToShow}
        renderItem={renderItem}
        keyExtractor={(item, index) => `station-${index}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={(info) => {
          // Fallback: wait and retry scrolling
          setTimeout(() => {
            flatListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }, 100);
        }}
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
  stationNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stationName: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
    fontWeight: "600",
    fontFamily: "System",
  },
  departureBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  arrivalBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
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
