import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../src/UserContex';  

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext); 
  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://192.168.56.1:5000/api/login', {
        username,
        password,
      });

      if (response.status === 200) {
        const userData = response.data.user;  // Zakładam, że serwer zwraca dane użytkownika
        console.log('Logged in user data:', userData);  // Loguj dane użytkownika do konsoli
        setUser(userData);  // Ustaw dane użytkownika w kontekście
        navigation.navigate('Home');  // Przekieruj na ekran główny
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Registration');  // Nawigacja do ekranu rejestracji
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      
      <Text style={styles.registerText}>Don't have an account?</Text>
      <Button title="Go to Register" onPress={() => navigation.navigate('RegistrationForm')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  registerText: {
    textAlign: 'center',
    marginVertical: 12,
  },
});


export default LoginScreen;
