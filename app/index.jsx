import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './styles';

export default function HomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* NAVIGATE TO TOPIC PAGE BUTTON */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => router.push('/components/TopicPage')}
      >
        <Text style={styles.saveButtonText}>Go to Topic Page</Text>
      </TouchableOpacity>
    </View>
  );
}