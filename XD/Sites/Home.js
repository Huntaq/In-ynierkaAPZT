import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavBar from '../src/Navbar';
import CustomMap from '../src/CustomMaps';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
        <CustomMap/>
        <NavBar/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default HomeScreen;