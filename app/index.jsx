import React, { useState, useRef } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  StatusBar, 
  Animated, 
  PanResponder,
  LayoutAnimation,
  Platform,
  UIManager 
} from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ITEM_HEIGHT = 60;

// iOS dark mode colors
const colors = {
  background: '#1c1c1e',
  cardBackground: '#2c2c2e',
  text: '#ffffff',
  secondaryText: '#ebebf5b3',
  separator: '#38383a',
};

export default function MeroRank() {
  const [items, setItems] = useState([
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' },
    { id: '3', title: 'Item 3' },
    { id: '4', title: 'Item 4' },
    { id: '5', title: 'Item 5' },
  ]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>MeroRank</Text>
      <View style={styles.list}>
        {items.map((item, index) => (
          <DraggableItem
            key={item.id}
            id={item.id}
            title={item.title}
            index={index}
            items={items}
            setItems={setItems}
          />
        ))}
      </View>
    </View>
  );
}

function DraggableItem({ id, title, index, items, setItems }) {
  // Animation value for the item's position
  const pan = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);
  
  // Create the PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        pan.setOffset({
          x: 0,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();
        setIsDragging(false);
        
        // Calculate the new position based on the gesture
        const moveDistance = gesture.dy;
        const movePosition = Math.round(moveDistance / ITEM_HEIGHT);
        
        // Only update if there's a change in position
        if (movePosition !== 0) {
          const newIndex = Math.max(0, Math.min(items.length - 1, index + movePosition));
          
          if (newIndex !== index) {
            // Create a new array with the item moved to the new position
            const newItems = [...items];
            const [movedItem] = newItems.splice(index, 1);
            newItems.splice(newIndex, 0, movedItem);
            
            // Configure the animation
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            
            // Update the state with the new array
            setItems(newItems);
          }
        }
        
        // Reset the pan position
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.itemContainer,
        {
          transform: [{ translateY: pan.y }],
          zIndex: isDragging ? 999 : 1,
          shadowOpacity: isDragging ? 0.2 : 0,
          backgroundColor: isDragging ? colors.separator : colors.cardBackground,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Text style={styles.itemText}>{title}</Text>
      <Text style={styles.dragHandle}>≡</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: colors.text,
  },
  list: {
    marginHorizontal: 16,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 2,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: colors.text,
  },
  dragHandle: {
    fontSize: 20,
    color: colors.secondaryText,
  },
});