import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#121212',
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12, // Adjusted spacing
  },
  searchBar: {
    flex: 1, // Ensures it fills available space
    height: 50, // Reduced height for better fit
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 25, // Adjusted for proportionality
    paddingHorizontal: 16,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    fontSize: 14,
  },
  aiButton: {
    height: 50, // Adjusted to match searchBar height
    width: 100, // Adjusted for proportionality
    marginLeft: 12,
    borderRadius: 50,
    backgroundColor: '#f4a460',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  searchResult: {
    padding: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    marginBottom: 8,
  },
  searchResultText: {
    fontSize: 16,
    color: '#fff',
  },
  itemsContainer: {
    flexDirection: 'column',
    marginVertical: 8, // Adjusted spacing
  },
  pillContainer: {
    marginVertical: 4, // Adjusted spacing
    width: '100%',
    height: 70, // Fixed height for consistent size
    borderRadius: 50,
    overflow: 'hidden',
  },
  pillBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  pillDeletingBackground: {
    backgroundColor: '#F48A60',
  },
  pillBackgroundImage: {
    borderRadius: 10,
  },
  defaultBackground: {
    backgroundColor: '#1e1e1e',
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
    width: 30,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginStart: 3,
    marginRight: 12
  },
  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#333',
    marginStart: 3,
    marginRight: 12
  },
  text: {
    fontSize: 14,
    color: '#fff',
    flexShrink: 1,
  },
  switchButton: {
    marginLeft: 8,
    width: 50,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  switchButtonActive: {
    backgroundColor: '#f4a460',
  },
  switchButtonText: {
    color: '#fff',
    fontSize: 25,
  },
  deleteButton: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#F48A60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12, // Space between buttons
  },
  clearButton: {
    flex: 0.4, // Ensures it's smaller than the save button
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center', // Centers the text vertically
  },
  clearButtonText: {
    color: '#FCD7AF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
