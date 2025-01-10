import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Modal, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { format, differenceInDays, isSameWeek, isSameMonth, isSameYear } from 'date-fns';
import NavBar from '../src/Navbar';

const Statistics = () => {
  const [selectedFilter, setSelectedFilter] = useState('month');
  const [markedDates, setMarkedDates] = useState({});
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [summary, setSummary] = useState({ distance: 0, money: 0, co2: 0 });
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]); // Default to an empty array
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dailyActivities, setDailyActivities] = useState([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    filterSummary(); // Apply filter only for summary
  }, [selectedFilter, activities]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.56.1:5000/api/user_routes');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data || data.length === 0) {
        Alert.alert('No Data', 'No routes available.');
        resetStatistics();
        return;
      }
      setActivities(Array.isArray(data) ? data : []); // Ensure activities is an array
    } catch (error) {
      console.error('Error fetching statistics:', error);
      Alert.alert('Error', 'Failed to fetch data from the server. Please try again later.');
      resetStatistics();
    } finally {
      setLoading(false);
    }
  };

  const resetStatistics = () => {
    setMarkedDates({});
    setStreak({ current: 0, longest: 0 });
    setSummary({ distance: 0, money: 0, co2: 0 });
    setActivities([]); // Reset activities to an empty array
  };

  const filterSummary = () => {
    const now = new Date();

    // Filter the activities only for the summary calculation
    const filtered = (activities || []).filter((activity) => {
      const activityDate = new Date(activity.date);
      if (selectedFilter === 'week') return isSameWeek(activityDate, now);
      if (selectedFilter === 'month') return isSameMonth(activityDate, now);
      if (selectedFilter === 'year') return isSameYear(activityDate, now);
      return true;
    });

    updateStatistics(filtered); // Update the statistics with filtered data
  };

  const updateStatistics = (filtered) => {
    const processedDates = processCalendarDates(filtered);
    const calculatedSummary = calculateSummary(filtered);
    const calculatedStreak = calculateStreak(Object.keys(processedDates));

    setMarkedDates(processedDates); // Update the marked dates for calendar
    setSummary(calculatedSummary); // Update summary with filtered data
    setStreak(calculatedStreak); // Update streak calculation with filtered data
  };

  const processCalendarDates = (data) => {
    const dates = {};
    data.forEach((route) => {
      if (route.date) {
        const formattedDate = format(new Date(route.date), 'yyyy-MM-dd');
        dates[formattedDate] = { marked: true, dotColor: 'green' };
      }
    });
    return dates;
  };

  const calculateStreak = (dates) => {
    if (dates.length === 0) return { current: 0, longest: 0 };
    const sortedDates = dates.map((date) => new Date(date)).sort((a, b) => a - b);

    let longestStreak = 1;
    let currentStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const diff = differenceInDays(sortedDates[i], sortedDates[i - 1]);
      if (diff === 1) {
        currentStreak += 1;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    const lastDate = sortedDates[sortedDates.length - 1];
    const diffFromToday = differenceInDays(new Date(), lastDate);
    if (diffFromToday > 1) currentStreak = 0;

    return { current: currentStreak, longest: longestStreak };
  };

  const calculateSummary = (data) => {
    const totalDistance = data.reduce((sum, route) => sum + route.distance_km, 0);
    const totalMoney = data.reduce((sum, route) => sum + route.money, 0);
    const totalCO2 = data.reduce((sum, route) => sum + route.CO2, 0);
    return { distance: totalDistance, money: totalMoney, co2: totalCO2 };
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    const filteredActivities = activities.filter((activity) => {
      const activityDate = format(new Date(activity.date), 'yyyy-MM-dd');
      return activityDate === day.dateString;
    });
    setDailyActivities(filteredActivities);
    setModalVisible(true);
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

      {/* Filter for summary */}
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

      {/* Calendar */}
      <View>
        <Text style={styles.sectionTitle}>Your Routes</Text>
        <Calendar markedDates={markedDates} onDayPress={handleDayPress} />
      </View>

      {/* Modal Details */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Activities for {selectedDate}</Text>
          <ScrollView>
            {dailyActivities.map((activity, index) => (
              <View key={index} style={styles.activityContainer}>
                <Text>Distance: {activity.distance_km} km</Text>
                <Text>Money Saved: {activity.money} PLN</Text>
                <Text>CO2 Saved: {activity.CO2} kg</Text>
                <Text>Duration: {activity.duration}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Text>Longest Streak: {streak.longest} days</Text>
        <Text>Current Streak: {streak.current} days</Text>
        <Text>Total Distance: {summary.distance.toFixed(2)} km</Text>
        <Text>Total Money Saved: {summary.money.toFixed(2)} PLN</Text>
        <Text>Total CO2 Saved: {summary.co2.toFixed(2)} g</Text>
      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F1FCF3',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  activityContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Statistics;
