import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ListItemBox from "@/components/common/ListItemBox";
import { Colors } from "@/styles/shared";

interface SearchResultListItemsProps {
  time: string;
  firstBus: string;
  secondBus: string;
  crowdLevel: string;
  onPress: (firstBus: string, secondBus: string) => void;
}

export default function SearchResultListItems({
  time,
  firstBus,
  secondBus,
  crowdLevel,
  onPress,
}: SearchResultListItemsProps) {
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity activeOpacity={0.8}>
        <View style={styles.container}>
          <ListItemBox showClose={false} onPress={() => onPress(firstBus, secondBus)}>
            <View style={styles.card}>
              <View style={styles.leftSection}>
                <Text style={styles.optimalText}>최적</Text>
                <Ionicons name="bus-outline" size={20} color="blue" style={{ marginTop: 2 }} />
                <Text style={styles.timeText}>{time}</Text>
              </View>
              <View>
                <View style={styles.routeMultiView}>
                  <Text>{firstBus}</Text>
                  <Text>{secondBus}</Text>
                </View>
              </View>
              <View style={styles.rightSection}>
                <Text style={styles.crowdText}>{crowdLevel}</Text>
              </View>
            </View>
          </ListItemBox>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#F0F4F8",
    padding: 8,
    borderRadius: 12,
    minWidth: 60,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  optimalText: {
    color: Colors.primary,
    marginBottom: 4,
    fontSize: 12,
    fontWeight: "700",
  },
  timeText: {
    color: Colors.text,
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
  },
  routeText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  routeMultiView: {
    flexDirection: "column",
    gap: 2,
  },
  crowdText: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  modalButton: {
    backgroundColor: Colors.secsub,
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
});
