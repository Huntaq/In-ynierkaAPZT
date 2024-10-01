import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleRegister = () => {
    // Sprawdzenie, czy wszystkie pola zostały wypełnione
    if (!username || !password || !email || !age || !gender) {
      return Alert.alert('Error', 'All fields are required');
    }

    // Sprawdzenie, czy wiek jest liczbą
    if (isNaN(age)) {
      return Alert.alert('Error', 'Age must be a number');
    }

    // Tworzenie ciała zapytania
    const data = {
      username,
      password,
      email,
      age,
      gender,
    };

    // Wysyłanie zapytania do backendu
    fetch('http://192.168.56.1:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message === 'User registered successfully') {
          Alert.alert('Success', 'Registration successful!');
          
          // Zresetowanie formularza
          setUsername('');
          setPassword('');
          setEmail('');
          setAge('');
          setGender('');
        } else {
          Alert.alert('Error', json.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      });
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
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />
      <Button title="Register" onPress={handleRegister} />
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
});

export default Register;
