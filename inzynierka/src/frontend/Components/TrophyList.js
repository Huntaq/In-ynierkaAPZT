import React from 'react';

const TrophyList = ({ runningDistance, cyclingDistance, Co2Saved, CaloriesBurned, MoneySaved, handleTrophyClick }) => {
  const getTrophyLevel = (distance) => {
    if (distance >= 100) return { level: 5, color: 'gold', next: 0 };
    if (distance >= 75) return { level: 4, color: 'silver', next: 100 - distance };
    if (distance >= 50) return { level: 3, color: 'bronze', next: 75 - distance };
    if (distance >= 20) return { level: 2, color: 'blue', next: 50 - distance };
    if (distance >= 10) return { level: 1, color: 'green', next: 20 - distance };
    return { level: 0, color: 'grey', next: 10 - distance };
  };

  const getTrophyLevelForStats = (value, thresholds) => {
    if (value >= thresholds[4]) return { level: 5, color: 'gold', next: 0 };
    if (value >= thresholds[3]) return { level: 4, color: 'silver', next: thresholds[4] - value };
    if (value >= thresholds[2]) return { level: 3, color: 'bronze', next: thresholds[3] - value };
    if (value >= thresholds[1]) return { level: 2, color: 'blue', next: thresholds[2] - value };
    if (value >= thresholds[0]) return { level: 1, color: 'green', next: thresholds[1] - value };
    return { level: 0, color: 'grey', next: thresholds[0] - value };
  };

  const runningTrophy = getTrophyLevel(runningDistance);
  const cyclingTrophy = getTrophyLevel(cyclingDistance);

  const co2Trophy = getTrophyLevelForStats(Co2Saved, [10, 20, 50, 75, 100]);
  const caloriesTrophy = getTrophyLevelForStats(CaloriesBurned, [1000, 2000, 5000, 7500, 10000]);
  const moneyTrophy = getTrophyLevelForStats(MoneySaved, [50, 100, 200, 500, 1000]);

  return (
    <div className="trophies-container">
      <div className="trophy-list">
        <div className={`trophy row level-${runningTrophy.level}`} onClick={() => handleTrophyClick('running')}>
          <div className="trophy-header">
            <h3 className="trophy-title">🏃‍♂️ Running </h3>
            <h3 className="trophy-level">Level {runningTrophy.level}</h3>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(100 - (runningTrophy.next / (runningTrophy.next + runningDistance)) * 100).toFixed(2)}%` }}></div>
          </div>
        </div>

        <div className={`trophy row level-${cyclingTrophy.level}`} onClick={() => handleTrophyClick('cycling')}>
          <div className="trophy-header">
            <h3 className="trophy-title">🚴‍♂️ Cycling </h3>
            <h3 className="trophy-level">Level {cyclingTrophy.level}</h3>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(100 - (cyclingTrophy.next / (cyclingTrophy.next + cyclingDistance)) * 100).toFixed(2)}%` }}></div>
          </div>
        </div>

        <div className={`trophy row level-${co2Trophy.level}`} onClick={() => handleTrophyClick('co2')}>
          <div className="trophy-header">
            <h3 className="trophy-title">🌍 CO2 Savings </h3>
            <h3 className="trophy-level">Level {co2Trophy.level}</h3>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(100 - (co2Trophy.next / (co2Trophy.next + Co2Saved)) * 100).toFixed(2)}%` }}></div>
          </div>
        </div>

        <div className={`trophy row level-${caloriesTrophy.level}`} onClick={() => handleTrophyClick('calories')}>
          <div className="trophy-header">
            <h3 className="trophy-title">🔥 Calories Burned </h3>
            <h3 className="trophy-level">Level {caloriesTrophy.level}</h3>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(100 - (caloriesTrophy.next / (caloriesTrophy.next + CaloriesBurned)) * 100).toFixed(2)}%` }}></div>
          </div>
        </div>

        <div className={`trophy row level-${moneyTrophy.level}`} onClick={() => handleTrophyClick('money')}>
          <div className="trophy-header">
            <h3 className="trophy-title">💸 Money Saved </h3>
            <h3 className="trophy-level">Level {moneyTrophy.level}</h3>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(100 - (moneyTrophy.next / (moneyTrophy.next + MoneySaved)) * 100).toFixed(2)}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrophyList;
