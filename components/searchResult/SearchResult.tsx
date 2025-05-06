import { StyleSheet, Text, View } from "react-native";
import ListItemBox from "@/components/common/ListItemBox";

export default function SearchResult({
  place,
  placeDetail,
}: {
  place: string;
  placeDetail: string;
}) {
  return (
    <View style={styles.box}>
      <ListItemBox showClose={false}>
        <View style={{ flexDirection: "column", flexShrink: 1 }}>
          <Text style={{ fontWeight: "bold" }}>{place}</Text>
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
