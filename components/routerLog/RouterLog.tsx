import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SearchLog from "@/components/common/SearchLog";
import { useRouter } from "expo-router";

export default function RouterLog({ text }: { text: string }) {
  const router = useRouter();
  return (
    <View>
      <SearchLog onPress={() => router.navigate("/searchResultRoute")}>
        <Text style={styles.logText}>{text}</Text>
      </SearchLog>
    </View>
  );
}
const styles = StyleSheet.create({
  logText: {
    flex: 1,
    fontSize: 14,
  },
});
