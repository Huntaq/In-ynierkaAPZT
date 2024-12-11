import React from 'react';

const TrophyList = ({ runningDistance, walkingDistance, cyclingDistance, Co2Saved, CaloriesBurned, MoneySaved, handleTrophyClick }) => {
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
  const walkingTrophy = getTrophyLevel(walkingDistance);

  const co2Trophy = getTrophyLevelForStats(Co2Saved, [10, 20, 50, 75, 100]);
  const caloriesTrophy = getTrophyLevelForStats(CaloriesBurned, [1000, 2000, 5000, 7500, 10000]);
  const moneyTrophy = getTrophyLevelForStats(MoneySaved, [50, 100, 200, 500, 1000]);

  return (
    <div className="">
      <div className="flex flex-wrap justify-center box-border text-[#3B4A3F]">
        <div className={`content-center bg-[#F1FCF3] hover:cursor-pointer hover:scale-105 level-${runningTrophy.level} m-[10px] w-[200px] h-[250px] rounded-[18px] p-[10px] box-border`} onClick={() => handleTrophyClick('running')}>
          <div className="">
            <h3 className="text-center font-normal">Running </h3>
            <img className='justify-self-center m-[10px] h-[100px]' src='./imagesTrophy/marathon.svg'/>
            <h3 className="text-center text-xl font-medium">Level {runningTrophy.level}</h3>
          </div>
          <div className="w-[180px] mt-[20px] bg-[#e0e0e0] rounded-[25px]">
            <div className="bg-[#4BD0FF] h-[8px] rounded-[25px]" style={{ width: `${(100 - (runningTrophy.next / (runningTrophy.next + runningDistance)) * 100).toFixed(2)}%` }}></div>
          </div>
        </div>

        <div className={`content-center bg-[#F1FCF3] hover:cursor-pointer hover:scale-105 level-${walkingTrophy.level} m-[10px] w-[200px] h-[250px] rounded-[18px] p-[10px] box-border `} onClick={() => handleTrophyClick('walking')}>
          <div className="">
            <h3 className="text-center">Walking </h3>
            <img className='justify-self-center m-[10px] h-[100px]' src='./imagesTrophy/hiking.svg'/>
            <h3 className="text-center text-xl font-medium">Level {walkingTrophy.level}</h3>
          </div>
          <div className="w-[180px] mt-[20px] bg-[#e0e0e0] rounded-[25px]">
            <div className="bg-[#4BD0FF] h-[8px] rounded-[25px]" style={{ width: `${(100 - (walkingTrophy.next / (walkingTrophy.next + walkingDistance)) * 100).toFixed(2)}%` }}></div>
          </div>
        </div>

        <div className={`content-center bg-[#F1FCF3] hover:cursor-pointer hover:scale-105 level-${cyclingTrophy.level} m-[10px] w-[200px] h-[250px] rounded-[18px] p-[10px] box-border `} onClick={() => handleTrophyClick('cycling')}>
          <div className="">
            <h3 className="text-center">Cycling </h3>
            <img className='justify-self-center m-[10px] h-[100px]' src='./imagesTrophy/mountain_cycling.svg'/>
            <h3 className="text-center text-xl font-medium">Level {cyclingTrophy.level}</h3>
          </div>
          <div className="w-[180px] mt-[20px] bg-[#e0e0e0] rounded-[25px]">
            <div className="bg-[#4BD0FF] h-[8px] rounded-[25px]" style={{ width: `${(100 - (cyclingTrophy.next / (cyclingTrophy.next + cyclingDistance)) * 100).toFixed(2)}%` }}></div>
          </div>
        </div>

        <div className={`content-center bg-[#F1FCF3] hover:cursor-pointer hover:scale-105  level-${co2Trophy.level} m-[10px] w-[200px] h-[250px] rounded-[18px] p-[10px] box-border `} onClick={() => handleTrophyClick('co2')}>
          <div className="">
            <h3 className="text-center">CO2 Savings </h3>
            <img className='justify-self-center m-[10px] h-[100px]' src='./imagesTrophy/save_earth.svg'/>
            <h3 className="text-center text-xl font-medium">Level {co2Trophy.level}</h3>
          </div>
          <div className="w-[180px] mt-[20px] bg-[#e0e0e0] rounded-[25px]">
            <div className="bg-[#4BD0FF] h-[8px] rounded-[25px]" style={{ width: `${(100 - (co2Trophy.next / (co2Trophy.next + Co2Saved)) * 100).toFixed(2)}%` }}></div>
          </div>
        </div>

        <div className={`content-center bg-[#F1FCF3] hover:cursor-pointer hover:scale-105  level-${caloriesTrophy.level} m-[10px] w-[200px] h-[250px] rounded-[18px] p-[10px] box-border `} onClick={() => handleTrophyClick('calories')}>
          <div className="">
            <h3 className="text-center">Calories Burned </h3>
            <img className='justify-self-center m-[10px] h-[100px]' src='./imagesTrophy/burned_blue.svg'/>
            <h3 className="text-center text-xl font-medium">Level {caloriesTrophy.level}</h3>
          </div>
          <div className="w-[180px] mt-[20px] bg-[#e0e0e0] rounded-[25px]">
            <div className="bg-[#4BD0FF] h-[8px] rounded-[25px]" style={{ width: `${(100 - (caloriesTrophy.next / (caloriesTrophy.next + CaloriesBurned)) * 100).toFixed(2)}%` }}></div>
          </div>
        </div>

        <div className={`content-center bg-[#F1FCF3] hover:cursor-pointer hover:scale-105 level-${moneyTrophy.level} m-[10px] w-[200px] h-[250px] rounded-[18px] p-[10px] box-border `} onClick={() => handleTrophyClick('money')}>
          <div className="">
            <h3 className="text-center">Money Saved </h3>
            <img className='justify-self-center m-[10px] h-[100px]' src='./imagesTrophy/savings.svg'/>
            <h3 className="text-center text-xl font-medium">Level {moneyTrophy.level}</h3>
          </div>
          <div className="w-[180px] mt-[20px] bg-[#e0e0e0] rounded-[25px]">
            <div className="bg-[#4BD0FF] h-[8px] rounded-[25px]" style={{ width: `${(100 - (moneyTrophy.next / (moneyTrophy.next + MoneySaved)) * 100).toFixed(2)}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrophyList;
