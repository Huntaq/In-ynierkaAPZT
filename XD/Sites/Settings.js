import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import NavBar from '../src/Navbar';


const Settings = () => {
  const showAlert = () => {
    Alert.alert(
      "Przepis na chlebek bananowy",
      `Składniki:
      - 3 dojrzałe banany
      - 1/2 szklanki roztopionego masła
      - 1 szklanka cukru
      - 1 jajko
      - 1 łyżeczka ekstraktu waniliowego
      - 1 1/2 szklanki mąki pszennej
      - 1 łyżeczka proszku do pieczenia
      - 1/4 łyżeczki soli
      
      Opcjonalnie:
      - 1/2 szklanki posiekanych orzechów włoskich lub pekanów
      - 1/2 szklanki czekolady
      
      Instrukcje:
      1. Rozgrzej piekarnik do 175°C (350°F). Wysmaruj formę do pieczenia lub wyłóż ją papierem do pieczenia.
      2. Zgnieć banany widelcem.
      3. Dodaj roztopione masło do bananów i wymieszaj.
      4. Dodaj cukier, jajko i ekstrakt waniliowy. Wymieszaj.
      5. W osobnej misce wymieszaj mąkę, proszek do pieczenia i sól. Dodaj do mokrych składników i wymieszaj.
      6. Dodaj opcjonalne składniki, jeśli używasz.
      7. Wlej ciasto do formy i piecz przez 60-70 minut, aż patyczek wyjdzie suchy.
      8. Ostudź przed podaniem.`
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

export default Settings;
