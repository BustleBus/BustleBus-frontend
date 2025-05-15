import { router, Stack } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity
            onPressIn={() => {
              router.push("/onboarding");
            }}
          >
            <Text>지역 선택</Text>
          </TouchableOpacity>
        ),
        headerTitle: "버슬버스",
        headerTitleAlign: "center",
      }}
    />
  );
}
