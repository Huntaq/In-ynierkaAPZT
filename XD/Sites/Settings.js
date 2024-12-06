import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { Picker } from '@react-native-picker/picker';

const screenWidth = Dimensions.get('window').width;

const Statistics = () => {
  const [selectedFilter, setSelectedFilter] = useState('month');
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      const response = await fetch('/api/user_routes');
      if (!response.ok) {
        throw new Error('Failed to fetch user routes');
      }
      const data = await response.json();

      // Przetwarzanie danych do kalendarza
      const processedDates = processCalendarDates(data);
      setMarkedDates(processedDates);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      setLoading(false);
    }
  };

  const processCalendarDates = (data) => {
    const dates = {};
    data.forEach((route) => {
      dates[route.date] = { marked: true, dotColor: 'green' }; // Oznaczenie dni
    });
    return dates;
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Statistics</Text>

      {/* Kalendarz z oznaczeniami */}
      <View>
        <Text style={styles.sectionTitle}>Your Routes</Text>
        <Calendar
          markedDates={markedDates}
          onMonthChange={(month) => {
            console.log('Month changed to:', month.dateString);
          }}
        />
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <Text>Filter:</Text>
        <Picker
          selectedValue={selectedFilter}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedFilter(itemValue)}
        >
          <Picker.Item label="Week" value="week" />
          <Picker.Item label="Month" value="month" />
          <Picker.Item label="Year" value="year" />
        </Picker>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  picker: {
    flex: 1,
    height: 50,
    marginLeft: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Statistics;
