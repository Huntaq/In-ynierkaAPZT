import React, { useState} from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const transportModes = {
  1: 'Running',
  2: 'Cycling',
  3: 'Walking',
};

const Chart = ({ userRoutes }) => {
  const [weekOrMonth, setWeekOrMonth] = useState('week');
  const [transportMode, setTransportMode] = useState(1);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

  const today = new Date();
  let startCount;
  let endCount;
  let labels;
  let dailyDistances;
  let displayDate;

  if (weekOrMonth === 'week') {
    const currentDay = today.getDay();
    startCount = new Date(today);
    startCount.setDate(
      today.getDate() - (currentDay === 0 ? 6 : currentDay - 1) + currentWeekOffset * 7
    );
    startCount.setHours(0, 0, 0, 0);

    endCount = new Date(startCount);
    endCount.setDate(startCount.getDate() + 6);
    endCount.setHours(23, 59, 59, 999);

    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    dailyDistances = Array(7).fill(0);

    displayDate = `${startCount.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} - ${endCount.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}`;

    userRoutes.forEach(route => {
      const routeDate = new Date(route.date);

      if (
        routeDate >= startCount &&
        routeDate <= endCount &&
        route.transport_mode_id === transportMode
      ) {
        const dayIndex = (routeDate.getDay() + 6) % 7;
        dailyDistances[dayIndex] += route.distance_km;
      }
    });
  } else {
    const currentMonth = new Date(today.getFullYear(), today.getMonth() + currentMonthOffset, 1);
    startCount = currentMonth;
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

    endCount = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), daysInMonth);
    endCount.setHours(23, 59, 59, 999);

    labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    dailyDistances = Array(daysInMonth).fill(0);

    displayDate = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    userRoutes.forEach(route => {
      const routeDate = new Date(route.date);

      if (
        routeDate.getFullYear() === currentMonth.getFullYear() &&
        routeDate.getMonth() === currentMonth.getMonth() &&
        route.transport_mode_id === transportMode
      ) {
        const day = routeDate.getDate();
        dailyDistances[day - 1] += route.distance_km;
      }
    });
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Kilometers',
        data: dailyDistances,
        backgroundColor: '#4BD0FF',
        borderRadius: {
          topLeft: 8,
          topRight: 8,
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
          callback: (value) => `${value} km`,
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="flex gap-[10px] mt-[10px] justify-between w-[95%] items-center">
        <button
          onClick={() =>
            weekOrMonth === 'week'
              ? setCurrentWeekOffset(currentWeekOffset - 1)
              : setCurrentMonthOffset(currentMonthOffset - 1)
          }
          className="text-[#3B4A3F]"
        >
          &larr;
        </button>
        <select
          value={weekOrMonth}
          onChange={(e) => setWeekOrMonth(e.target.value)}
          className="rounded-[7px] border-[1px] bg-[#F1FCF3] p-[5px] border-[#B5B5B5] text-[#3B4A3F] CustomXXSM:p-[2px] CustomXXSM:text-[14px]"
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
        <span className="text-[#3B4A3F] font-semibold CustomXXSM:text-[10px]">{displayDate}</span>
        <select
          value={transportMode}
          onChange={(e) => setTransportMode(parseInt(e.target.value, 10))}
          className="rounded-[7px] border-[1px] bg-[#F1FCF3] CustomXXSM:p-[2px] CustomXXSM:text-[14px] p-[5px] border-[#B5B5B5] text-[#3B4A3F]"
        >
          {Object.entries(transportModes).map(([modeId, modeName]) => (
            <option key={modeId} value={modeId}>
              {modeName}
            </option>
          ))}
        </select>
        <button
          onClick={() =>
            weekOrMonth === 'week'
              ? setCurrentWeekOffset(currentWeekOffset + 1)
              : setCurrentMonthOffset(currentMonthOffset + 1)
          }
          className="text-[#3B4A3F]"
        >
          &rarr;
        </button>
      </div>
      <div className="w-full h-full p-[10px]">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Chart;
