import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

const Shop = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { shop } = route.params; // Get the shop details from route params
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const plantsQuery = query(collection(db, 'plants'), where('shopId', '==', shop.id));
        const querySnapshot = await getDocs(plantsQuery);
        const plantList = [];
        querySnapshot.forEach((doc) => {
          const { imageUrl, name, price } = doc.data(); // Assuming the field name for plant name is 'name'
          plantList.push({ imageUrl, name, price });
        });
        setPlants(plantList);
      } catch (error) {
        console.error('Error fetching plants:', error);
      }
    };

    fetchPlants();
  }, [shop.id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../../assets/images/Back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{shop.shopName}</Text>
      </View>
      <View style={styles.shopContainer}>
        <Image source={{ uri: shop.imageUrl }} style={styles.image} />
        <View style={styles.infoContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.shopOwner}>{shop.ownerName}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailsContainer}>
            <Text style={styles.details}>{shop.phoneNo}</Text>
            <Text style={styles.details}>{shop.city}</Text>
          </View>
        </View>
      </View>

      <View style={styles.plantsContainer}>
        {plants.map((plant, index) => (
          <View key={index} style={styles.plantContainer}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: plant.imageUrl }} style={styles.plantImage} />
            </View>
            <View style={styles.nameContainer}>
            <Text style={styles.plantName}>{plant.name}</Text>
              <Text style={styles.plantName}>Price: {plant.price}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingBottom: 20,
  },
  header: {
    width: '100%',
    backgroundColor: '#7C9D45',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    marginTop:50,
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  backIcon: {
    width: 36,
    height: 32,
    tintColor: 'white', // Make the arrow white
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  shopContainer: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    borderColor: '#7C9D45',
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    width: '90%',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopOwner: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7C9D45',
    textAlign: 'center',
  },
  divider: {
    height: 2,
    backgroundColor: '#7C9D45',
    marginVertical: 5,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  details: {
    fontSize: 14,
    color: '#7C9D45',
    fontWeight: 'bold',
  },
  plantsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    width: '90%',
    marginTop: 20,
  },
  plantContainer: {
    width: '48%',
    margin: '1%',
  },
  imageContainer: {
    borderWidth: 2,
    borderColor: '#7C9D45',
    borderRadius: 10,
    overflow: 'hidden',
  },
  plantImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  nameContainer: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantName: {
    color: '#7C9D45',
    fontWeight: 'bold',
  },
});

export default Shop;
