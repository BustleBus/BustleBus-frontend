import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import GlobalLoading from "@/components/GlobalLoading";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme, StyleSheet } from "react-native";

export default function Layout() {
  const scheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <StatusBar style="auto" backgroundColor={scheme === "dark" ? "#121212" : "#FFFCF3"} />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        <GlobalLoading />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCF3", // 전체 배경색 지정 (status bar 배경 포함)
  },
});
