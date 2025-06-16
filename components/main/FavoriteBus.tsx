import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ListItemBox from "@/components/common/ListItemBox";
import { Colors } from "@/styles/shared";
import cleanText from "@/util/cleanText";
import BusResultBox from "../common/BusResultBox";

export default function FavoriteBus({
  onPress,
  onDelete,
  busNo,
  start,
  end,
}: {
  onPress: () => void;
  onDelete?: () => void;
  busNo: string;
  start?: string;
  end?: string;
}) {
  return (
    <BusResultBox onPress={onPress} onDelete={onDelete} busNo={busNo} start={start} end={end} />
  );
}
