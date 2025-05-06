import { IconButton, TextInput } from "react-native-paper";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Dispatch, SetStateAction } from "react";

export default function SearchTextInput({
  text,
  setText,
  placeholder,
  onBlur,
  style,
}: {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  placeholder: string;
  onBlur: () => void;
  style?: object;
}) {
  return (
    <View style={[styles.box, style]}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        onBlur={() => setTimeout(onBlur, 10)} // 포커스 해제 타이밍 안정화
        mode="flat"
        style={styles.input}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        dense
      />
      <TouchableOpacity
        onPress={() => {
          setText("");
          onBlur();
        }}
        style={styles.icon}
      >
        <IconButton icon="close" size={16} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ece5f0",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 14,
    paddingHorizontal: 0,
  },
  icon: {
    marginLeft: 4,
    padding: 0,
  },
});
