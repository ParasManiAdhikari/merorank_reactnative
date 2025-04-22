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
      if (data.title && data.thumbnail) {
        const newItem = {
          id: Date.now(),
          title: data.title,
          image: data.thumbnail.source,
        };
        setMyItems([...myItems, newItem]);
        setSearchQuery('');
        setSearchResults([]);
      }
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Wiki Articles"
        value={searchQuery}
        onChangeText={setSearchQuery}
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
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.text}>{item.title}</Text>
            <TouchableOpacity
              style={[
                styles.switchButton,
                activeSwitches.includes(item.id) && styles.switchButtonActive,
              ]}
              onPress={() => handleSwitch(item.id)}
            >
              <Text style={styles.switchButtonText}>
                {activeSwitches.includes(item.id) ? 'Active' : 'Switch'}
              </Text>
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
  searchResult: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchResultText: {
    fontSize: 16,
    color: '#00796b',
  },
  itemsContainer: {
    flexDirection: 'column',
    marginVertical: 16,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    borderRadius: 50,
    padding: 12,
    marginVertical: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796b',
    marginRight: 16,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  text: {
    fontSize: 18,
    color: '#00796b',
    flexShrink: 1,
  },
  switchButton: {
    marginLeft: 'auto',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  switchButtonActive: {
    backgroundColor: '#00796b',
  },
  switchButtonText: {
    color: '#fff',
    fontSize: 14,
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
