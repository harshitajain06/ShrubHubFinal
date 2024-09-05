import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchBar = ({ onSearch }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        onChangeText={onSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    borderColor: '#7C9D45',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
});

export default SearchBar;
