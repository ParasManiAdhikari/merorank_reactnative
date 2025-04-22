import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';

export default function TopicPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [myItems, setMyItems] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${searchQuery}`);
      const data = await response.json();
      if (data.title && data.thumbnail) {
        const newItem = {
          id: Date.now(),
          title: data.title,
          image: data.thumbnail.source,
        };
        setMyItems([...myItems, newItem]);
        setSearchQuery('');
      }
    } catch (error) {
      console.error('Error fetching wiki data:', error);
    }
  };

  const handleSaveTopic = () => {
    console.log('Saved topic:', myItems);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Wiki Articles"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      <ScrollView contentContainerStyle={styles.itemsContainer}>
        {myItems.map((item) => (
          <View key={item.id} style={styles.pill}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.text}>{item.title}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveTopic}>
        <Text style={styles.saveButtonText}>Save Topic</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 16,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    borderRadius: 20,
    padding: 8,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    color: '#00796b',
  },
  saveButton: {
    backgroundColor: '#00796b',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
