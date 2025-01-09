import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://192.168.56.1:5000/api/forgot-password', { email });

      if (response.status === 200) {
        Alert.alert('Success', 'Password reset link has been sent to your email.');
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send password reset email. Please try again.');
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
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#84D49D" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleForgotPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      )}

      <Text
        style={styles.registerText}
        onPress={() => navigation.navigate('Login')}
      >
        Remember your password? Login here!
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

export default ForgotPasswordScreen;
