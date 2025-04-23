import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './styles';

export default function HomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.saveButton, { flex: 1, justifyContent: 'center' }]} // Adjusted to fill container
        onPress={() => router.push('/components/TopicPage')}
      >
        <Text style={styles.saveButtonText}>Create a Ranking</Text>
      </TouchableOpacity>
    </View>
  );
}