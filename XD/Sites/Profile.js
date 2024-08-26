import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import NavBar from '../src/Navbar';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://192.168.56.1:5000/api/users')
      .then((response) => {
        // Filter to only include user with id 48
        const user48 = response.data.find(user => user.id === 48);
        setData(user48 ? [user48] : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image
              source={{ uri: item.profilePicture }}
              style={styles.image}
            />
            <Text style={styles.text}>Username: {item.username}</Text>
            <Text style={styles.text}>Age: {item.age}</Text>
            <Text style={styles.text}>Gender: {item.gender}</Text>
            <Text style={styles.text}>Is Banned: {item.is_banned ? 'Yes' : 'No'}</Text>
            <Text style={styles.text}>Email: {item.email}</Text>
            <NavBar/>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default App;
