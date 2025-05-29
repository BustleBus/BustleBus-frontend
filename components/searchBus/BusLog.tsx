import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import SearchLog from '@/components/common/SearchLog';
import { useRouter } from 'expo-router';

export default function BusLog({
  bus,
  routePath,
  onClose,
  onPress,
}: {
  bus: string;
  routePath: string;
  onClose: () => void;
  onPress: () => void;
}) {
  const router = useRouter();
  return (
    <View>
      <SearchLog onPress={onPress} onClose={() => onClose()}>
        <Text style={styles.logText}>
          <View>
            <Text style={styles.busText}>{bus}</Text>
            <Text style={styles.routePathText}>{routePath}</Text>
          </View>
        </Text>
      </SearchLog>
    </View>
  );
}
const styles = StyleSheet.create({
  logText: {
    flex: 1,
    fontSize: 14,
  },
  busText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  routePathText: {
    fontSize: 14,
  },
});
