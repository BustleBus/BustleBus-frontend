import { Card, IconButton } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import React from "react";

export default function SearchLog({
  onPress,
  children,
}: {
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.logView}>
      <Card style={styles.logCard} onPress={onPress}>
        <View style={styles.logContent}>
          {children}

          <IconButton icon="close" size={16} onPress={() => {}} />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  logView: {
    flexDirection: "column",
    marginVertical: 10,
  },
  logCard: {
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
