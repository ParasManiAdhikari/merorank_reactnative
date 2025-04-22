import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet, ScrollView, FlatList } from 'react-native';

export default function TopicPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [activeSwitches, setActiveSwitches] = useState([]);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 500); // Debounce to avoid excessive API calls
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${searchQuery}&origin=*`);
      const data = await response.json();
      if (data.query && data.query.search) {
        setSearchResults(data.query.search);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleSelectResult = async (title) => {
    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
      const data = await response.json();
      const newItem = {
        id: Date.now(),
        title: data.title,
        image: data.thumbnail?.source || null, // Fallback to null if no image
      };
      setMyItems([...myItems, newItem]);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error fetching wiki data:', error);
    }
  };

  const handleSwitch = (id) => {
    if (activeSwitches.includes(id)) {
      setActiveSwitches(activeSwitches.filter((activeId) => activeId !== id));
    } else {
      const newActiveSwitches = [...activeSwitches, id];
      if (newActiveSwitches.length === 2) {
        swapItems(newActiveSwitches[0], newActiveSwitches[1]);
        setActiveSwitches([]);
      } else {
        setActiveSwitches(newActiveSwitches);
      }
    }
  };

  const swapItems = (id1, id2) => {
    const index1 = myItems.findIndex((item) => item.id === id1);
    const index2 = myItems.findIndex((item) => item.id === id2);
    if (index1 !== -1 && index2 !== -1) {
      const newItems = [...myItems];
      [newItems[index1], newItems[index2]] = [newItems[index2], newItems[index1]];
      setMyItems(newItems);
    }
  };

  const handleSaveTopic = () => {
    console.log('Saved topic:', myItems);
  };

  const handleDeleteItem = (id) => {
    setMyItems(myItems.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Wiki Articles"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#888"
      />
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.pageid.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.searchResult} onPress={() => handleSelectResult(item.title)}>
              <Text style={styles.searchResultText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <ScrollView contentContainerStyle={styles.itemsContainer}>
        {myItems.map((item, index) => (
          <View key={item.id} style={styles.pill}>
            <Text style={styles.rank}>{index + 1}</Text>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage} />
            )}
            <Text style={styles.text}>{item.title}</Text>
            <TouchableOpacity
              style={[styles.switchButton, activeSwitches.includes(item.id) && styles.switchButtonActive]}
              onPress={() => handleSwitch(item.id)}
            >
              <Text style={styles.switchButtonText}>
                {activeSwitches.includes(item.id) ? 'Active' : 'Switch'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteItem(item.id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveTopic}>
        <Text style={styles.saveButtonText}>Save Topic</Text>
      </TouchableOpacity>
    </View>
  );
}

// Stye
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 80, // Adjusted for removed header
    backgroundColor: '#121212', // Dark background
  },
  searchBar: {
    height: 50,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 25, // Rounded input
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1e1e1e', // Darker input background
    color: '#fff', // White text
    fontSize: 16,
  },
  searchResult: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1e1e1e', // Darker background for results
    borderRadius: 8, // Slightly rounded corners
    marginBottom: 8,
  },
  searchResultText: {
    fontSize: 16,
    color: '#80cbc4', // Accent color for text
  },
  itemsContainer: {
    flexDirection: 'column',
    marginVertical: 16,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e', // Darker pill background
    borderRadius: 10, // Less rounded
    padding: 8, // Smaller padding
    marginVertical: 6, // Smaller margin
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  rank: {
    fontSize: 14, // Smaller font size
    fontWeight: 'bold',
    color: '#80cbc4',
    marginRight: 12,
  },
  image: {
    width: 40, // Smaller image
    height: 40,
    borderRadius: 5, // Less rounded
    marginRight: 12,
  },
  placeholderImage: {
    width: 40, // Smaller placeholder
    height: 40,
    borderRadius: 5, // Less rounded
    backgroundColor: '#333',
    marginRight: 12,
  },
  text: {
    fontSize: 14, // Smaller font size
    color: '#fff',
    flexShrink: 1,
  },
  switchButton: {
    marginLeft: 'auto',
    padding: 6, // Smaller button
    borderRadius: 10, // Less rounded
    backgroundColor: '#333',
  },
  switchButtonActive: {
    backgroundColor: '#80cbc4',
  },
  switchButtonText: {
    color: '#fff',
    fontSize: 12, // Smaller font size
  },
  deleteButton: {
    marginLeft: 8,
    padding: 6, // Smaller button
    borderRadius: 10, // Less rounded
    backgroundColor: '#ff5252', // Red delete button
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12, // Smaller font size
  },
  saveButton: {
    backgroundColor: '#80cbc4', // Accent color for save button
    padding: 16,
    borderRadius: 25, // Rounded button
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#121212', // Dark text for contrast
    fontSize: 16,
    fontWeight: 'bold',
  },
});
