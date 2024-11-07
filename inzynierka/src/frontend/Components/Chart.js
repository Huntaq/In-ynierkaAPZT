import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Chart = ({ month, year, transportMode, userRoutes }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dailyDistances = Array(daysInMonth).fill(0);

  userRoutes.forEach(route => {
    const routeDate = new Date(route.date);
    if (routeDate.getMonth() === month && routeDate.getFullYear() === year && route.transport_mode_id === transportMode) {
      const day = routeDate.getDate();
      dailyDistances[day - 1] += route.distance_km;
    }
  });

  const chartData = {
    labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Kilometers',
        data: dailyDistances,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Day',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Kilometers',
        },
      },
    },
  };

  return (
    <div className="w-full h-full justify-items-center max-w-[100%] content-center">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default Chart;
