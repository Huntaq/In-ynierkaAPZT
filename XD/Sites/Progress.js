import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import NavBar from '../src/Navbar';

const Progress = () => {
  const [data, setData] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState({ start: new Date(), end: new Date() });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.56.1:5000/api/user_routes');
        const result = await response.json();
        processAndSetData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const processAndSetData = (routes) => {
    const startOfWeek = getStartOfWeek(new Date());
    const endOfWeek = getEndOfWeek(new Date());
    setSelectedDateRange({ start: startOfWeek, end: endOfWeek });

    const filteredRoutes = routes.filter((route) => {
      const routeDate = new Date(route.date);
      return routeDate >= startOfWeek && routeDate <= endOfWeek;
    });

    const groupedByDay = Array(7).fill(0); // Initialize array for 7 days
    let total = 0;

    filteredRoutes.forEach((route) => {
      const routeDate = new Date(route.date);
      const dayIndex = routeDate.getDay();
      groupedByDay[dayIndex] += route.distance_km;
      total += route.distance_km;
    });

    setTotalDistance(total);
    setData(groupedByDay);
  };

  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday as start
    return new Date(date.setDate(diff));
  };

  const getEndOfWeek = (date) => {
    const startOfWeek = getStartOfWeek(date);
    return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
  };

  const renderChart = () => {
    return (
      <BarChart
        data={{
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{ data }],
        }}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(110, 155, 123, ${opacity})`,
          barPercentage: 0.5,
          fillShadowGradient: '#6e9b7b',
          fillShadowGradientOpacity: 1,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        fromZero={true}
        showBarTops={false}
        withHorizontalLabels={false}
        withHorizontalLines={false}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.totalText}>Total Distance: {totalDistance.toFixed(2)} km</Text>
      <View style={styles.chartContainer}>{renderChart()}</View>
      <Text style={styles.dateRangeText}>
        {`${selectedDateRange.start.toDateString()} - ${selectedDateRange.end.toDateString()}`}
      </Text>
      <NavBar/>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1FCF3',
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20, // Increased margin to separate from the chart
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 60, // Push the chart upwards by creating space below it
  },
  dateRangeText: {
    fontSize: 16,
    marginTop: 20, // Space above date text
    textAlign: 'center',
  },
});


export default Progress;
