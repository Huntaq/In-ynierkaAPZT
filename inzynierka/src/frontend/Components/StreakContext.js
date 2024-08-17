import React, { createContext, useContext, useState } from 'react';

const StreakContext = createContext();

export const StreakProvider = ({ children }) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  return (
    <StreakContext.Provider value={{ currentStreak, setCurrentStreak, longestStreak, setLongestStreak }}>
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = () => useContext(StreakContext);
