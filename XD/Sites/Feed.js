import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import AddPost from '../src/add_post';

const PostsList = ({ user_id }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://192.168.56.1:5000/api/posts', { withCredentials: true });

        console.log('Response:', response.data); // Loguj odpowiedź
        setPosts(response.data);
      } catch (err) {
        console.error('Fetch posts error:', err); // Loguj dokładny błąd
        setError('Błąd podczas pobierania postów');
      } finally {
        setLoading(false);
      }
    };
  
    fetchPosts();
  }, [user_id]);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.post}>
              <Text>Route ID: {item.route_id}</Text>
              <Text>Content: {item.content}</Text>
              
            </View>
          )}
        />
      )}
      <AddPost/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  post: {
    marginBottom: 20,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
  },
});

export default PostsList;
