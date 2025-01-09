import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


function Nagłowek() {
  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>Tu bedzie nazwa naszej apki</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#000', 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: '#fff', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
  },
  greetingText: {
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#fff', 
    padding: 5, 
    borderWidth: 1, 
    borderColor: '#fff', 
    borderRadius: 5, 
  },
});

export default Nagłowek;
