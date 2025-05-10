import { StyleSheet, Text, View } from "react-native";
import ListItemBox from "@/components/common/ListItemBox";
import { useRouter } from "expo-router";

export default function SearchBusResult({
  bus,
  routePath,
}: {
  bus: string;
  routePath: string;
}) {
  const router = useRouter();
  return (
    <View style={styles.box}>
      <ListItemBox showClose={false} onPress={() => {}}>
        <View style={{ flexDirection: "column", flexShrink: 1 }}>
          <Text style={{ fontWeight: "bold" }}>{bus}</Text>
          <Text>{routePath}</Text>
        </View>
      </ListItemBox>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginBottom: 10,
  },
});
