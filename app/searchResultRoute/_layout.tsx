// app/main/_layout.tsx or MainLayout.tsx
import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // or any icon set you prefer

export default function MainLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerTitle: () => <Text style={{ fontSize: 16 }}>연암공과대학교 -> 경상국립대</Text>,
        headerTitleAlign: "left",

        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ paddingHorizontal: 12 }}
          >
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
        ),

        headerRight: () => (
          <TouchableOpacity
            onPress={() => {

              router.dismissAll();
            }}
            style={{ paddingHorizontal: 12 }}
          >
            <Ionicons name="home" size={24} />
          </TouchableOpacity>
        )
      }}
    />
  );
}
