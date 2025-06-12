import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import BusResultBox from "../common/BusResultBox";

export default function SearchBusResult({
  bus,
  routePath,
  onPress,
}: {
  bus: string;
  routePath: string;
  onPress?: () => void;
}) {
  const router = useRouter();
  return (
    <View style={styles.box}>
      <BusResultBox
        busNo={bus}
        routePath={routePath}
        onPress={() => {
          onPress?.();
          router.navigate("/busDetailPage");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginVertical: 5,
  },
});
