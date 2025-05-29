import { IconButton, TextInput } from 'react-native-paper';
import { KeyboardTypeOptions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Dispatch, SetStateAction } from 'react';

export default function SearchTextInput({
  text,
  setText,
  placeholder,
  onBlur,
  style,
  keyboardType = 'default',
  onSubmitEditing,
}: {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  placeholder: string;
  onBlur?: () => void; // 선택적 onBlur
  style?: object;
  keyboardType?: KeyboardTypeOptions;
  onSubmitEditing?: () => void;
}) {
  return (
    <View style={[styles.box, style]}>
      <TextInput
        value={text}
        onSubmitEditing={onSubmitEditing}
        keyboardType={keyboardType}
        onChangeText={setText}
        placeholder={placeholder}
        onBlur={onBlur ? () => setTimeout(onBlur, 10) : undefined} // 옵션 처리
        mode="flat"
        style={styles.input}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        dense
      />
      <TouchableOpacity
        onPress={() => {
          setText('');
          if (onBlur) onBlur(); // onBlur가 있을 때만 호출
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ece5f0',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 14,
    paddingHorizontal: 0,
  },
  icon: {
    marginLeft: 4,
    padding: 0,
  },
});
