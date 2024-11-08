import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';

const StartStopButton = () => {
  const [buttonState, setButtonState] = useState('start'); 

  const handleStartPress = () => {
    setButtonState('stop');
  };

  const handleResumePress = () => {
    setButtonState('start');
  };

  const handleFinishPress = () => {
    setButtonState('finished'); 
  };

  return (
    <View style={styles.container}>
      {buttonState === 'start' && (
        <Button 
          title="Start" 
          onPress={handleStartPress} 
        />
      )}
      {buttonState === 'stop' && (
        <Button 
          title="Stop" 
          onPress={() => setButtonState('split')}
        />
      )}
      {buttonState === 'split' && (
        <>
          <Button 
            title="Resume" 
            onPress={handleResumePress} 
          />
          <Button 
            title="Finish" 
            onPress={handleFinishPress} 
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StartStopButton;
