import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: "버슬버스",
        headerTitleAlign: "center",
      }}
    />
  );
}
