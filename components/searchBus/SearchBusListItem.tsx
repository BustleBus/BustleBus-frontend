import ListItemBox from "@/components/common/ListItemBox";
import { StyleSheet, Text, View } from "react-native";
import { sharedStyles } from "@/styles/shared";

export default function SearchBusListItem({
  bus,
  busRoute,
}: {
  bus: string;
  busRoute: string;
}) {
  return (
    <View style={styles.card}>
      <ListItemBox showClose={true}>
        <View style={sharedStyles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.routeText}>{bus}</Text>
            <Text style={styles.routeDetailText}>{busRoute}</Text>
          </View>
        </View>
      </ListItemBox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    backgroundColor: "#f7f3f9",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  textContainer: {
    flexDirection: "column",
  },
  routeText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  routeDetailText: {
    fontSize: 14,
    color: "#555",
  },
  closeButton: {
    padding: 4,
  },
});
