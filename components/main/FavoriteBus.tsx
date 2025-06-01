import { Text } from "react-native";
import React from "react";
import ListItemBox from "@/components/common/ListItemBox";

export default function FavoriteBus({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <ListItemBox onPress={onPress}>
      <Text>{children}</Text>
    </ListItemBox>
  );
}
