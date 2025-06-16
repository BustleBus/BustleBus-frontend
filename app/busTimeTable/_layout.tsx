import { Stack } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // or any icon set you prefer
import { useGoToMainAndReset, useGoBack } from "@/hooks/useGoToMainAndReset";
import { Colors } from "@/styles/shared";

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
        headerTitle: () => <Text style={{ fontSize: 16, color: Colors.surface }}>160번 버스</Text>,
        headerTitleAlign: "left",

        headerLeft: () => (
          <TouchableOpacity onPressIn={goBack} style={{ paddingHorizontal: 12 }}>
            <Ionicons name="arrow-back" size={24} style={{ color: Colors.surface, marginTop: 2 }} />
          </TouchableOpacity>
        ),

        headerRight: () => (
          <TouchableOpacity onPressIn={goHome} style={{ paddingHorizontal: 12 }}>
            <Ionicons name="home" size={24} style={{ marginTop: 2, color: Colors.surface }} />
          </TouchableOpacity>
        ),
      }}
    />
  );
}
