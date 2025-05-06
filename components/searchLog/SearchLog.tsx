import { Card, IconButton } from "react-native-paper";
import { StyleSheet, Text, View } from "react-native";

export default function SearchLog({ text }: { text: string }) {
  return (
    <View style={styles.logView}>
      <Card style={styles.logCard}>
        <View style={styles.logContent}>
          <Text style={styles.logText}>{text}</Text>
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
