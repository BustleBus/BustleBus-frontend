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
  const [data, setData] = useState<any[]>([]);
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

      await AsyncStorage.setItem("selectedBus", JSON.stringify(response.data.result[0]));
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
                  startName={route.busSubPaths[0].startName}
                  endName={route.busSubPaths[0].endName}
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
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 24,
    color: Colors.text,
    textAlign: "center",
  },

  busOptionButton: {
    backgroundColor: Colors.background,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: "100%",
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  busText: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: "600",
  },

  cancelButton: {
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#F1F3F5",
    width: "100%",
    alignItems: "center",
  },

  cancelText: {
    color: Colors.textSub,
    fontSize: 16,
    fontWeight: "600",
  },
});
