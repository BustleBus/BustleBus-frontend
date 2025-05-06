import { Text } from "react-native";
import ListItemBox from "@/components/common/ListItemBox";

export default function FavoriteRoute({
  start,
  end,
}: {
  start: string;
  end: string;
}) {
  return (
    <ListItemBox>
      <Text>{start} →</Text>
      <Text>{end}</Text>
    </ListItemBox>
  );
}
