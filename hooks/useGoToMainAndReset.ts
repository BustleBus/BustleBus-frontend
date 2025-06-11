import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";

export const useGoToMainAndReset = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  return () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "main" }],
    });
  };
};

export const useGoBack = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  return () => {
    navigation.goBack();
  };
};
