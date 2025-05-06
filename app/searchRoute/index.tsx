import { useState } from "react";
import { StyleSheet, View } from "react-native";
import SearchTextInput from "@/components/common/SearchTextInput";
import { Card, Divider } from "react-native-paper";
import SearchLog from "@/components/searchLog/SearchLog";
import SearchResult from "@/components/searchResult/SearchResult";

export default function SearchRoute() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [focusTarget, setFocusTarget] = useState<"start" | "end" | null>(null);

  return (
    <View style={styles.body}>
      <View style={styles.search}>
        <SearchTextInput
          text={start}
          setText={(text) => {
            setStart(text);
            setFocusTarget("start");
          }}
          placeholder={"출발지"}
          onBlur={() => setFocusTarget(null)}
          style={focusTarget === "end" ? styles.hidden : undefined}
        />
        <SearchTextInput
          text={end}
          setText={(text) => {
            setEnd(text);
            setFocusTarget("end");
          }}
          placeholder={"목적지"}
          onBlur={() => setFocusTarget(null)}
          style={focusTarget === "start" ? styles.hidden : undefined}
        />
      </View>
      <Divider />
      <View style={styles.result}>
        {focusTarget ? (
          <Card style={styles.card}>
            <SearchResult
              place={"연암공과대학교"}
              placeDetail={"경상남도 진주시 대신로 369 ..."}
            />
            <SearchResult
              place={"연암공과대학교"}
              placeDetail={"경상남도 진주시 대신로 369 ..."}
            />
            <SearchResult
              place={"연암공과대학교"}
              placeDetail={"경상남도 진주시 대신로 369 ..."}
            />
          </Card>
        ) : (
          <SearchLog text={"연암공과대학교-> 경상국립대학교"} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 10,
  },
  search: {
    marginBottom: 10,
  },
  hidden: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
    pointerEvents: "none",
  },
  result: {
    flex: 1, // 카드나 로그가 차지할 공간
  },
  card: {
    flexDirection: "row",
    flex: 1, // 카드 자체도 최대 확장
    padding: 16,
    backgroundColor: "white",
  },
});
