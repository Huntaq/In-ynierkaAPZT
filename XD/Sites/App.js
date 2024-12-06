import * as React from 'react';
import { useEffect, useContext } from 'react';  
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider, UserContext } from '../src/UserContex'; 




import Feed from './Feed';
import SaveRoad from './SaveRoad';
import Home from './Home';
import Settings from './Settings';
import Profile from './Profile';
import Log from './Log';
import RegistrationForm from '../src/Rejestracja';
import Events from './Events';
import Friends from './Friends';
import StartStopButton from './test';
import FriendSearchScreen from './Friends_add';
import Statistics from './statistic';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};


const AppContent = () => {
  const { setUser } = useContext(UserContext); 

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          console.log('Loaded user from AsyncStorage:', storedUser); 
          setUser(JSON.parse(storedUser));  
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
          name="ADD Friends" 
          component={FriendSearchScreen} 
          options={{
            title: 'Friends',
            headerRight: () => <ProfileImageButton />,
          }} 
        />

        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{
            title: 'Home',
            headerRight: () => <ProfileImageButton />,
          }} 
        />

<Stack.Screen 
          name="Statistic" 
          component={Statistics} 
          options={{
            title: 'Statistic',
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
  const navigation = useNavigation();

  return (
    <UserContext.Consumer>
      {({ user }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          {user && user.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.defaultProfileImage}>
              <Text style={styles.profileInitial}>
                {user ? user.username.charAt(0).toUpperCase() : 'D'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </UserContext.Consumer>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // This makes the image circular
    overflow: 'hidden',
    marginRight: 10,
  },
  defaultProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // Ensures the default profile image is also circular
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
