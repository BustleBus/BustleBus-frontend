import React from "react";
import BusResultBox from "../common/BusResultBox";

export default function BusLog({
  bus,
  start,
  end,
  onClose,
  onPress,
}: {
  bus: string;
  start: string;
  end: string;
  onClose: () => void;
  onPress: () => void;
}) {
  return <BusResultBox onPress={onPress} busNo={bus} start={start} end={end} onDelete={onClose} />;
}
