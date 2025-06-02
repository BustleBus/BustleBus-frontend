import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchTextInput from "@/components/common/SearchTextInput";
import { Card, Divider } from "react-native-paper";
import BusLog from "@/components/searchBus/BusLog";
import SearchBusResult from "@/components/searchBus/SearchBusResult";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";
import { useAtom } from "jotai";
import { loadingAtom } from "@/atoms/loadingState";

export default function SearchBus() {
  const [start, setStart] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [busLogs, setBusLogs] = useState<any[]>([]);
  const [busData, setBusData] = useState([]);
  const router = useRouter();
  const [, setLoading] = useAtom(loadingAtom);
  console.log(busData);
  const handleSearch = async (busNo: string) => {
    if (!busNo.trim()) {
      // 빈 검색어 처리
      return;
    }
    try {
      setLoading(true);
      const cityCode = await AsyncStorage.getItem("selectedCity");
      if (!cityCode) {
        console.error("도시 정보를 찾을 수 없습니다.");
        return;
      }
      console.log(cityCode);
      const odsayCityCode = JSON.parse(cityCode).OdsayCityCode;
      console.log("busNo", busNo, "odsayCityCode", odsayCityCode);
      const response = await axios.get(
        `https://bustlebus.duckdns.org/api/v1/busDetails?busNo=${busNo}&cityCode=${odsayCityCode}`
      );

      console.log("API 응답 데이터:", response.data);
      setBusData(response.data);

      setIsSearch(true);
    } catch (error) {
      console.error("버스 검색 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 BusLog 불러오기
  const loadBusLogs = async () => {
    try {
      const stored = await AsyncStorage.getItem("BusLog");
      if (stored) {
        setBusLogs(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading bus logs:", error);
    }
  };

  // 🔹 최초 1회, 그리고 검색 종료 시 로딩
  useEffect(() => {
    if (!isSearch) {
      loadBusLogs();
    }
  }, [isSearch]);

  // 🔹 선택 시 저장 및 페이지 이동
  const handleBusPress = async (item: any) => {
    try {
      await AsyncStorage.setItem("selectedBus", JSON.stringify(item));
      const existingLogs = await AsyncStorage.getItem("BusLog");
      const logs = existingLogs ? JSON.parse(existingLogs) : [];

      const updatedLogs = [item, ...logs.filter((log: any) => log.busNo !== item.busNo)].slice(
        0,
        10
      );

      await AsyncStorage.setItem("BusLog", JSON.stringify(updatedLogs));
      router.navigate("/busDetailPage");
    } catch (error) {
      console.error("Error saving bus log:", error);
      router.navigate("/busDetailPage");
    }
  };
  const handleRemoveLog = async (busIDToRemove: number) => {
    try {
      const existingLogs = await AsyncStorage.getItem("BusLog");
      const logs = existingLogs ? JSON.parse(existingLogs) : [];

      const filtered = logs.filter((log: any) => log.busID !== busIDToRemove);
      await AsyncStorage.setItem("BusLog", JSON.stringify(filtered));
      setBusLogs(filtered); // UI 업데이트
    } catch (error) {
      console.error("로그 삭제 실패:", error);
    }
  };
  const handlePressLog = async (item: any) => {
    try {
      await AsyncStorage.setItem("selectedBus", JSON.stringify(item));
    } catch (error) {
      console.error("Error saving bus log:", error);
    }
    router.navigate("/busDetailPage");
  };

  return (
    <View style={styles.body}>
      <View style={styles.search}>
        <View style={styles.inputContainer}>
          <SearchTextInput
            text={start}
            setText={text => setStart(text)}
            placeholder={"버스 번호"}
            keyboardType="number-pad"
            onSubmitEditing={() => handleSearch(start)} // 🔹 추가
            onBlur={() => {
              // 입력 내용이 없으면만 검색 종료
              if (!start.trim()) {
                setIsSearch(false);
              }
            }}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch(start)}>
          <Ionicons name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Divider />

      <View style={styles.result}>
        {isSearch ? (
          <Card style={styles.card}>
            {busData &&
              busData.result.length > 0 &&
              busData.result.map((item, index) => (
                <SearchBusResult
                  key={item.busID}
                  bus={item.busNo}
                  routePath={item.location}
                  onPress={() => handleBusPress(item)}
                />
              ))}
          </Card>
        ) : (
          <ScrollView style={styles.result}>
            {busLogs.length === 0 ? (
              <Text style={{ padding: 10 }}>최근 검색된 버스가 없습니다.</Text>
            ) : (
              busLogs.map((log, index) => (
                <BusLog
                  onPress={() => handlePressLog(log)}
                  key={index}
                  bus={log.busNo}
                  routePath={log.location}
                  onClose={() => handleRemoveLog(log.busID)}
                />
              ))
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 10,
  },
  search: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "",
    // flex:1,
  },

  inputContainer: {
    flex: 1,
  },
  searchButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  hidden: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
    pointerEvents: "none",
  },
  result: {
    flex: 1, // 카드나 로그가 차지할 공간
    paddingTop: 5,
  },
  card: {
    flexDirection: "row",
    flex: 1, // 카드 자체도 최대 확장
    padding: 16,
    backgroundColor: "white",
  },
});
