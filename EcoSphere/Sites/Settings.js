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
import tw from 'twrnc';


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
    <View style={tw`w-4/5 my-2 ml-8`}>
      <TouchableOpacity style={tw`bg-green-100 p-4 rounded-lg`} onPress={toggleFAQ}>
        <Text style={tw`text-xl font-bold text-black`}>FAQ</Text>
      </TouchableOpacity>
      {isExpanded &&
        questions.map((item, index) => (
          <TouchableOpacity key={index} style={tw`bg-green-100 p-4 rounded-lg my-2`} onPress={() => handleQuestionPress(item.answer)}>
            <Text style={tw`text-lg text-black`}>{item.question}</Text>
          </TouchableOpacity>
        ))}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`bg-white p-5 rounded-lg w-4/5 max-h-4/5`}>
            <ScrollView>
              <Text style={tw`text-lg mb-2`}>{selectedQuestion}</Text>
            </ScrollView>
            <TouchableOpacity style={tw`bg-red-500 p-3 rounded-lg mt-3`} onPress={() => setModalVisible(false)}>
              <Text style={tw`text-white text-lg font-bold text-center`}>Zamknij</Text>
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
    <View style={tw`flex-1 bg-green-100 p-4`}>
      <TouchableOpacity style={tw`bg-green-100 rounded-lg p-4 my-2 w-11/12 self-center`} onPress={() => navigation.navigate('Profile_settings')}>
        <Text style={tw`text-xl font-bold text-black`}>Account</Text>
      </TouchableOpacity>
      <View style={tw`w-11/12 h-px bg-gray-400 self-center my-2`} />
      <TouchableOpacity style={tw`bg-green-100 rounded-lg p-4 my-2 w-11/12 self-center`} onPress={() => navigation.navigate('Statistic')}>
        <Text style={tw`text-xl font-bold text-black`}>Statistic</Text>
      </TouchableOpacity>
      <View style={tw`w-11/12 h-px bg-gray-400 self-center my-2`} />
      <FAQ />
      <NavBar />
    </View>
  );
};

export default Settings;
