import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Picker, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { VictoryChart, VictoryBar, VictoryLine, VictoryTheme } from 'victory-native';
import { format } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

const Statistics = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM')); // Selected month
  const [selectedFilter, setSelectedFilter] = useState('month'); // Filter for statistics
  const [streakData, setStreakData] = useState({
    streakDays: ['2024-11-01', '2024-11-02', '2024-11-04'], // Example streak data
    longestStreak: 3,
  });
  const [stats, setStats] = useState({
    distance: { month: 50, week: 10, year: 200 }, // Distance covered
    co2: { month: 20, week: 5, year: 100 }, // CO2 saved
    fuelSavings: { month: 150, week: 35, year: 600 }, // Money saved on fuel
  });

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    // Update streakData and stats here based on the selected month
  };

  const renderCalendar = () => (
    <Calendar
      markedDates={streakData.streakDays.reduce((acc, date) => {
        acc[date] = { marked: true, dotColor: 'green' };
        return acc;
      }, {})}
      onMonthChange={(month) => handleMonthChange(month.dateString.slice(0, 7))}
    />
  );

  const renderStatsGraph = (data, label) => (
    <VictoryChart theme={VictoryTheme.material} width={screenWidth}>
      <VictoryBar data={data} x="label" y="value" />
      <Text style={styles.graphLabel}>{label}</Text>
    </VictoryChart>
  );

  const formatDataForGraph = (data) => {
    const labels =
      selectedFilter === 'month'
        ? Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
        : Object.keys(data);
    return labels.map((label, index) => ({
      label,
      value: data[selectedFilter] / labels.length, // For simplicity, divide values for day/month/year
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Statistics</Text>

      {/* Streak - Calendar */}
      <View>
        <Text style={styles.sectionTitle}>Streak</Text>
        {renderCalendar()}
        <Text>Longest streak: {streakData.longestStreak} days</Text>
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

      {/* Statistics */}
      <View>
        <Text style={styles.sectionTitle}>Statistics</Text>
        {renderStatsGraph(formatDataForGraph(stats.distance), 'Distance Covered (km)')}
        {renderStatsGraph(formatDataForGraph(stats.co2), 'CO2 Saved (kg)')}
        {renderStatsGraph(formatDataForGraph(stats.fuelSavings), 'Fuel Savings (PLN)')}
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
  graphLabel: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  picker: {
    flex: 1,
    height: 50,
  },
});

export default Statistics;
