// components/common/ListItemBox.tsx
import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IconButton } from "react-native-paper";
import { sharedStyles } from "@/styles/shared";

interface ListItemBoxProps {
  children: ReactNode;
  onRemove?: () => void;
  showClose?: boolean;
  onPress?: () => void;
}

export default function ListItemBox({
  children,
  onRemove,
  showClose = true,
  onPress = () => {},
}: ListItemBoxProps) {
  return (
    <TouchableOpacity style={styles.ListItemBox} onPressIn={onPress}>
      <View style={sharedStyles.flexOne}>{children}</View>
      {showClose ? (
        <TouchableOpacity onPress={onRemove}>
          <IconButton icon="close" size={20} />
        </TouchableOpacity>
      ) : (
        // 닫기 버튼 없을 때 빈 영역 유지
        <View style={{ width: 20, height: 20 }} />
      )}
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  ListItemBox: {
    width: "100%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    borderColor: "#ebe4ed",
    borderWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // ← 선택
  },
  ListItemCloseBtn: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: -10,
  },
});
