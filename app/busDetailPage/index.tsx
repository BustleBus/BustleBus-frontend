import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function BusDetailPage() {
  const [value, setValue] = useState("기점 방향");

  const stops = [
    { name: "정류장1", status: "원활", color: "#0000FF" },
    { name: "정류장2", status: "", color: "#000" },
    { name: "정류장3", status: "", color: "#000" },
    { name: "정류장4", status: "", color: "#000" },
    { name: "정류장5", status: "혼잡", color: "#FF0000" },
    { name: "정류장6", status: "", color: "#000" },
    { name: "정류장6", status: "원활", color: "#0000FF" },
    { name: "정류장5", status: "", color: "#000" },
    { name: "정류장4", status: "", color: "#000" },
    { name: "정류장3", status: "", color: "#000" },
    { name: "정류장2", status: "복잡", color: "#FFA500" },

    { name: "정류장1", status: "", color: "#000" },
    { name: "정류장1", status: "", color: "#000" },
    { name: "정류장1", status: "", color: "#000" },
    { name: "정류장1", status: "", color: "#000" },
    { name: "정류장1", status: "", color: "#000" },
    { name: "정류장1", status: "", color: "#000" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.toggleGroup}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            value === "기점 방향" && styles.activeButton,
          ]}
          onPress={() => setValue("기점 방향")}
        >
          <Text style={styles.buttonText}>기점 방향</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            value === "종점 방향" && styles.activeButton,
          ]}
          onPress={() => setValue("종점 방향")}
        >
          <Text style={styles.buttonText}>종점 방향</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.realTimeBusCount}>현재 3대 운행중</Text>
      </View>
      <FlatList
        data={stops}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.stopContainer}>
            <Text style={styles.stopName}>{item.name}</Text>
            {item.status !== "" && (
              <MaterialCommunityIcons
                name="bus"
                size={24}
                color="#333"
                style={styles.busIcon}
              />
            )}

            {item.status !== "" && (
              <Text style={[styles.statusText, { color: item.color }]}>
                {item.status}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F8EFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
    marginVertical: -15,
  },
  realTimeBusCount: {
    marginLeft: "auto",
    fontSize: 14,
    color: "#333",
  },
  toggleGroup: {
    flexDirection: "row",
    backgroundColor: "#EDE7F6",
    borderRadius: 50,
    padding: 5,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    borderRadius: 50,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#EDE7F6",
  },
  activeButton: {
    backgroundColor: "#D1C4E9",
  },
  buttonText: {
    color: "#333",
    fontWeight: "bold",
  },

  stopContainer: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#D3C4E9",
  },
  stopName: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  busIcon: {
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
