import { Colors, sharedStyles } from "@/styles/shared";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
export default function MainLayout() {
  const [regionLabel, setRegionLabel] = useState("지역 선택");

  const transRegion = {
    서울: "",
    경기도: "경기",
    강원도: "강원",
    충청북도: "충북",
    충청남도: "충남",
    전라북도: "전북",
    전라남도: "전남",
    광주: "광주",
    경상북도: "경북",
    경상남도: "경남",
  };
  useEffect(() => {
    const loadRegion = async () => {
      try {
        const value = await AsyncStorage.getItem("selectedCity");

        console.log(value);
        if (value) {
          const parsed = JSON.parse(value);
          const label = `${transRegion[parsed.cityRegion]} ${parsed.cityName}`;
          setRegionLabel(label);
        }
      } catch (e) {
        console.warn("지역 불러오기 실패", e);
      }
    };

    loadRegion();
  }, []);
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        contentStyle: {
          backgroundColor: Colors.background,
        },
        headerTitle: "버슬버스",
        headerTitleAlign: "left",
        headerTitleStyle: {
          fontWeight: "bold",
          color: Colors.surface,
          fontSize: 18,
        },
        headerRight: () => (
          <TouchableOpacity
            onPressIn={() => router.replace("/onboarding")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            {/* Ionicons 위치 아이콘 */}
            <Ionicons
              name="location-outline"
              size={14}
              color="white"
              style={{ marginRight: 4, marginTop: 4, fontWeight: "bold" }}
            />

            {/* 지역 라벨 */}
            <Text style={{ color: "#fff", marginLeft: 6, fontSize: 13 }}>{regionLabel}</Text>
            {/* 오른쪽 꺾쇠 아이콘 */}
            <Ionicons
              name="chevron-forward"
              size={14}
              color="#fff"
              style={{ marginLeft: 2, marginTop: 4 }}
            />
          </TouchableOpacity>
        ),
      }}
    />
  );
}
