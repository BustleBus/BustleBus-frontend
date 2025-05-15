import { StyleSheet, View, Text, ScrollView } from "react-native";

export default function BusTimeTable() {
  const timetable = [
    ["06:00", "06:40"],
    ["06:30", "07:10"],
    ["07:00", "07:40"],
    ["07:30", "08:10"],
    ["08:00", "08:40"],
    ["08:30", "09:10"],
    ["09:00", "09:40"],
    ["10:00", "10:10"],
    ["10:30", "10:40"],
    ["11:00", "11:10"],
    ["11:30", "11:40"],
    ["12:00", "12:10"],
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>기점발</Text>
        <Text style={styles.headerText}>종점발</Text>
      </View>
      {timetable.map(([start, end], index) => (
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
