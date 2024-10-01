import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NavBarPro = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Friends')}>
        <Text style={styles.buttonText}>Friends</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Events')}>
        <Text style={styles.buttonText}>Feed</Text>
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

export default NavBarPro;
