import React, { useState } from 'react';

import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');
const NavBar = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState('Home'); // Default selected button

  const handlePress = (screen) => {
    setSelected(screen);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => handlePress('Home')}>
        <Image 
          source={require('../assets/images/solar_home-2-bold.png')} // Static image for Home
          style={styles.icon} 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => handlePress('Feed')}>
        <Image 
          source={require('../assets/images/solar_chat-dots-bold.png')} // Static image for Feed
          style={styles.icon} 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => handlePress('Progress')}>
        <Image 
          source={require('../assets/images/Vector.png')} // Static image for Progress
          style={styles.icon} 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => handlePress('Settings')}>
        <Image 
          source={require('../assets/images/solar_settings-bold.png')} // Static image for Settings
          style={styles.icon} 
        />
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: height*0.05,
    width: '100%',
    backgroundColor: '#F1FCF3',
    position: 'absolute',
    bottom: 0,
  },
  header: {
    height: 20,
    width: '100%',
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
  icon: {
    width: 30, // Adjust the size of the image
    height: 30,
    resizeMode: 'contain',
  },

});

export default NavBar;
