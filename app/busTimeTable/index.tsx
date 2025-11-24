import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";

import { Colors } from "@/styles/shared";

export default function BusTimeTable() {
  const [timeTable, setTimeTable] = useState<string[][]>([]);

  useEffect(() => {
    const fetchTimeTable = async () => {
      const selectedBusString = await AsyncStorage.getItem("selectedBus");
      if (selectedBusString) {
        const selectedBus = JSON.parse(selectedBusString);

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
        timeTable.map(([start, end], index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.time}>{start}</Text>
            <Text style={styles.time}>{end}</Text>
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
    color: Colors.text,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    flex: 1,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  time: {
    fontSize: 16,
    color: Colors.textSub,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    fontFamily: "System",
  },
});
