import { ScrollView, StyleSheet, View, Modal, Text, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import SearchResultListItem from "@/components/searchRouterResult/SearchResultListItem";
import SearchResultListItems from "@/components/searchRouterResult/SearchResultListItems";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { loadingAtom } from "@/atoms/loadingState";
import { Colors } from "@/styles/shared";

export default function SearchResultRoute() {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBuses, setSelectedBuses] = useState<{
    firstBus: string;
    secondBus: string | null;
  }>({ firstBus: "", secondBus: null });
  const router = useRouter();
  const [, setLoading] = useAtom(loadingAtom);
  const fetchBusData = async (busNo: string) => {
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

      console.log("API 응답 데이터:", response.data.result[0]);
      await AsyncStorage.setItem("selectedBus", JSON.stringify(response.data.result[0]));
      console.log("저장됨");
      setLoading(false);
      router.navigate("/busDetailPage");
    } catch (error) {
      console.error("버스 검색 중 오류 발생:", error);
    }
  };

  const removeBrackets = (str: string) => str.replace(/\s*\(.*?\)\s*/g, "").trim();
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const selectedBusString = await AsyncStorage.getItem("selectedBus");

        if (!selectedBusString) {
          console.warn("❗ selectedBus 데이터 없음");
          return;
        }

        const { startX, startY, endX, endY } = JSON.parse(selectedBusString);
        if (!startX || !startY || !endX || !endY) {
          console.warn("❗ 필수 좌표 데이터가 누락되었습니다.");
          return;
        }

        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/api/v1/searchBusRoutes?SX=${startX}&SY=${startY}&EX=${endX}&EY=${endY}`
        );

        const routeList = response?.data?.result?.result;

        if (!Array.isArray(routeList)) {
          console.warn("❗ 응답 데이터 형식이 올바르지 않습니다.");
          return;
        }

        console.log("✅ 버스 경로 응답:", routeList);
        setData(routeList);
      } catch (error) {
        console.error("❌ 버스 경로 요청 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          {data.map((route, index) => (
            <View key={index} style={{ paddingHorizontal: 2 }}>
              {route.busSubPaths.length === 1 ? (
                <SearchResultListItem
                  key={route.busSubPaths[0].routeId}
                  time={`${route.totalTime}분`}
                  bus={`${route.busSubPaths[0].busOrigin}`}
                  crowdLevel=""
                  busNo={`${route.busSubPaths[0].busNo}`}
                />
              ) : (
                <SearchResultListItems
                  key={route.busSubPaths[0].routeId}
                  time={`${route.totalTime}분`}
                  firstBus={`${route.busSubPaths[0].busOrigin}`}
                  secondBus={`${route.busSubPaths[1]?.busOrigin ?? "?"}`}
                  crowdLevel=""
                  onPress={(firstBus, secondBus) => {
                    setSelectedBuses({ firstBus, secondBus });
                    setModalVisible(true);
                  }}
                />
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>탑승할 버스를 선택하세요</Text>

            <TouchableOpacity
              style={styles.busOptionButton}
              onPress={() => {
                setModalVisible(false);
                fetchBusData(removeBrackets(selectedBuses.firstBus));
              }}
            >
              <Text style={styles.busText}>🚌 {selectedBuses.firstBus}</Text>
            </TouchableOpacity>

            {selectedBuses.secondBus && (
              <TouchableOpacity
                style={styles.busOptionButton}
                onPress={() => {
                  setModalVisible(false);
                  fetchBusData(removeBrackets(selectedBuses.secondBus));
                }}
              >
                <Text style={styles.busText}>🚌 {selectedBuses.secondBus}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    marginTop: 10,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },

  busOptionButton: {
    backgroundColor: "#f0f0f5",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
  },

  busText: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },

  cancelButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    alignItems: "center",
  },

  cancelText: {
    color: "#888",
    fontSize: 15,
    fontWeight: "500",
  },
});
