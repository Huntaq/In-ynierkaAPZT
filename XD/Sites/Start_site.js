import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Startsite = () => {
  const navigation = useNavigation(); 

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/mountain_biking.png')} 
        style={styles.image}
      />
      <Text style={styles.text}>Choose sustainable travel</Text>


      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Log')}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('RegistrationOne')}
      >
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F1FCF3', 
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 50,
    marginBottom:50. 
  },
  text: {
    fontSize: 24,
    fontFamily: 'MavenPro_400Regular',
    textAlign: 'center',
    marginTop: 25,
    marginBottom:25. 
  },
  registerButton: {
    height:50,
    width:232,
    backgroundColor: '#84D49D',
    paddingVertical: 10,
    borderRadius:16,
    marginTop: 25,
    marginBottom:25,
    paddingHorizontal: 20,
    
    
    marginBottom: 20, // Większy odstęp między przyciskami
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  loginButton: {
    height:50,
    width:232,
    borderWidth: 1,
    borderColor: '#84D49D',
    backgroundColor: '#F1FCF3f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius:16,
    marginTop:20,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#84D49D',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Startsite;
