import { Text } from "react-native";
import React from "react";
import ListItemBox from "@/components/common/ListItemBox";

export default function FavoriteBus({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ListItemBox>
      <Text>{children}</Text>
    </ListItemBox>
  );
}
