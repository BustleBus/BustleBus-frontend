// app/main/_layout.tsx 또는 MainLayout.tsx
import { Stack } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // or any icon set you prefer
import { Colors } from "@/styles/shared";
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
          <Text style={{ fontSize: 16, color: Colors.surface }}>버스 경로 찾기</Text>
        ),
        headerTitleAlign: "left",

        headerLeft: () => (
          <TouchableOpacity onPressIn={goBack} style={{ paddingRight: 12 }}>
            <Ionicons name="arrow-back" size={24} style={{ marginTop: 2, color: Colors.surface }} />
          </TouchableOpacity>
        ),

        headerRight: () => (
          <TouchableOpacity onPressIn={goHome} style={{ paddingHorizontal: 12, marginTop: 2 }}>
            <Ionicons name="home" size={24} style={{ color: Colors.surface }} />
          </TouchableOpacity>
        ),
      }}
    />
  );
}
