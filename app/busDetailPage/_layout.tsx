import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or any icon set you prefer
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function MainLayout() {
  const router = useRouter();
  const [bus, setBus] = useState();
  useEffect(() => {
    const fetchBus = async () => {
      const selectedBusString = await AsyncStorage.getItem('selectedBus');
      if (selectedBusString) {
        const selectedBus = JSON.parse(selectedBusString);
        setBus(selectedBus);
      }
    };
    fetchBus();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerTitle: () => (
          <Text style={{ fontSize: 16 }}> {bus?.busNo ? `${bus.busNo}` : '버스 정보 없음'}</Text>
        ),
        headerTitleAlign: 'left',

        headerLeft: () => (
          <TouchableOpacity onPressIn={() => router.back()} style={{ paddingHorizontal: 12 }}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
        ),

        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPressIn={() => {
                router.push('/busTimeTable');
              }}
            >
              <Text style={styles.timeTableButton}>버스 시간표</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPressIn={() => {
                router.replace('/main');
              }}
              style={{ paddingHorizontal: 12 }}
            >
              <Ionicons name="home" size={24} />
            </TouchableOpacity>
          </View>
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  timeTableButton: {
    borderColor: '#333',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontWeight: 'bold',
    fontSize: 10,
    color: '#333',
  },
});
