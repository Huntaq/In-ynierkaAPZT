import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import NavBar from '../src/Navbar';
import tw from 'twrnc';

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
    
    const filteredRoutes = routes.filter(route => {
      const routeDate = new Date(route.date);
      routeDate.setHours(0, 0, 0, 0);
      return routeDate >= startOfWeek && routeDate <= endOfWeek;
    });
    
    const groupedByDay = Array(7).fill(0);
    let total = 0;
    
    filteredRoutes.forEach(route => {
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
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(date.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  };

  const getEndOfWeek = (date) => {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  };

  return (
    <View style={tw`flex-1 bg-green-100 items-center justify-center w-full p-4`}>
      <Text style={tw`text-lg font-bold mb-5`}>Total Distance: {totalDistance.toFixed(2)} km</Text>
      <BarChart
        data={{
          labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
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
          style: { borderRadius: 16 },
        }}
        style={tw`my-4 rounded-lg`}
        fromZero
        showBarTops={false}
        withHorizontalLabels={false}
        withHorizontalLines={false}
      />
      <Text style={tw`text-base mt-4`}>{`${selectedDateRange.start.toDateString()} - ${selectedDateRange.end.toDateString()}`}</Text>
     
        <NavBar />
      
    </View>
  );
};

export default Progress;