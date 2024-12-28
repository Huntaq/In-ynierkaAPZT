import React, { useEffect, useContext } from 'react';
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
import RegistrationOne from '../src/RegistationOne';
import Events from './Events';
import Friends from './Friends';
import StartStopButton from './test';
import RegistrationTwo from '../src/RegistrationTwo';
import SummaryScreen from './SummaryScreen';
import FriendSearchScreen from './Friends_add';
import Statistics from './statistic';
import Startsite from './Start_site';
import Profile_settings from './Profile_settings';
import Progress from './Progress';

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
      <Stack.Navigator initialRouteName="startsite">
        <Stack.Screen name="ecosphere" component={Startsite} />
        <Stack.Screen
          name="ADD Friends"
          component={FriendSearchScreen}
          options={{
            title: 'EcoSphera',
            headerRight: () => <ProfileImageButton />,
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'EcoSphera',
            headerRight: () => <ProfileImageButton />,
          }}
        />
        <Stack.Screen
          name="SummaryScreen"
          component={SummaryScreen}
          options={{
            title: 'EcoSphera',
            headerRight: () => <ProfileImageButton />,
          }}
        />
        <Stack.Screen
          name="Statistic"
          component={Statistics}
          options={{
            title: 'EcoSphera',
            headerRight: () => <ProfileImageButton />,
          }}
        />
        <Stack.Screen
          name="Log"
          component={Log}
          options={{
            title: 'EcoSphera',
          }}
        />
        <Stack.Screen
          name="Feed"
          component={Feed}
          options={{
            title: 'EcoSphera',
            headerRight: () => <ProfileImageButton />,
          }}
        />
        <Stack.Screen
          name="Details"
          component={SaveRoad}
          options={{
            title: 'EcoSphera',
            headerRight: () => <ProfileImageButton />,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            title: 'EcoSphera',
            headerRight: () => <ProfileHeaderRight />,
          }}
        />
        <Stack.Screen
          name="Profile_settings"
          component={Profile_settings}
          options={{
            title: 'EcoSphera',
          }}
        />
        <Stack.Screen
          name="Events"
          component={Events}
          options={{
            title: 'EcoSphera',
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            title: 'EcoSphera',
            headerRight: () => <ProfileImageButton />,
          }}
        />
        <Stack.Screen
          name="Friends"
          component={Friends}
          options={{
            title: 'EcoSphera',
            headerRight: () => <ProfileImageButton />,
          }}
        />
        <Stack.Screen
          name="RegistrationOne"
          component={RegistrationOne}
          options={{
            title: 'EcoSphera',
          }}
        />
        <Stack.Screen
          name="RegistrationTwo"
          component={RegistrationTwo}
          options={{
            title: 'EcoSphera',
          }}
        />
        <Stack.Screen
          name="Progress"
          component={Progress}
          options={{
            title: 'EcoSphera',
            headerRight: () => <ProfileImageButton />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const ProfileHeaderRight = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerButtonsContainer}>
      
      <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
        <Image
          source={require('../assets/images/solar_users-group-rounded-bold.png')}
          style={styles.secondButton}
        />
      </TouchableOpacity>
    </View>
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
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  secondButton: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  defaultProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
