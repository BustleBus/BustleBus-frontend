import { StyleSheet, Text, View } from "react-native";
import ListItemBox from "@/components/common/ListItemBox";

export default function SearchRouterResult({
  place,
  placeDetail,
  categoryName,
  onPress,
}: {
  place: string;
  placeDetail: string;
  categoryName: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.box}>
      <ListItemBox showClose={false} onPress={onPress}>
        <View style={{ flexDirection: "column", flexShrink: 1 }}>
          <Text style={{ fontWeight: "700", fontSize: 16, color: "#2F3542", marginBottom: 2 }}>
            {place}
          </Text>
          <Text style={{ color: "#747D8C", fontSize: 12, marginBottom: 2 }}>{categoryName}</Text>
          <Text style={{ color: "#57606f", fontSize: 14 }}>{placeDetail}</Text>
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
