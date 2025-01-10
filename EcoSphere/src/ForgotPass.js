import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const sendOtpEmail = async () => {
    try {
      const response = await axios.post('http://192.168.56.1:5000/api/send-otp', { email });
      if (response.status === 200) {
        setMessage('OTP sent to your email. Check your inbox.');
        setStep(2);
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Failed to send OTP. Please try again.');
    }
  };

  const resetPassword = async () => {
    try {
      const response = await axios.post('http://192.168.56.1:5000/api/reset_password', {
        resetEmail: email,
        otp,
        newPassword,
      });
      if (response.status === 200) {
        setMessage('Password reset successfully. You can now log in.');
        setStep(1); // Reset step to 1 to show initial form again
        navigation.navigate('Log');
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Failed to reset password.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/mountain_biking.png')}
        style={styles.image}
      />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.loginButton} onPress={sendOtpEmail}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity style={styles.loginButton} onPress={resetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}

      <Text
        style={styles.link}
        onPress={() => navigation.navigate('Login')}
      >
        Back to Login
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
  message: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 12,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 12,
  },
  link: {
    marginTop: 20,
    fontSize: 14,
    color: '#84D49D',
    textDecorationLine: 'underline',
  },
});

export default ForgotPassword;
