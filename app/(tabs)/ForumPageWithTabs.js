import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ImageBackground, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ForumPage from './ForumPage';
import Marketplace from './MarketplacePage';
import Header from './Header';
import SearchBar from './SearchBar';

const backImage = require("../../assets/images/Img2.png");

const Tab = createMaterialTopTabNavigator();

const ForumPageWithTabs = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const toggleSearchBar = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
  };

  const ForumComponent = () => <ForumPage searchQuery={searchQuery} username={username} />;
  const MarketplaceComponent = () => <Marketplace searchQuery={searchQuery} username={username} />;

  return (
    <ImageBackground source={backImage} style={styles.container}>
      <Header navigation={navigation} toggleSearchBar={toggleSearchBar} username={username} />
      {isSearchBarVisible && <SearchBar onSearch={handleSearch} />}
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'white',
          tabBarStyle: { backgroundColor: '#7C9D45' },
          tabBarLabelStyle: { fontWeight: 'bold', fontSize: 16 },
        }}>
        <Tab.Screen name="Forum" component={ForumComponent} />
        <Tab.Screen name="Marketplace" component={MarketplaceComponent} />
      </Tab.Navigator>
      <TouchableOpacity onPress={() => navigation.navigate('CreatePost', { username })} style={styles.addPostIcon}>
        <Image source={require('../../assets/images/Add.png')} style={{ width: 50, height: 50 }} />
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    marginTop: 40,
  },
  addPostIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 10,
  },
});

export default ForumPageWithTabs;
