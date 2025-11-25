import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import GlobalLoading from "@/components/GlobalLoading";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme, StyleSheet } from "react-native";

export default function Layout() {
  const scheme = useColorScheme();

  return (
    <SafeAreaProvider>
        <StatusBar style="auto" backgroundColor={scheme === "dark" ? "#121212" : "#F7F9FC"} />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        <GlobalLoading />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC", // 전체 배경색 지정 (status bar 배경 포함)
  },
});
