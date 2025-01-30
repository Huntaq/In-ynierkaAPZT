import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Modal, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { format, differenceInDays, isSameWeek, isSameMonth, isSameYear } from 'date-fns';
import NavBar from '../src/Navbar';
import tw from 'twrnc';

const Statistics = () => {
  const [selectedFilter, setSelectedFilter] = useState('month');
  const [markedDates, setMarkedDates] = useState({});
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [summary, setSummary] = useState({ distance: 0, money: 0, co2: 0 });
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]); 
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dailyActivities, setDailyActivities] = useState([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    filterSummary(); 
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
      setActivities(Array.isArray(data) ? data : []); 
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
    setActivities([]); 
  };

  const filterSummary = () => {
    const now = new Date();

    
    const filtered = (activities || []).filter((activity) => {
      const activityDate = new Date(activity.date);
      if (selectedFilter === 'week') return isSameWeek(activityDate, now);
      if (selectedFilter === 'month') return isSameMonth(activityDate, now);
      if (selectedFilter === 'year') return isSameYear(activityDate, now);
      return true;
    });

    updateStatistics(filtered); 
  };

  const updateStatistics = (filtered) => {
    const processedDates = processCalendarDates(filtered);
    const calculatedSummary = calculateSummary(filtered);
    const calculatedStreak = calculateStreak(Object.keys(processedDates));

    setMarkedDates(processedDates); 
    setSummary(calculatedSummary); 
    setStreak(calculatedStreak); 
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
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  return (
    <ScrollView style={tw`flex-1 p-4 bg-green-100`}>
      <Text style={tw`text-2xl font-bold text-center mb-5`}>Statistics</Text>
      <View style={tw`mb-4`}>
        <Text>Filter:</Text>
        <Picker selectedValue={selectedFilter} onValueChange={(itemValue) => setSelectedFilter(itemValue)}>
          <Picker.Item label="Week" value="week" />
          <Picker.Item label="Month" value="month" />
          <Picker.Item label="Year" value="year" />
        </Picker>
      </View>
      <Text style={tw`text-xl font-bold mb-3`}>Your Routes</Text>
      <Calendar markedDates={markedDates} onDayPress={handleDayPress} />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`bg-white p-5 rounded-lg w-4/5 max-h-4/5`}>
            <Text style={tw`text-lg font-bold mb-4`}>Activities for {selectedDate}</Text>
            <ScrollView>
              {dailyActivities.map((activity, index) => (
                <View key={index} style={tw`mb-2 p-3 bg-gray-100 rounded-lg`}>
                  <Text>Distance: {activity.distance_km} km</Text>
                  <Text>Money Saved: {activity.money} PLN</Text>
                  <Text>CO2 Saved: {activity.CO2} kg</Text>
                  <Text>Duration: {activity.duration}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={tw`bg-red-500 p-3 rounded-lg mt-3`} onPress={() => setModalVisible(false)}>
              <Text style={tw`text-white text-lg font-bold text-center`}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={tw`mt-6 p-4 bg-white rounded-lg shadow-lg`}>
        <Text style={tw`text-xl font-bold mb-2`}>Summary</Text>
        <Text>Longest Streak: {streak.longest} days</Text>
        <Text>Current Streak: {streak.current} days</Text>
        <Text>Total Distance: {summary.distance.toFixed(2)} km</Text>
        <Text>Total Money Saved: {summary.money.toFixed(2)} PLN</Text>
        <Text>Total CO2 Saved: {summary.co2.toFixed(2)} g</Text>
      </View>
    </ScrollView>
  );
};

export default Statistics;

