import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ListItemBox from "@/components/common/ListItemBox";

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
                <MaterialCommunityIcons name="bus" size={20} color="black" />
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
    marginVertical: 5,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 16,
    borderColor: "black",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
  },
  leftSection: {
    alignItems: "center",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  optimalText: {
    color: "#555",
    marginBottom: 4,
    fontSize: 14,
  },
  timeText: {
    color: "#555",
    marginTop: 4,
    fontSize: 14,
  },
  routeText: {
    color: "#000",
    fontSize: 16,
  },

  routeMultiView: {
    color: "#000",
    flexDirection: "column",
  },
  crowdText: {
    color: "#d32f2f",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
});
