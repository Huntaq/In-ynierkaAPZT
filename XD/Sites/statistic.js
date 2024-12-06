import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { format, differenceInDays } from 'date-fns';
import { BarChart } from 'react-native-chart-kit';

const Statistics = () => {
  const [selectedFilter, setSelectedFilter] = useState('month');
  const [markedDates, setMarkedDates] = useState({});
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [summary, setSummary] = useState({ distance: 0, money: 0, co2: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, [selectedFilter]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.56.1:5000/api/user_routes');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        Alert.alert('No Data', 'No routes available for the selected filter.');
        setMarkedDates({});
        setStreak({ current: 0, longest: 0 });
        setSummary({ distance: 0, money: 0, co2: 0 });
        return;
      }

      // Przetwarzanie danych do kalendarza
      const processedDates = processCalendarDates(data);

      // Oblicz streak
      const calculatedStreak = calculateStreak(Object.keys(processedDates));

      // Oblicz sumaryczne wartości
      const calculatedSummary = calculateSummary(data);

      setMarkedDates(processedDates);
      setStreak(calculatedStreak);
      setSummary(calculatedSummary);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      Alert.alert('Error', 'Failed to fetch data from the server. Please try again later.');
    } finally {
      setLoading(false);
    }
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
    if (dates.length === 0) {
      return { current: 0, longest: 0 };
    }

    const sortedDates = dates
      .map((date) => new Date(date))
      .sort((a, b) => a - b); // Sortuj daty rosnąco

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
    if (diffFromToday > 1) {
      currentStreak = 0; // Jeśli brak aktywności w ostatnich dniach, streak resetuje się
    }

    return { current: currentStreak, longest: longestStreak };
  };

  const calculateSummary = (data) => {
    const filteredData = data.filter((route) => {
      const routeDate = new Date(route.date);
      const now = new Date();

      if (selectedFilter === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return routeDate >= oneWeekAgo && routeDate <= now;
      } else if (selectedFilter === 'month') {
        return (
          routeDate.getFullYear() === now.getFullYear() &&
          routeDate.getMonth() === now.getMonth()
        );
      } else if (selectedFilter === 'year') {
        return routeDate.getFullYear() === now.getFullYear();
      }
      return true;
    });

    const totalDistance = filteredData.reduce((sum, route) => sum + route.distance_km, 0);
    const totalMoney = filteredData.reduce((sum, route) => sum + route.money, 0);
    const totalCO2 = filteredData.reduce((sum, route) => sum + route.CO2, 0);

    return {
      distance: totalDistance,
      money: totalMoney,
      co2: totalCO2,
    };
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

      {/* Podsumowanie */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Text>Longest Streak: {streak.longest} days</Text>
        <Text>Current Streak: {streak.current} days</Text>
        <Text>Total Distance: {summary.distance.toFixed(2)} km</Text>
        <Text>Total Money Saved: {summary.money.toFixed(2)} PLN</Text>
        <Text>Total CO2 Saved: {summary.co2.toFixed(2)} kg</Text>
      </View>

      {/* Filtr */}
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
