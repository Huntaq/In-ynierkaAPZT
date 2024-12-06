import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NavBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Feed')}>
        <Text style={styles.buttonText}>Feed</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Statistic')}>
        <Text style={styles.buttonText}>Statistic</Text>
      </TouchableOpacity>
      
     
    </View>
  );
};

const styles = StyleSheet.create({
  
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 40,
    width: '100%',
    backgroundColor: '#ccc',
    position: 'absolute',
    bottom: 0,
  },
  header: {
    height: 60,
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
});

export default NavBar;
