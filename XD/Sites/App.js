import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from '../src/UserContex'; 

const Stack = createNativeStackNavigator();

import Feed from './Feed';
import SaveRoad from './SaveRoad';
import Home from './Home';
import Settings from './Settings';
import Profile from './Profile';
import Log from './Log';

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Logowanie">
          <Stack.Screen name="Logowanie" component={Log} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Feed" component={Feed} />
          <Stack.Screen name="Details" component={SaveRoad} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
