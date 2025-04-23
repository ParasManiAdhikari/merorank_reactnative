import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 50,
    backgroundColor: '#121212',
  },
  searchBar: {
    height: 60,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    fontSize: 16,
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
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginStart: 20,
    marginRight: 12
  },
  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#333',
    marginStart: 20,
    marginRight: 12
  },
  text: {
    fontSize: 14,
    color: '#fff',
    flexShrink: 1,
  },
  switchButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#ff746c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  saveButton: {
    backgroundColor: '#fff',
    padding: 16,
    paddingHorizontal: 24,
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

export default styles;
