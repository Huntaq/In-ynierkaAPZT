import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Komponent Nagłowek
function Nagłowek() {
  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>Tu bedzie nazwa naszej apki</Text>
    </View>
  );
}

// Stylizacja komponentów
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50, // Zmniejsz wysokość nagłówka
    flexDirection: 'row', // Ustaw flexDirection na row, aby umieścić tekst poziomo
    justifyContent: 'center', // Wyśrodkowanie tekstu w poziomie
    alignItems: 'center', // Wyśrodkowanie tekstu w pionie
    backgroundColor: '#000', // Kolor tła nagłówka
    borderRadius: 10, // Zaokrąglenie rogów
    borderWidth: 2, // Grubość obramówki
    borderColor: '#fff', // Kolor obramówki
    paddingHorizontal: 10, // Padding w poziomie
    paddingVertical: 5, // Padding w pionie
  },
  greetingText: {
    fontSize: 16, // Zmniejsz rozmiar czcionki
    fontWeight: 'bold',
    color: '#fff', // Kolor tekstu
    padding: 5, // Padding wewnętrzny
    borderWidth: 1, // Grubość obramówki tekstu
    borderColor: '#fff', // Kolor obramówki tekstu
    borderRadius: 5, // Zaokrąglenie rogów obramówki tekstu
  },
});

export default Nagłowek;
