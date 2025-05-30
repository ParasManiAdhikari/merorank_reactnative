import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import MyItemPill from './MyItemPill';
import styles from '../styles';
import { API_KEY } from '@env';

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
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
      if (!response.ok) throw new Error("Page not found");
      const data = await response.json();
      return {
        id: `${data.title}-${Date.now()}`, // ✅ Unique ID
        title: data.title,
        image: data.thumbnail?.source || null,
      };
    } catch (error) {
      console.error(`Wiki error for "${title}":`, error.message);
      return null;
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

  const handleClearItems = () => {
    setMyItems([]);
  };

  const handleAIClick = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            {
              role: "user",
              content: `List exact 10 "${searchQuery}". Return only the answers as plain text, one per line. Do not include any other text or warnings. Do not put any text before and after the list`
            }
          ]
        })
      });

      const data = await response.json();
      const textOutput = data.choices?.[0]?.message?.content || '';

      const titles = textOutput
        .split('\n')
        .map((line) => line.replace(/^[\s\uFEFF]*\d+[\).]?\s*/, '').trim())
        .filter(line => line);

      const items = await Promise.all(
        titles.map(async (title) => await handleSelectResult(title))
      );

      const validItems = items.filter(item => item !== null);

      setMyItems([...myItems, ...validItems]);
      setSearchQuery('');
    } catch (error) {
      console.error('Error fetching from OpenRouter:', error);
    }
  };

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <View style={styles.searchBarRow}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Anything"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.aiButton} onPress={handleAIClick}>
          <Text style={styles.aiButtonText}>✵</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH VIEW */}
      {searchResults.length > 0 && (
        <FlatList
          style={{ flex: 1 }}
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
      <ScrollView contentContainerStyle={styles.itemsContainer}>
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

      {/* Footer ROW */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.clearButton]}
          onPress={handleClearItems}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveTopic}>
          <Text style={styles.saveButtonText}>Save Ranking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}