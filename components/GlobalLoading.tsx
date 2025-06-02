// components/GlobalLoading.tsx
"use client"; // React Native에서는 생략해도 됨

import { useAtom } from "jotai";
import { loadingAtom } from "@/atoms/loadingState";
import { ActivityIndicator, View, StyleSheet, Modal } from "react-native";

export default function GlobalLoading() {
  const [loading] = useAtom(loadingAtom);

  return (
    <Modal transparent animationType="fade" visible={loading} statusBarTranslucent>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});
