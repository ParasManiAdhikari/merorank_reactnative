import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet, ScrollView, FlatList, ImageBackground } from 'react-native';

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
          <View key={item.id} style={styles.pillContainer}>
            {item.deleting ? (
              <View style={[styles.pillBackground, styles.pillDeletingBackground]}>
                <View style={styles.pillContent}>
                  <Text style={styles.rank}>{index + 1}.</Text>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} />
                  ) : (
                    <View style={styles.placeholderImage} />
                  )}
                  <Text style={styles.text}>{item.title}</Text>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteItem(item.id)}>
                    <Text style={styles.deleteButtonText}>✖</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.switchButton, activeSwitches.includes(item.id) && styles.switchButtonActive]}
                    onPress={() => handleSwitch(item.id)}
                  >
                    <Text style={styles.switchButtonText}>
                      {activeSwitches.includes(item.id) ? ' ⥮ ' : ' ⥮ '}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.pillBackground}
                imageStyle={styles.pillBackgroundImage}
                blurRadius={10} // Apply blur effect
              >
                <View style={styles.pillContent}>
                  <Text style={styles.rank}>{index + 1}.</Text>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} />
                  ) : (
                    <View style={styles.placeholderImage} />
                  )}
                  <Text style={styles.text}>{item.title}</Text>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteItem(item.id)}>
                    <Text style={styles.deleteButtonText}>✖</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.switchButton, activeSwitches.includes(item.id) && styles.switchButtonActive]}
                    onPress={() => handleSwitch(item.id)}
                  >
                    <Text style={styles.switchButtonText}>
                      {activeSwitches.includes(item.id) ? ' ⥮ ' : ' ⥮ '}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            )}
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
    padding: 24, // Increased padding for left and right
    paddingTop: 80, // Adjusted for removed header
    backgroundColor: '#121212',
  },
  searchBar: {
    height: 50,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 24, // Increased padding for left and right
    marginBottom: 16,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    fontSize: 16,
  },
  searchResult: {
    padding: 12,
    paddingHorizontal: 24, // Increased padding for left and right
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    marginBottom: 8,
  },
  searchResultText: {
    fontSize: 16,
    color: '#fff', // This determines the color of the search results text
  },
  itemsContainer: {
    flexDirection: 'column',
    marginVertical: 16,
  },
  pillContainer: {
    marginVertical: 6,
    width: '100%',
    minHeight: 80,
    borderRadius: 10,
    overflow: 'hidden',
  },
  pillBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  pillDeletingBackground: {
    backgroundColor: '#ff746c',
  },
  pillBackgroundImage: {
    borderRadius: 10,
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 12, // Increased margin to adjust horizontal position
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 12,
  },
  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#333',
    marginRight: 12,
  },
  text: {
    fontSize: 14,
    color: '#fff',
    flexShrink: 1,
  },
  switchButton: {
    marginLeft: 8,
    width: 40, // Set width for circular button
    height: 40, // Set height for circular button
    borderRadius: 5, // Make it circular
    backgroundColor: '#333',
    justifyContent: 'center', // Center the content
    alignItems: 'center', // Center the content
  },
  switchButtonActive: {
    backgroundColor: '#597d35',
  },
  switchButtonText: {
    color: '#fff',
    fontSize: 25,
  },
  deleteButton: {
    marginLeft: 'auto',
    width: 40, // Set width for circular button
    height: 40, // Set height for circular button
    borderRadius: 5, // Make it circular
    backgroundColor: '#ff746c',
    justifyContent: 'center', // Center the content
    alignItems: 'center', // Center the content
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  saveButton: {
    backgroundColor: '#fff',
    padding: 16,
    paddingHorizontal: 24, // Increased padding for left and right
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
