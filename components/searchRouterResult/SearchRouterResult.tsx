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
          <Text style={{ fontWeight: "bold" }}>{place}</Text>
          <Text style={{ color: "gray", fontSize: 10 }}>{categoryName}</Text>
          <Text>{placeDetail}</Text>
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
