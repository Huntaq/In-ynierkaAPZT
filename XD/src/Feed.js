import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';

const Feed = () => {
  const showAlert = () => {
    Alert.alert(
      "Tytuł",
      "Treść Twojego komunikatu",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") },
        { text: "Anuluj", onPress: () => console.log("Cancel Pressed"), style: "cancel" }
      ],
      { cancelable: false } 
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Pokaż Popup" onPress={showAlert} />
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

export default Feed;
