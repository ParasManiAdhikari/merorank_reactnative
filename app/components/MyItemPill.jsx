import React from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import styles from '../styles';

export default function MyItemPill({ item, index, activeSwitches, handleDeleteItem, handleSwitch }) {
  return (
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
          source={item.image ? { uri: item.image } : null}
          style={[
            styles.pillBackground,
            !item.image && styles.defaultBackground,
          ]}
          imageStyle={styles.pillBackgroundImage}
          blurRadius={item.image ? 100 : 0}
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
  );
}
