import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const NavBar = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState('Home');

  const handlePress = (screen) => {
    setSelected(screen);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      {/* Divider Line */}
      <View style={styles.divider} />
      <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handlePress('Home')}>
          <Image 
            source={require('../assets/images/solar_home-2-bold.png')} 
            style={styles.icon} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handlePress('Feed')}>
          <Image 
            source={require('../assets/images/solar_chat-dots-bold.png')} 
            style={styles.icon} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handlePress('Progress')}>
          <Image 
            source={require('../assets/images/Vector.png')} 
            style={styles.icon} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handlePress('Settings')}>
          <Image 
            source={require('../assets/images/solar_settings-bold.png')} 
            style={styles.icon} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: height * 0.05,
    width: '100%',
    backgroundColor: '#F1FCF3',
  },
  divider: {
    height: 2,
    width: '100%',
    backgroundColor: '#ccc', // Jasnoszara kreska
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default NavBar;
