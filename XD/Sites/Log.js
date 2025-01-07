import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../src/UserContex';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://192.168.56.1:5000/api/login', { username, password });

      if (response.status === 200) {
        const userData = response.data.user;
        console.log('Logged in user data:', userData);
        setUser(userData);
        navigation.navigate('Home');
      }
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;
        if (error.response.status === 403) {
          Alert.alert('Login Error', message);
        } else if (error.response.status === 401) {
          Alert.alert('Login Error', message);
        } else {
          Alert.alert('Login Error', 'An unexpected error occurred.');
        }
      } else {
        Alert.alert('Login Error', 'Unable to connect to the server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/mountain_biking.png')}
        style={styles.image}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#84D49D" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      <Text
        style={styles.registerText}
        onPress={() => navigation.navigate('RegistrationOne')}
      >
        Don’t have an account? Sign up!
      </Text>
      <Text style={styles.link} onPress={() => navigation.navigate('ForgotPassword')}>
          Forgot Password?
        </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F1FCF3',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 50,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: 300,
    borderColor: '#84D49D',
    borderWidth: 1,
    borderRadius: 8, 
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  loginButton: {
    height: 50,
    width: 232,
    borderWidth: 1,
    borderColor: '#84D49D',
    backgroundColor: '#84D49D',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 10,
  },
  registerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#84D49D',
    textDecorationLine: 'underline', 
  },
});

export default LoginScreen;
