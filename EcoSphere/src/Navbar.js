import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

const { height } = Dimensions.get('window');

const NavBar = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState('Home');

  const handlePress = (screen) => {
    setSelected(screen);
    navigation.navigate(screen);
  };

  return (
    <View style={tw`absolute bottom-0 w-full`}>
      {/* Divider Line */}
      <View style={tw`h-0.5 w-full bg-gray-400`} />
      <View style={tw`flex-row justify-around items-center h-[${height * 0.05}px] bg-green-100 shadow-lg`}>
        <TouchableOpacity style={tw`flex-1 p-2 items-center`} onPress={() => handlePress('Home')}>
          <Image source={require('../assets/images/solar_home-2-bold.png')} style={tw`w-8 h-8`} />
        </TouchableOpacity>
        
        <TouchableOpacity style={tw`flex-1 p-2 items-center`} onPress={() => handlePress('Feed')}>
          <Image source={require('../assets/images/solar_chat-dots-bold.png')} style={tw`w-8 h-8`} />
        </TouchableOpacity>
        
        <TouchableOpacity style={tw`flex-1 p-2 items-center`} onPress={() => handlePress('Progress')}>
          <Image source={require('../assets/images/Vector.png')} style={tw`w-8 h-8`} />
        </TouchableOpacity>
        
        <TouchableOpacity style={tw`flex-1 p-2 items-center`} onPress={() => handlePress('Settings')}>
          <Image source={require('../assets/images/solar_settings-bold.png')} style={tw`w-8 h-8`} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NavBar;
