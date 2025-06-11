import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import GlobalLoading from "@/components/GlobalLoading";
import { useColorScheme } from "react-native";

export default function Layout() {
  const scheme = useColorScheme();

  return (
    <>
      <StatusBar style="auto" backgroundColor={scheme === "dark" ? "#121212" : "#FFFCF3"} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <GlobalLoading />
    </>
  );
}
