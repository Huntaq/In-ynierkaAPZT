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
        setStep(1); 
        navigation.navigate('Log');
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Failed to reset password.');
    }
  };

  return (
    <View style={tw`flex-1 justify-start items-center p-4 bg-green-100`}>
      <Image source={require('../assets/images/mountain_biking.png')} style={tw`w-50 h-50 mt-12 mb-5`} />
      {message ? <Text style={tw`text-green-500 text-center mb-3`}>{message}</Text> : null}
      {error ? <Text style={tw`text-red-500 text-center mb-3`}>{error}</Text> : null}
      {step === 1 && (
        <>
          <TextInput
            style={tw`h-12 w-80 border border-green-400 rounded-lg px-3 mb-3 bg-white`}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={tw`bg-green-500 p-4 w-56 rounded-lg items-center`} onPress={sendOtpEmail}>
            <Text style={tw`text-white text-lg font-bold`}>Send OTP</Text>
          </TouchableOpacity>
        </>
      )}
      {step === 2 && (
        <>
          <TextInput
            style={tw`h-12 w-80 border border-green-400 rounded-lg px-3 mb-3 bg-white`}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
          />
          <TextInput
            style={tw`h-12 w-80 border border-green-400 rounded-lg px-3 mb-3 bg-white`}
            placeholder="Enter new password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity style={tw`bg-green-500 p-4 w-56 rounded-lg items-center`} onPress={resetPassword}>
            <Text style={tw`text-white text-lg font-bold`}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
      <Text style={tw`mt-5 text-lg text-green-500 underline`} onPress={() => navigation.navigate('Login')}>
        Back to Login
      </Text>
    </View>
  );
};

export default ForgotPassword;

