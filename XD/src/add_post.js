import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const AddPost = ({ user_id }) => {
  const [route_id, setRouteId] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (!user_id || route_id.trim() === '' || content.trim() === '') {
      Alert.alert('Błąd', 'Proszę wypełnić wszystkie pola.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.56.1:5000/api/posts', {
        user_id,
        route_id,
        content
      });

      if (response.status === 200) {
        Alert.alert('Sukces', 'Post został dodany');
        setRouteId('');
        setContent('');
      }
    } catch (error) {
      console.error('Błąd podczas dodawania postu:', error);
      Alert.alert('Błąd', 'Wystąpił problem podczas dodawania postu');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Route ID"
        value={route_id}
        onChangeText={setRouteId}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.textarea}
        placeholder="Treść postu"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title="Dodaj post" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  textarea: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlignVertical: 'top', // Wyrównanie tekstu do góry
  },
});

export default AddPost;
