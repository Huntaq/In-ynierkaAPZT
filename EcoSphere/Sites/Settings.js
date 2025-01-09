import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NavBar from '../src/Navbar';

const FAQ = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const questions = [
    {
      question: 'Jak zrobić chlebek bananowy?',
      answer: `Składniki:
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
      8. Ostudź przed podaniem.`,
    },
  ];

  const toggleFAQ = () => {
    setIsExpanded(!isExpanded);
  };

  const handleQuestionPress = (answer) => {
    setSelectedQuestion(answer);
    setModalVisible(true);
  };

  return (
    <View style={styles.faqContainer}>
      <TouchableOpacity style={styles.faqHeader} onPress={toggleFAQ}>
        <Text style={styles.faqTitle}>FAQ</Text>
      </TouchableOpacity>

      {isExpanded &&
        questions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqItem}
            onPress={() => handleQuestionPress(item.answer)}
          >
            <Text style={styles.faqQuestion}>{item.question}</Text>
          </TouchableOpacity>
        ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalText}>{selectedQuestion}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Zamknij</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Settings = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.accountButton}
        onPress={() => navigation.navigate('Profile_settings')}
      >
        <Text style={styles.AccountTitle}>Account</Text>
      </TouchableOpacity>

      <View style={styles.separator} />
      <FAQ />
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#F1FCF3',
  },
  separator: {
    width: '90%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
    alignSelf: 'center',
  },
  faqContainer: {
    width: '90%',
    marginVertical: 10,
  },
  faqHeader: {
    backgroundColor: '#F1FCF3',
    padding: 15,
    borderRadius: 10,
  },
  faqTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
  },
  faqItem: {
    backgroundColor: '#F1FCF3',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  accountButton: {
    backgroundColor: '#F1FCF3',
    borderRadius: 10,
    marginVertical: 5,
    width: '90%',
    alignSelf: 'center',
  },
  AccountTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#FF6347',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Settings;
