import React from 'react';
import { View, Text, Button,  StyleSheet } from 'react-native';

//const SaveRoad = ({ route }) => {
  //const { routeCoordinates, distanceTravelled, timeElapsed, formattedTime, distance } = route.params;

 // return (
   // <View style={styles.container}>
     // <Text>Route Coordinates: {JSON.stringify(routeCoordinates)}</Text>
     // <Text>Distance Travelled: {distanceTravelled} km</Text>
      //<Text>Time Elapsed: {formattedTime}</Text>
      //<Text>Total Distance: {distance} km</Text>
    //</View>
  //);
//};
 function SaveRoad({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SaveRoad;
