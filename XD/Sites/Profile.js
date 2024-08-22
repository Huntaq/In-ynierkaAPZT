import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import NavBar from '../src/Navbar';


const Profile = () => {
  const showAlert = () => {
    Alert.alert(
      "Tytuł",
      "Treść Twojego komunikatu",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") },
        { text: "Anuluj", onPress: () => console.log("Cancel Pressed"), style: "cancel" }
      ],
      { cancelable: false } // Ustawienie na true pozwala na zamknięcie dialogu przez kliknięcie poza nim
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Pokaż Popup" onPress={showAlert} />
      <NavBar/>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;
