import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';

const ForumPage = ({ searchQuery }) => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchPlants = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const plantList = [];
      querySnapshot.forEach((doc) => {
        const { imageUrl, caption, description } = doc.data();
        plantList.push({ imageUrl, caption, description, id: doc.id });
      });
      setPlants(plantList);
      setFilteredPlants(plantList);
    } catch (error) {
      console.error('Error fetching plants:', error);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = plants.filter(plant => plant.caption.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredPlants(filtered);
    } else {
      setFilteredPlants(plants);
    }
  }, [searchQuery, plants]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlants();
    setRefreshing(false);
  };

  const handleImagePress = (plant) => {
    navigation.navigate('PostPage', { plant });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {filteredPlants.map((plant, index) => (
        <View key={index} style={styles.plantContainer}>
          <TouchableOpacity onPress={() => handleImagePress(plant)}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: plant.imageUrl }} style={styles.image} />
            </View>
          </TouchableOpacity>
          <View style={styles.captionContainer}>
            <Text style={styles.captionText}>{plant.caption}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  plantContainer: {
    marginBottom: 20,
  },
  imageContainer: {
    borderWidth: 3,
    borderColor: '#7C9D45',
    borderRadius: 10,
    overflow: 'hidden', 
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  captionContainer: {
    backgroundColor: '#7C9D45',
    borderRadius: 20,
    marginTop: 10,
    padding: 10,
    alignSelf: 'center', 
    width: '90%', 
  },
  captionText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ForumPage;
