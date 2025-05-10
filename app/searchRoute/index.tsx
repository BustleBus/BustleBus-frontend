import { useState } from "react";
import { StyleSheet, View } from "react-native";
import SearchTextInput from "@/components/common/SearchTextInput";
import { Card, Divider } from "react-native-paper";
import SearchRouterResult from "@/components/searchRouterResult/SearchRouterResult";
import RouterLog from "@/components/routerLog/RouterLog";
import { useRouter } from "expo-router";

export default function SearchRoute() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [focusTarget, setFocusTarget] = useState<"start" | "end" | null>(null);
  //todo: 엔터를 막아야함. 엔터 대신 클릭을 해야 텍스트 필드를 채우도록 해야함.
  // todo: 도착지에서 선택을 했을 때 출발지가 되어 있으면 페이지가 이동 되어야함.
  const router = useRouter();
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
            <SearchRouterResult
              place={"연암공과대학교"}
              placeDetail={"경상남도 진주시 대신로 369 ..."}
            />
            <SearchRouterResult
              place={"연암공과대학교"}
              placeDetail={"경상남도 진주시 대신로 369 ..."}
            />
            <SearchRouterResult
              place={"연암공과대학교"}
              placeDetail={"경상남도 진주시 대신로 369 ..."}
            />
          </Card>
        ) : (
          <RouterLog text={"연암공과대학교-> 경상국립대학교"} />
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
