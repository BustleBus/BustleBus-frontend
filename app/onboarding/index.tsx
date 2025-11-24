import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { loadingAtom } from "@/atoms/loadingState";
import { Colors, sharedStyles } from "@/styles/shared";

// 🔄 타입 정의
type CityCode = {
  OdsayCityCode: string;
  cityName: string;
  TagoCityCode: number;
  cityRegion: string;
};

const CITY_STORAGE_KEY = "cityCodes";
const SELECTED_CITY_KEY = "selectedCity";
const REGION_PRIORITY = [
  "서울",
  "경기도",
  "강원도",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "광주",
  "경상북도",
  "경상남도",
];

export default function Setup() {
  const [cityCodes, setCityCodes] = useState<CityCode[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const router = useRouter();
  const [, setLoading] = useAtom(loadingAtom);

  // 🔄 데이터 로드
  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoading(true);
        const storedData = await AsyncStorage.getItem(CITY_STORAGE_KEY);
        if (storedData) {
          const parsedData = JSON.parse(storedData) as CityCode[];
          setCityCodes(parsedData);
        } else {
          const response = await axios.get<{ result: CityCode[] }>(
            `${process.env.EXPO_PUBLIC_API_URL}/api/v1/searchCity`
          );
          const data = response.data.result;
          setCityCodes(data);
          await AsyncStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(data));
        }
      } catch (error) {
        console.error("도시 데이터 로드 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, []);

  const handleCitySelect = async (city: CityCode) => {
    try {
      await AsyncStorage.setItem(SELECTED_CITY_KEY, JSON.stringify(city));
      await AsyncStorage.setItem("hasCompletedSetup", "true");
      router.replace("/main");
    } catch (error) {
      console.error("도시 저장 오류:", error);
    }
  };

  const renderRegionItem = ({ item }: { item: string }) => (
    <TouchableOpacity key={item} onPress={() => setSelectedRegion(item)} style={styles.gridBox}>
      <Text style={styles.boxText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderCityItem = ({ item }: { item: CityCode }) => (
    <TouchableOpacity
      key={item.cityName}
      onPress={() => handleCitySelect(item)}
      style={styles.gridBox}
    >
      <Text style={styles.boxText}>{item.cityName}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: string | CityCode }) => {
    if (selectedRegion) {
      return renderCityItem({ item: item as CityCode });
    }
    return renderRegionItem({ item: item as string });
  };

  const keyExtractor = (item: string | CityCode, index: number) => {
    return selectedRegion ? (item as CityCode).cityName : (item as string);
  };
  // 🔄 지역별 도시 묶기
  const groupedCities = cityCodes.reduce((acc, city) => {
    const match =
      city.cityName.includes(searchText) ||
      city.cityRegion.includes(searchText) ||
      searchText.trim() === "";

    if (!match) return acc;

    if (!acc[city.cityRegion]) acc[city.cityRegion] = [];
    acc[city.cityRegion].push(city);
    return acc;
  }, {} as Record<string, CityCode[]>);

  // ✅ 먼저 groupedCities 만든 후 정렬
  const regionKeysSorted = Object.keys(groupedCities).sort((a, b) => {
    const aIndex = REGION_PRIORITY.indexOf(a);
    const bIndex = REGION_PRIORITY.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  // ✅ 최종 데이터 정의
  const listData = selectedRegion ? groupedCities[selectedRegion] || [] : regionKeysSorted;

  return (
    <View style={sharedStyles.body}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {selectedRegion ? "도시를 선택해 주세요" : "지역을 선택해 주세요"}
        </Text>
        <TextInput
          style={styles.searchInput}
          placeholder="도시를 검색해주세요"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", padding: 20, color: "gray" }}>
            검색 결과가 없습니다.
          </Text>
        }
      />

      {selectedRegion ? (
        <TouchableOpacity
          onPress={() => {
            setSearchText("");
            setSelectedRegion(null);
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← 지역 선택으로 돌아가기</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            router.replace("/main");
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← 기존 선택 유지</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: Colors.text,
    textAlign: "center",
  },
  searchInput: {
    padding: 12,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    fontSize: 16,
    color: Colors.text,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  gridContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  gridBox: {
    flex: 1,
    minHeight: 100,
    margin: 8,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  boxText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },

  backButton: {
    marginHorizontal: 24,
    marginVertical: 20,
    paddingVertical: 14,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.surface,
    fontWeight: "700",
    fontFamily: "System",
  },
});
