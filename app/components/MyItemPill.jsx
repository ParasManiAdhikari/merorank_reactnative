import React from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import styles from '../styles';

// Component to render a PILL in the list
export default function MyItemPill({ item, index, activeSwitches, handleDeleteItem, handleSwitch }) {
  return (
    <View key={item.id} style={styles.pillContainer}>
      {/* If a PILL is marked for deletion, show a red background */}
      {item.deleting ? (
        <View style={[styles.pillBackground, styles.pillDeletingBackground]}>
          <View style={styles.pillContent}>
            {/* RANK */}
            <Text style={styles.rank}>{index + 1}.</Text>
            {/* IMAGE */}
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage} />
            )}
            {/* TITLE */}
            <Text style={styles.text}>{item.title}</Text>
            {/* DELETE BUTTON */}
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteItem(item.id)}>
              <Text style={styles.deleteButtonText}>✖</Text>
            </TouchableOpacity>
            {/* SWITCH BUTTON - Hidden when deleting */}
            {!item.deleting && (
              <TouchableOpacity
                style={[styles.switchButton, activeSwitches.includes(item.id) && styles.switchButtonActive]}
                onPress={() => handleSwitch(item.id)}
              >
                <Text style={styles.switchButtonText}>
                  {activeSwitches.includes(item.id) ? ' ⥮ ' : ' ⥮ '}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        // If the item is not being deleted, show the regular background
        <ImageBackground
          source={item.image ? { uri: item.image } : null}
          style={[
            styles.pillBackground,
            !item.image && styles.defaultBackground, // Apply default background if no image
          ]}
          imageStyle={styles.pillBackgroundImage}
          blurRadius={item.image ? 100 : 0} // Blur Image
        >
          <View style={styles.pillContent}>
            {/* RANK */}
            <Text style={styles.rank}>{index + 1}.</Text>
            {/* IMAGE */}
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage} />
            )}
            {/* TITLE */}
            <Text style={styles.text}>{item.title}</Text>
            {/* DELETE BUTTON */}
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteItem(item.id)}>
              <Text style={styles.deleteButtonText}>✖</Text>
            </TouchableOpacity>
            {/* SWITCH BUTTON */}
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
  );
}
