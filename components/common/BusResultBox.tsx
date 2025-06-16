import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ListItemBox from "@/components/common/ListItemBox";
import { Colors } from "@/styles/shared";
import cleanText from "@/util/cleanText";

export default function BusResultBox({
  onPress,
  onDelete,
  busNo,
  start,
  end,
  routePath,
}: {
  onPress: () => void;
  onDelete?: () => void;
  busNo: string;
  start?: string;
  end?: string;
  routePath?: string;
}) {
  return (
    <ListItemBox onPress={onPress} onRemove={onDelete} showClose={!!onDelete}>
      <View style={styles.container}>
        <View style={styles.busNumberBox}>
          <Text style={styles.busNumberText}>{busNo}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.busLabel}>{busNo}번 버스</Text>
          {start && end && (
            <Text style={styles.routeLabel}>
              {cleanText(start)} ↔ {cleanText(end)}
            </Text>
          )}
          {routePath && <Text style={styles.routeLabel}>{cleanText(routePath)}</Text>}
        </View>
      </View>
    </ListItemBox>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  busNumberBox: {
    backgroundColor: Colors.primary, // 파란 배경
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  busNumberText: {
    color: "white",
    fontWeight: "bold",
  },
  infoContainer: {
    flexDirection: "column",
  },
  busLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  routeLabel: {
    fontSize: 13,
    color: "#555",
  },
});
