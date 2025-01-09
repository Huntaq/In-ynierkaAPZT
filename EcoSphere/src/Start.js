import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


function Start() {
  const [selected, setSelected] = useState(null);
  const [isCounting, setIsCounting] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval = null;

    if (isCounting) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1); 
      }, 1000);
    } else if (!isCounting && time !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval); 
  }, [isCounting]);

  const handlePress = (option) => {
    setSelected(option);
    console.log(`${option} pressed`);
  };

  const handleStartPress = () => {
    setIsCounting(true);
    console.log('Start pressed');
  };

  const handleStopPress = () => {
    setIsCounting(false);
    console.log('Stop pressed');
  };

  const handleSavePress = () => {
    setIsCounting(false);
    setTime(0);
    console.log('Reset pressed');
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.button, selected === 'Option 1' && styles.selectedButton]}
          onPress={() => handlePress('Option 1')}
        >
          <Text style={styles.buttonText}>Option 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selected === 'Option 2' && styles.selectedButton]}
          onPress={() => handlePress('Option 2')}
        >
          <Text style={styles.buttonText}>Option 2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selected === 'Option 3' && styles.selectedButton]}
          onPress={() => handlePress('Option 3')}
        >
          <Text style={styles.buttonText}>Option 3</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.timerText}>{formatTime(time)}</Text>
      <View style={styles.startStopContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartPress}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stopButton} onPress={handleStopPress}>
          <Text style={styles.stopButtonText}>Stop</Text>
        </TouchableOpacity>
        
      
      </View>
      <View style={styles.startStopContainer}> 
      <TouchableOpacity style={styles.savetButton} onPress={handleSavePress}>
          <Text style={styles.startButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Stylizacja komponentów
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '20%', // Ustawienie wysokości na 30% ekranu dla lepszej widoczności
    flex: 1,
    backgroundColor: '#B0A3FA',
    borderRadius: 20,
    borderWidth: 5,
    borderColor: '#fff',
    padding: 10,
    justifyContent: 'space-between',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B0A3FA',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    padding: 10,
  },
  selectedButton: {
    backgroundColor: '#8A2BE2',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  startStopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  startButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 10,
    paddingVertical: 10,
    marginVertical: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  savetButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 10,
    paddingVertical: 10,
    marginVertical: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  stopButton: {
    backgroundColor: '#FF6347',
    borderRadius: 10,
    paddingVertical: 10,
    marginVertical: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
 
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  stopButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
 
});

export default Start;
