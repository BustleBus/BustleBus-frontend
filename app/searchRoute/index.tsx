import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import SearchTextInput from "@/components/common/SearchTextInput";
import { Card, Divider } from "react-native-paper";
import SearchRouterResult from "@/components/searchRouterResult/SearchRouterResult";
import RouterLog from "@/components/routerLog/RouterLog";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { loadingAtom } from "@/atoms/loadingState";

type SearchResultItem = {
  road_address_name: string;
  place_name: string;
  category_name: string;
  x: string;
  y: string;
};

type SearchHistoryItem = {
  startPlaceName: string;
  startAddress: string;
  startX: string;
  startY: string;
  endPlaceName: string;
  endAddress: string;
  endX: string;
  endY: string;
};

export default function SearchRoute() {
  const router = useRouter();
  const [, setLoading] = useAtom(loadingAtom);
  // 출발지 상태
  const [startRoadAddress, setStartRoadAddress] = useState("");
  const [startPlaceName, setStartPlaceName] = useState("");
  const [startX, setStartX] = useState("");
  const [startY, setStartY] = useState("");

  // 도착지 상태
  const [, setEndRoadAddress] = useState("");
  const [endPlaceName, setEndPlaceName] = useState("");
  const [, setEndX] = useState("");
  const [, setEndY] = useState("");

  // 포커스 및 검색 상태
  const [focusTarget, setFocusTarget] = useState<"start" | "end" | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResultItem[]>([]);

  // 🔄 포커스 유지 상태 (버그 방지)
  const isSelectingRef = useRef(false);

  // 검색 히스토리
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  // Async 스토리지에서 검색 히스토리 불러오기
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const storedValue = await AsyncStorage.getItem("search_history");
        console.log("storedValue", storedValue);
        if (storedValue !== null) {
          const history = JSON.parse(storedValue) as SearchHistoryItem[];
          setSearchHistory(history);
          console.log("🔄 검색 히스토리 로드:", history);
        }
      } catch (e) {
        console.error("Error loading search history:", e);
      }
    };

    loadSearchHistory();
  }, []);

  // 🔄 검색 요청 관리
  useEffect(() => {
    if (!focusTarget || isSelectingRef.current) return;

    const inputText = focusTarget === "start" ? startPlaceName : endPlaceName;
    if (inputText.trim() === "") {
      setSearchResult([]);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://bustlebus.duckdns.org/api/v1/searchPlace?query=${inputText}`
        );
        setSearchResult(response.data.results || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    // 🔄 300ms debounce
    const timeoutId = setTimeout(fetchResults, 300);

    return () => clearTimeout(timeoutId);
  }, [startPlaceName, endPlaceName, focusTarget]);

  // 🔄 장소 선택 처리
  const handlePlaceSelect = async (item: SearchResultItem) => {
    isSelectingRef.current = true;
    console.log("장소 선택 처리");
    // 출발지 선택시
    if (focusTarget === "start") {
      console.log(item.place_name);
      setStartX(item.x);
      setStartY(item.y);
      setStartPlaceName(item.place_name);
      setStartRoadAddress(item.road_address_name);
      console.log("start");
    } else if (focusTarget === "end") {
      // 목적지 선택시
      setEndX(item.x);
      setEndY(item.y);
      setEndPlaceName(item.place_name);
      setEndRoadAddress(item.road_address_name);
      console.log("end");
      if (startX !== "" && startY !== "" && item.x !== "" && item.y !== "") {
        try {
          const newHistoryItem: SearchHistoryItem = {
            startPlaceName: startPlaceName,
            startAddress: startRoadAddress,
            startX: Number(startX).toFixed(5),
            startY: Number(startY).toFixed(5),
            endPlaceName: item.place_name,
            endAddress: item.road_address_name,
            endX: Number(item.x).toFixed(5),
            endY: Number(item.y).toFixed(5),
          };

          // 🔄 기존 히스토리에서 중복 제거
          const updatedHistory = [
            newHistoryItem,
            ...searchHistory.filter(
              history =>
                history.startPlaceName !== newHistoryItem.startPlaceName ||
                history.endPlaceName !== newHistoryItem.endPlaceName
            ),
          ].slice(0, 10); // 최대 10개 유지

          // 🔄 상태 업데이트
          setSearchHistory(updatedHistory);

          // 📦 AsyncStorage에 저장
          await AsyncStorage.setItem("search_history", JSON.stringify(updatedHistory));
          console.log("🔄 검색 히스토리 저장:", newHistoryItem);
          await AsyncStorage.setItem(
            "selectedBus",
            JSON.stringify({
              startAddress: startRoadAddress,
              startPlaceName: startPlaceName,
              startX: Number(startX).toFixed(5),
              startY: Number(startY).toFixed(5),
              endX: Number(item.x).toFixed(5),
              endY: Number(item.y).toFixed(5),
              endAddress: item.road_address_name,
              endPlaceName: item.place_name,
            })
          );
          router.navigate("/searchResultRoute");
        } catch (e) {
          console.error("Error saving search history:", e);
        }
      }
    }
    // 🔄 포커스 초기화
    setFocusTarget(null);
    setSearchResult([]);

    // 🔄 포커스 초기화 후 플래그 리셋
    setTimeout(() => {
      isSelectingRef.current = false;
    }, 100);
  };

  // 🔄 검색 로그 삭제 처리
  const handleLogDelete = (index: number) => {
    const updatedHistory = searchHistory.filter((_, i) => i !== index);
    setSearchHistory(updatedHistory);
  };

  return (
    <View style={styles.body}>
      <View style={styles.search}>
        <SearchTextInput
          text={startPlaceName}
          setText={text => {
            setStartPlaceName(text);
            if (!isSelectingRef.current) setFocusTarget("start");
          }}
          placeholder="출발지"
          style={focusTarget === "end" ? styles.hidden : undefined}
        />
        <SearchTextInput
          text={endPlaceName}
          setText={text => {
            setEndPlaceName(text);
            if (!isSelectingRef.current) setFocusTarget("end");
          }}
          placeholder="목적지"
          style={focusTarget === "start" ? styles.hidden : undefined}
        />
      </View>
      <Divider />
      <View style={styles.result}>
        {focusTarget && searchResult.length > 0 ? (
          <Card style={styles.card}>
            <ScrollView>
              {searchResult.map((item, index) => (
                <SearchRouterResult
                  key={index}
                  place={item.place_name}
                  placeDetail={item.road_address_name}
                  categoryName={item.category_name}
                  onPress={() => handlePlaceSelect(item)}
                />
              ))}
            </ScrollView>
          </Card>
        ) : (
          searchHistory.length > 0 &&
          searchHistory.map((history, index) => (
            <RouterLog
              onDelete={handleLogDelete}
              key={index}
              index={index}
              history={history}
              text={`${history.startPlaceName} -> ${history.endPlaceName}`}
            />
          ))
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
  },
  hidden: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
    pointerEvents: "none",
  },
  result: {
    paddingTop: 20,
    flex: 1,
  },
  card: {
    padding: 16,
    backgroundColor: "white",
  },
});
