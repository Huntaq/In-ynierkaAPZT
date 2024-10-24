import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const RegistrationForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  
  const navigation = useNavigation(); // Hook do nawigacji

  // Password validation function
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be at least 8 characters long and contain a lowercase letter, an uppercase letter, a number, and a special character');
      return;
    }

    const userData = {
      username,
      email,
      password,
      gender,
      age,
    };

    try {
      const response = await axios.post('http://192.168.56.1:5000/api/register', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Registration successful');
        
        // Resetowanie formularza
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setGender('');
        setAge('');

        // Przejście do ekranu logowania
        navigation.navigate('Logowanie');
      } else if (response.status === 409) {
        Alert.alert('Error', response.data.message);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter username"
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
      />

      <Text style={styles.label}>Confirm Password:</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm password"
        secureTextEntry
      />

      <Text style={styles.label}>Gender:</Text>
      <Picker
        selectedValue={gender}
        style={styles.input}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="Select Gender" value="" />
        <Picker.Item label="Male" value="M" />
        <Picker.Item label="Female" value="F" />
      </Picker>

      <Text style={styles.label}>Age:</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Enter age"
        keyboardType="numeric"
      />
      
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
});

export default RegistrationForm;
