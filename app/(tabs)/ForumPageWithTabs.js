import React, { useState } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ForumPage from './ForumPage';
import Marketplace from './MarketplacePage';
import Header from './Header';
import SearchBar from './SearchBar';

const backImage = require("../../assets/images/Img2.png");

const ForumPageWithTabs = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('Forum');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const toggleSearchBar = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
  };

  const renderActiveTab = () => {
    if (activeTab === 'Forum') {
      return <ForumPage searchQuery={searchQuery} username={username}/>;
    } else if (activeTab === 'Marketplace') {
      return <Marketplace searchQuery={searchQuery} username={username}/>;
    }
  };

  return (
    <ImageBackground source={backImage} style={styles.container}>
      <Header navigation={navigation} toggleSearchBar={toggleSearchBar} username={username}/>
      {isSearchBarVisible && <SearchBar onSearch={handleSearch} />}
      
      {/* Custom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setActiveTab('Forum')} style={[styles.tabButton, activeTab === 'Forum' && styles.activeTab]}>
          <Text style={styles.tabText}>Forum</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Marketplace')} style={[styles.tabButton, activeTab === 'Marketplace' && styles.activeTab]}>
          <Text style={styles.tabText}>Marketplace</Text>
        </TouchableOpacity>
      </View>

      {/* Render Active Tab Content */}
      <View style={styles.content}>
        {renderActiveTab()}
      </View>

      {/* Add Post Button */}
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
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#7C9D45',
    paddingVertical: 10,
  },
  tabButton: {
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: 'white',
  },
  tabText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  addPostIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 10,
  },
});

export default ForumPageWithTabs;
