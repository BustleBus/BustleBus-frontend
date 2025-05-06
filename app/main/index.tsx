import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import FavoriteRoute from "@/components/main/FavoriteRoute";
import FavoriteBus from "@/components/main/FavoriteBus";
import { useRouter } from "expo-router";
import { sharedStyles } from "@/styles/shared";

export default function Index() {
  const routes = [
    { start: "연암공과대학교", end: "경상국립대학교" },
    { start: "출발지", end: "도착지" },
    { start: "A", end: "B" },
    { start: "C", end: "D" },
    { start: "E", end: "F" },
    { start: "G", end: "H" },
  ];
  const router = useRouter();
  return (
    <ScrollView>
      <View style={styles.body}>
        <View style={{ flexDirection: "column" }}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.navigate("/searchRoute")}
          >
            <Text>경로검색</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.navigate("/searchBus")}
          >
            <Text>버스번호 검색</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>경로 즐겨 찾기</Text>
          <Divider style={styles.divider} />
          <View style={sharedStyles.column}>
            {Array.from({ length: Math.ceil(routes.length / 2) }).map(
              (_, rowIdx) => {
                const pair = routes.slice(rowIdx * 2, rowIdx * 2 + 2);
                return (
                  <View key={rowIdx} style={sharedStyles.row}>
                    {pair.map((route, i) => (
                      <View
                        key={i}
                        style={[sharedStyles.flexOne, styles.padding]}
                      >
                        <FavoriteRoute
                          key={i}
                          start={route.start}
                          end={route.end}
                        />
                      </View>
                    ))}
                  </View>
                );
              },
            )}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>버스번호 즐겨찾기</Text>
          <Divider style={styles.divider} />
          <View style={sharedStyles.row}>
            <View style={[sharedStyles.flexOne, styles.padding]}>
              <FavoriteBus>130번</FavoriteBus>
            </View>
            <View style={[sharedStyles.flexOne, styles.padding]}>
              <FavoriteBus>160번</FavoriteBus>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#000",
  },
  body: {
    padding: 10,
  },
  padding: {
    padding: 4,
  },
  menuButton: {
    backgroundColor: "#e8def8",
    marginHorizontal: 5,
    marginVertical: 10,
    padding: 20,
    alignItems: "center",
    borderRadius: 7,
    borderColor: "#79747e",
    borderWidth: 0.1,
  },
  section: {
    marginTop: 25,
  },
  divider: {
    marginTop: 5,
    marginBottom: 10,
    height: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
