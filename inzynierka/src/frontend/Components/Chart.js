import React, { useState} from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const transportModes = {
  1: 'Running',
  2: 'Bike',
  3: 'Walking',
};

const Chart = ({ userRoutes }) => {
  const [weekOrMonth, setWeekOrMonth] = useState('week');
  const [transportMode, setTransportMode] = useState(1);

  const today = new Date();
  const currentDay = today.getDay();

  let startCount;
  let labels;
  let dailyDistances;

  if (weekOrMonth === 'week') {
    startCount = new Date(today);
    startCount.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    dailyDistances = Array(7).fill(0);

    userRoutes.forEach(route => {
      const routeDate = new Date(route.date);

      if (
        routeDate >= startCount &&
        routeDate <= today &&
        route.transport_mode_id === transportMode
      ) {
        const dayIndex = (routeDate.getDay() + 6) % 7;
        dailyDistances[dayIndex] += route.distance_km;
      }
    });
  } else {
    startCount = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    dailyDistances = Array(daysInMonth).fill(0);

    userRoutes.forEach(route => {
      const routeDate = new Date(route.date);

      if (
        routeDate >= startCount &&
        routeDate <= today &&
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
        }
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
    <div className="w-full h-full flex flex-col items-center ">
      <div className="flex gap-[10px] mt-[10px] justify-between w-[95%]">
        <select
          value={weekOrMonth}
          onChange={(e) => setWeekOrMonth(e.target.value)}
          className="rounded-[7px] border-[1px] bg-[#F1FCF3] p-[5px] border-[#B5B5B5] text-[#3B4A3F]"
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>

        <select
          value={transportMode}
          onChange={(e) => setTransportMode(parseInt(e.target.value, 10))}
          className="rounded-[7px] border-[1px] bg-[#F1FCF3] p-[5px] border-[#B5B5B5] text-[#3B4A3F]"
        >
          {Object.entries(transportModes).map(([modeId, modeName]) => (
            <option key={modeId} value={modeId}>
              {modeName}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full h-full p-[10px]">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Chart;
