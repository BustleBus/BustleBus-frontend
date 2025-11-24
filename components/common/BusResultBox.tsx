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
    backgroundColor: Colors.primary, // 파란 배경 -> 이제 Coral
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  busNumberText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: "column",
  },
  busLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 2,
  },
  routeLabel: {
    fontSize: 14,
    color: Colors.textSub,
    fontWeight: "500",
  },
});
