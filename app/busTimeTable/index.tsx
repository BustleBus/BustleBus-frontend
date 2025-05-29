import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";

export default function BusTimeTable() {
  const [timeTable, setTimeTable] = useState();

  useEffect(() => {
    const fetchTimeTable = async () => {
      const selectedBusString = await AsyncStorage.getItem("selectedBus");
      if (selectedBusString) {
        const selectedBus = JSON.parse(selectedBusString);

        console.log("🕒 시간표:", selectedBus.timetable);
        setTimeTable(selectedBus.timetable);
      }
    };
    fetchTimeTable();
  }, []);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>기점발</Text>
        <Text style={styles.headerText}>종점발</Text>
      </View>
      {timeTable &&
        timeTable.map((start, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.time}>{start}</Text>
            <Text style={styles.time}>{start}</Text>
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 50,
    flex: 1,
    backgroundColor: "#f9f0f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  headerText: {
    marginHorizontal: 30,
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  row: {
    marginHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  time: {
    fontSize: 16,
    color: "#555",
  },
});
