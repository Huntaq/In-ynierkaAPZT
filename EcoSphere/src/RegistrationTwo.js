import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';

const RegistrationTwo = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [emailNotification, setEmailNotification] = useState(false);
  const [pushNotification, setPushNotification] = useState(false);
  const [agreeToParticipate, setAgreeToParticipate] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  const { username, email, password } = route.params;

  const handleRegister = async () => {
    if (!agreeToParticipate) {
      Alert.alert('Error', 'You must agree to participate');
      return;
    }

    const userData = {
      username,
      email,
      password,
      age,
      gender,
      emailNotification: emailNotification ? 1 : 0,
      pushNotification: pushNotification ? 1 : 0,
    };

    try {
      const response = await axios.post('http://192.168.56.1:5000/api/register', userData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'User registered successfully');
        navigation.navigate('Log');
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'Registration failed');
      } else {
        Alert.alert('Error', 'Unable to connect to the server');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Additional Information</Text>

      <View style={styles.rowContainer}>
        <TextInput
          style={[styles.input, styles.ageInput]}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <TextInput
          style={[styles.input, styles.genderPicker]}
          placeholder="Gender (M/F)"
          value={gender}
          onChangeText={setGender}
        />
      </View>

      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxRow}>
          <CheckBox
            value={emailNotification}
            onValueChange={setEmailNotification}
          />
          <Text style={styles.checkboxLabel}>Notification by email</Text>
        </View>

        <View style={styles.checkboxRow}>
          <CheckBox
            value={pushNotification}
            onValueChange={setPushNotification}
          />
          <Text style={styles.checkboxLabel}>Push notification</Text>
        </View>

        <View style={styles.checkboxRow}>
          <CheckBox
            value={agreeToParticipate}
            onValueChange={setAgreeToParticipate}
          />
          <Text style={styles.checkboxLabel}>I agree to participate in rankings and statistics based on the provided data.</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1FCF3',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  ageInput: {
    flex: 1,
    marginRight: 10,
  },
  pickerContainer: {
    flex: 1,
  },
  checkboxContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  registerButton: {
    backgroundColor: '#84D49D',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegistrationTwo;
