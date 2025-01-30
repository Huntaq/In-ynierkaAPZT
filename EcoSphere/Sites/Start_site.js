import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

const Startsite = () => {
  const navigation = useNavigation(); 

  return (
    <View style={tw`flex-1 items-center justify-start bg-green-100 p-4`}>
      <Image
        source={require('../assets/images/mountain_biking.png')} 
        style={tw`w-50 h-50 mt-12 mb-12`}
      />
      <Text style={tw`text-2xl font-semibold text-center mt-6 mb-6 text-gray-800`}>
        Choose sustainable travel
      </Text>

      <TouchableOpacity
        style={tw`w-58 h-12 border border-green-400 bg-green-100 rounded-xl mt-5 mb-5 flex items-center justify-center`}
        onPress={() => navigation.navigate('Log')}
      >
        <Text style={tw`text-green-500 text-lg`}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`w-58 h-12 bg-green-400 rounded-xl mt-6 flex items-center justify-center`}
        onPress={() => navigation.navigate('RegistrationOne')}
      >
        <Text style={tw`text-white text-lg`}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Startsite;
