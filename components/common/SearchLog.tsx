import { Card, IconButton } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import React from "react";

export default function SearchLog({
  onPress,
  children,
  onClose,
}: {
  onPress: () => void;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <View style={styles.logView}>
      <Card style={styles.logCard} onPress={onPress}>
        <View style={styles.logContent}>
          {children}

          <IconButton icon="close" size={16} onPress={onClose} />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  logView: {
    flexDirection: "column",
    marginVertical: 3,
  },
  logCard: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 8,
  },
  logContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logText: {
    flex: 1,
    fontSize: 14,
  },
});
