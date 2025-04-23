import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import MyItemPill from './MyItemPill';
import styles from '../styles';

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
    const updatedItems = myItems.map((item) =>
      item.id === id ? { ...item, deleting: true } : item
    );
    setMyItems(updatedItems);

    setTimeout(() => {
      setMyItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }, 300);
  };

  const handleAIClick = () => {
    console.log('AI button clicked');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarRow}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Wiki Articles"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.aiButton} onPress={handleAIClick}>
          <Text style={styles.aiButtonText}>AI</Text>
        </TouchableOpacity>
      </View>
      {/* SEARCH VIEW */}
      {searchResults.length > 0 && (
        <FlatList
          style={{ flex: 1 }} // Ensures it fills available space
          data={searchResults}
          keyExtractor={(item) => item.pageid.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.searchResult} onPress={() => handleSelectResult(item.title)}>
              <Text style={styles.searchResultText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      {/* myItems VIEW */}
      <ScrollView contentContainerStyle={[styles.itemsContainer, { flexGrow: 1 }]}>
        {myItems.map((item, index) => (
          <MyItemPill
            key={item.id}
            item={item}
            index={index}
            activeSwitches={activeSwitches}
            handleDeleteItem={handleDeleteItem}
            handleSwitch={handleSwitch}
          />
        ))}
      </ScrollView>
      
      {/* SAVE BUTTON */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveTopic}>
        <Text style={styles.saveButtonText}>Save Topic</Text>
      </TouchableOpacity>
    </View>
  );
}