import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../config/firebase';

const MarketPlace = ({ searchQuery }) => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const navigation = useNavigation();

  const fetchShops = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'shops'));
      const shopList = [];
      querySnapshot.forEach((doc) => {
        const { shopName, phoneNo, city, imageUrl, ownerName } = doc.data();
        shopList.push({ id: doc.id, shopName, phoneNo, city, imageUrl, ownerName });
      });
      setShops(shopList);
      setFilteredShops(shopList);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = shops.filter(shop =>
        shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredShops(filtered);
    } else {
      setFilteredShops(shops);
    }
  }, [searchQuery, shops]);

  const handleViewPress = (shop) => {
    navigation.navigate('Shop', { shop });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {filteredShops.map((shop, index) => (
        <View key={index} style={styles.shopContainer}>
          <Image source={{ uri: shop.imageUrl }} style={styles.image} />
          <View style={styles.infoContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.shopName}>{shop.shopName}</Text>
              <TouchableOpacity style={styles.viewButton} onPress={() => handleViewPress(shop)}>
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailsContainer}>
              <Text style={styles.details}>{shop.phoneNo}</Text>
              <Text style={styles.details}>{shop.city}</Text>
            </View>
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
  shopContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#7C9D45',
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7C9D45',
  },
  viewButton: {
    backgroundColor: '#7C9D45',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  viewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#7C9D45',
    marginVertical: 5,
  },
  detailsContainer: {
    marginTop: 5,
  },
  details: {
    fontSize: 14,
    color: '#7C9D45',
  },
});

export default MarketPlace;
