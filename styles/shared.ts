import { StyleSheet } from "react-native";

export const sharedStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  flexOne: {
    flex: 1,
  },
  body: {
    flex: 1,
    backgroundColor: "#F4F9FF",
  },
});

export const Colors = {
  background: "#F7F9FC", // Bright Cool White
  primary: "#FF6B6B", // Vibrant Coral
  surface: "#FFFFFF",
  sub: "#FFEAA7", // Cream Yellow
  secsub: "#48DBFB", // Bright Cyan
  text: "#2F3542",
  textSub: "#747D8C",
};
