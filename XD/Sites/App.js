import * as React from 'react';
import { useEffect, useContext } from 'react';  
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider, UserContext } from '../src/UserContex';  // Zakładam poprawny plik: UserContext

// Importy ekranów
import Feed from './Feed';
import SaveRoad from './SaveRoad';
import Home from './Home';
import Settings from './Settings';
import Profile from './Profile';
import Log from './Log';
import RegistrationForm from '../src/Rejestracja';
import Events from './Events';
import Friends from './Friends';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

// Wyodrębnienie logiki do osobnego komponentu
const AppContent = () => {
  const { setUser } = useContext(UserContext);  // Pobierz funkcję setUser z kontekstu

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          console.log('Loaded user from AsyncStorage:', storedUser);  // Loguj dane użytkownika z AsyncStorage
          setUser(JSON.parse(storedUser));  // Ustaw dane użytkownika w kontekście
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Logowanie">
        <Stack.Screen name="Logowanie" component={Log} />
        
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{
            title: 'Home',
            headerRight: () => <ProfileImageButton />,
          }} 
        />
        
        <Stack.Screen 
          name="Feed" 
          component={Feed} 
          options={{
            title: 'Feed',
            headerRight: () => <ProfileImageButton />,
          }} 
        />
        
        <Stack.Screen 
          name="Details" 
          component={SaveRoad} 
          options={{
            title: 'Details',
            headerRight: () => <ProfileImageButton />,
          }} 
        />
        
        <Stack.Screen 
          name="Profile" 
          component={Profile}
          options={{
            title: 'Profile',
          }}
        />
        <Stack.Screen 
          name="Events" 
          component={Events}
          options={{
            title: 'Events',
          }}
        />
        
        <Stack.Screen 
          name="Settings" 
          component={Settings} 
          options={{
            title: 'Settings',
            headerRight: () => <ProfileImageButton />,
          }}
        />
        <Stack.Screen 
          name="Friends" 
          component={Friends} 
          options={{
            title: 'Friends',
            headerRight: () => <ProfileImageButton />,
          }}
        />
        
        <Stack.Screen 
          name="RegistrationForm" 
          component={RegistrationForm} 
          options={{
            title: 'RegistrationForm'
           
          }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const ProfileImageButton = () => {
  const navigation = useNavigation(); // Używamy nawigacji

  return (
    <UserContext.Consumer>
      {({ user }) => (
        user && user.profilePicture ? (
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        ) : null
      )}
    </UserContext.Consumer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default App;
