import { Text, StyleSheet } from "react-native";
import React from "react";
import ListItemBox from "@/components/common/ListItemBox";

export default function FavoriteBus({
  children,
  onPress,
  onDelete,
}: {
  children: React.ReactNode;
  onPress: () => void;
  onDelete?: () => void;
}) {
  return (
    <ListItemBox onPress={onPress} onRemove={onDelete} showClose={!!onDelete}>
      <Text style={styles.busText}>{children}</Text>
    </ListItemBox>
  );
}

const styles = StyleSheet.create({
  busText: {
    fontSize: 16,
  },
});
