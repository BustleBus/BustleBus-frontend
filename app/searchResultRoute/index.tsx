import { ScrollView, StyleSheet, View } from "react-native";
import SearchResultListItem from "@/components/searchRouterResult/SearchResultListItem";
import SearchResultListItems from "@/components/searchRouterResult/SearchResultListItems";

export default function SearchResultRoute() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <SearchResultListItem
          time={"50분"}
          bus={"160번 (연암공과대학교 방면)"}
          crowdLevel={"혼잡"}
        />
        <SearchResultListItems
          time={"50분"}
          firstBus={"160번 (연암공과대학교 방면)"}
          secondBus={"161번 (연암공과대학교 방면)"}
          crowdLevel={"혼잡"}
        />
        <SearchResultListItems
          time={"50분"}
          firstBus={"160번 (연암공과대학교 방면)"}
          secondBus={"161번 (연암공과대학교 방면)"}
          crowdLevel={"혼잡"}
        />
        <SearchResultListItems
          time={"50분"}
          firstBus={"160번 (연암공과대학교 방면)"}
          secondBus={"161번 (연암공과대학교 방면)"}
          crowdLevel={"혼잡"}
        />
        <SearchResultListItems
          time={"50분"}
          firstBus={"160번 (연암공과대학교 방면)"}
          secondBus={"161번 (연암공과대학교 방면)"}
          crowdLevel={"혼잡"}
        />
        <SearchResultListItems
          time={"50분"}
          firstBus={"160번 (연암공과대학교 방면)"}
          secondBus={"161번 (연암공과대학교 방면)"}
          crowdLevel={"혼잡"}
        />
        <SearchResultListItems
          time={"50분"}
          firstBus={"160번 (연암공과대학교 방면)"}
          secondBus={"161번 (연암공과대학교 방면)"}
          crowdLevel={"혼잡"}
        />
        <SearchResultListItems
          time={"50분"}
          firstBus={"160번 (연암공과대학교 방면)"}
          secondBus={"161번 (연암공과대학교 방면)"}
          crowdLevel={"혼잡"}
        />
        <SearchResultListItems
          time={"50분"}
          firstBus={"160번 (연암공과대학교 방면)"}
          secondBus={"161번 (연암공과대학교 방면)"}
          crowdLevel={"혼잡"}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 16,
    borderColor: "black",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
  },
  leftSection: {
    alignItems: "center",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  optimalText: {
    color: "#555",
    marginBottom: 4,
    fontSize: 14,
  },
  timeText: {
    color: "#555",
    marginTop: 4,
    fontSize: 14,
  },
  routeText: {
    color: "#000",
    fontSize: 16,
  },

  routeMultiView: {
    color: "#000",
    flexDirection: "column",
  },
  crowdText: {
    color: "#d32f2f",
    fontWeight: "bold",
    fontSize: 16,
  },
});
