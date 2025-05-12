import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // or any icon set you prefer

export default function MainLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerTitle: () => <Text style={{ fontSize: 16 }}>160번 버스</Text>,
        headerTitleAlign: "left",

        headerLeft: () => (
          <TouchableOpacity
            onPressIn={() => router.back()}
            style={{ paddingHorizontal: 12 }}
          >
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
        ),

        headerRight: () => (
          <TouchableOpacity
            onPressIn={() => {
              router.replace("/main");
            }}
            style={{ paddingHorizontal: 12 }}
          >
            <Ionicons name="home" size={24} />
          </TouchableOpacity>
        ),
      }}
    />
  );
}
