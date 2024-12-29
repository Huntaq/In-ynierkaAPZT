import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sendOtpEmail = async () => {
    try {
      const response = await axios.post('http://192.168.1.6:5000/api/send-otp', { email });

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
      const response = await axios.post('http://192.168.1.6:5000/api/reset_password', {
        email,
        otp,
        newPassword,
      });

      if (response.status === 200) {
        setMessage('Password reset successfully. You can now log in.');
        navigation.navigate('Logowanie');
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Failed to reset password.');
    }
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />
          <Button title="Send OTP" onPress={sendOtpEmail} />
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
          <Button title="Reset Password" onPress={resetPassword} />
        </>
      )}

      {message ? <Text style={styles.message}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Back to Login" onPress={() => navigation.navigate('Logowanie')} />
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
});

export default ForgotPassword;
