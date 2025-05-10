import { useState } from "react";
import { StyleSheet, View } from "react-native";
import SearchTextInput from "@/components/common/SearchTextInput";
import { Card, Divider } from "react-native-paper";
import BusLog from "@/components/searchBus/BusLog";
import SearchBusResult from "@/components/searchBus/SearchBusResult";
import { useRouter } from "expo-router";

export default function SearchBus() {
  const [start, setStart] = useState("");
  const [focusTarget, setFocusTarget] = useState<"start" | "end" | null>(null);
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
          placeholder={"버스 번호"}
          onBlur={() => setFocusTarget(null)}
          style={focusTarget === "end" ? styles.hidden : undefined}
        />
      </View>
      <Divider />
      <View style={styles.result}>
        {focusTarget ? (
          <Card style={styles.card}>
            <SearchBusResult
              bus={"160 [진주]"}
              routePath={"공영차고지<--> 장흥"}
            />
            <SearchBusResult
              bus={"360 [진주]"}
              routePath={"금산 <-->공영 차고지"}
            />
            <SearchBusResult
              bus={"10 [진주]"}
              routePath={"혁신도시 <---> 금산"}
            />
          </Card>
        ) : (
          <BusLog bus={"160 [진주]"} routePath={"공영차고지<-->장흥"} />
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
