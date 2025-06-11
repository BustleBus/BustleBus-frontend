// app/main/_layout.tsx
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/styles/shared";
import { Stack } from "expo-router";
import { useGoBack, useGoToMainAndReset } from "@/hooks/useGoToMainAndReset";
export default function MainLayout() {
  const goHome = useGoToMainAndReset();
  const goBack = useGoBack();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        contentStyle: {
          backgroundColor: Colors.background,
        },
        headerTitle: () => (
          <Text style={{ fontSize: 16, color: Colors.surface }}>버스 번호 검색</Text>
        ),
        headerTitleAlign: "left",

        headerLeft: () => (
          <TouchableOpacity onPressIn={goBack} style={{ paddingRight: 12 }}>
            <Ionicons name="arrow-back" size={24} style={{ marginTop: 2, color: Colors.surface }} />
          </TouchableOpacity>
        ),

        headerRight: () => (
          <TouchableOpacity onPressIn={goHome} style={{ paddingHorizontal: 12 }}>
            <Ionicons name="home" size={24} style={{ color: Colors.surface }} />
          </TouchableOpacity>
        ),
      }}
    />
  );
}
