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
      <Text numberOfLines={1} ellipsizeMode="tail">
        🚩{start}
      </Text>
      <Text numberOfLines={1} ellipsizeMode="tail">
        🏁{end}
      </Text>
    </ListItemBox>
  );
}
