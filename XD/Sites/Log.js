import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Log() {
  const [username, setusername] = useState('');
  const [password_hash, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password_hash) {
      Alert.alert('Błąd', 'Wszystkie pola są wymagane.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.56.1:5000/api/users', {
        username: username,
        password_hash: password_hash,
      });

      if (response.data.success) {
        await AsyncStorage.setItem('userToken', response.data.token);
        Alert.alert('Sukces', 'Zalogowano pomyślnie!');
        // Przekierowanie do innego ekranu, np. po zalogowaniu
      } else {
        Alert.alert('Błąd', 'Nieprawidłowy login lub hasło.');
      }
    } catch (error) {
      console.error('Błąd logowania:', error);
      Alert.alert('Błąd', 'Wystąpił błąd podczas logowania.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://example.com/logo.png' }} style={styles.logo} />

      <TextInput
        style={styles.input}
        placeholder="Email lub Nazwa użytkownika"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={text => setusername(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Hasło"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password_hash}
        onChangeText={text => setPassword(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Zaloguj się</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Zapomniałeś hasła?</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.registerText}>Nie masz konta? Zarejestruj się</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#3b5998',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#3b5998',
    marginBottom: 20,
  },
  registerText: {
    color: '#aaa',
    marginTop: 20,
  },
});
