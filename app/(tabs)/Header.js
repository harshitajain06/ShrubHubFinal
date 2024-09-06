import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = ({ toggleSearchBar }) => {
  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, paddingTop: 10, paddingHorizontal: 20, backgroundColor: '#7C9D45' }}>
      <TouchableOpacity onPress={toggleSearchBar}>
        <Image source={require('../../assets/images/search.png')} style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
      <View>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Forum</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('MyProfile')}>
        <Image source={require('../../assets/images/profile1.png')} style={{ width: 30, height: 30 }} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
