import { StyleSheet, Text, View } from 'react-native';
import ListItemBox from '@/components/common/ListItemBox';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function SearchBusResult({
  bus,
  routePath,
  onPress,
}: {
  bus: string;
  routePath: string;
  onPress?: () => void;
}) {
  const router = useRouter();
  return (
    <View style={styles.box}>
      <ListItemBox
        showClose={false}
        onPress={() => {
          onPress?.();
          router.navigate('/busDetailPage');
        }}
      >
        <View>
          <Text style={{ fontWeight: 'bold' }}>{bus}</Text>
          <Text>{routePath}</Text>
        </View>
      </ListItemBox>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginBottom: 10,
  },
});
