import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔄 타입 정의
type CityCode = {
  OdsayCityCode: string;
  cityName: string;
  TagoCityCode: number;
  cityRegion: string;
};

const CITY_STORAGE_KEY = "cityCodes";
const SELECTED_CITY_KEY = "selectedCity";

export default function Setup() {
  const [cityCodes, setCityCodes] = useState<CityCode[]>([]);
  const [filteredCities, setFilteredCities] = useState<CityCode[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter();

  // 🔄 데이터 로드
  useEffect(() => {
    const loadCities = async () => {
      try {
        // 📦 로컬 저장된 데이터 불러오기
        const storedData = await AsyncStorage.getItem(CITY_STORAGE_KEY);
        if (storedData) {
          const parsedData = JSON.parse(storedData) as CityCode[];
          setCityCodes(parsedData);
          setFilteredCities(parsedData);
          console.log("로컬 데이터 사용");
        } else {
          // 🌐 서버에서 데이터 가져오기
          const response = await axios.get<{ result: CityCode[] }>(
            "https://bustlebus.duckdns.org/api/v1/searchCity"
          );
          const data = response.data.result;
          setCityCodes(data);
          setFilteredCities(data);
          // 📦 로컬에 저장
          await AsyncStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(data));
          console.log("서버 데이터 저장 완료");
        }
      } catch (error) {
        console.error("데이터 로드 에러:", error);
      }
    };

    loadCities();
  }, []);

  // 🔍 검색 필터
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredCities(cityCodes); // 기본일 때 전체 표시
    } else {
      const filtered = cityCodes.filter(city => city.cityName.includes(searchText));
      setFilteredCities(filtered);
    }
  }, [searchText, cityCodes]);

  // 🔄 도시 선택 처리
  const handleCitySelect = async (city: CityCode) => {
    try {
      // 📦 선택된 도시 저장
      await AsyncStorage.setItem(SELECTED_CITY_KEY, JSON.stringify(city));
      console.log("선택된 도시 저장:", city);
      // 🗺️ 메인 페이지로 이동
      router.replace("/main");
    } catch (error) {
      console.error("도시 저장 오류:", error);
    }
  };

  // 2열로 버튼 배열 만들기
  const rows: CityCode[][] = [];
  for (let i = 0; i < filteredCities.length; i += 2) {
    rows.push(filteredCities.slice(i, i + 2));
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text>지역을 선택해 주세요</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="도시 검색"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.buttonContainer}>
            {/* 왼쪽 버튼 */}
            <TouchableOpacity
              style={[styles.button, { marginRight: 10 }]}
              onPress={() => handleCitySelect(row[0])}
            >
              <Text style={styles.buttonText}>{row[0].cityName}</Text>
            </TouchableOpacity>

            {/* 오른쪽 버튼이 있으면 보여주고, 없으면 빈 View로 공간 확보 */}
            {row[1] ? (
              <TouchableOpacity style={styles.button} onPress={() => handleCitySelect(row[1])}>
                <Text style={styles.buttonText}>{row[1].cityName}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.buttonPlaceholder} />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginLeft: 20,
    marginTop: 20,
  },
  searchInput: {
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10,
    borderColor: "#cac4d0",
    borderWidth: 0.5,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  container: {
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "transparent",
    height: 80,
    borderColor: "#cac4d0",
    borderWidth: 0.3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonPlaceholder: {
    flex: 1,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
});
