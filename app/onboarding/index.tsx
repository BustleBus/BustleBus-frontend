import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import {Stack, useRouter} from "expo-router";
const buttons = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "제주"]; // 예시 버튼 목록

export default function Setup() {
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
  const router = useRouter();
  return (

    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text>지역을 선택해 주세요</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.buttonContainer}>
            {/* 왼쪽 버튼 */}
            <TouchableOpacity style={[styles.button, { marginRight: 10 }]}  onPress={() => router.replace("/main")}>
              <Text style={styles.buttonText}>{row[0]}</Text>
            </TouchableOpacity>

            {/* 오른쪽 버튼이 있으면 보여주고, 없으면 빈 View로 공간 확보 */}
            {row[1] ? (
              <TouchableOpacity style={styles.button}  onPress={() => router.replace("/main")}>
                <Text style={styles.buttonText}>{row[1]}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.buttonPlaceholder} />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginLeft: 20,
    marginTop: 20,
  },
  container: {
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    backgroundColor: 'transparent',
    height: 80,
    borderColor:"#cac4d0",
    borderWidth:0.3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonPlaceholder: {
    flex: 1,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
