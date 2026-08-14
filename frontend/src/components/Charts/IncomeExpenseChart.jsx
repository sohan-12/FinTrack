import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const IncomeExpenseChart = ({ income = 0, expenses = 0 }) => {
  const data = {
    labels: ['Total Income', 'Total Expenses'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [income, expenses],
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)', // Emerald Green
          'rgba(239, 68, 68, 0.85)',  // Coral Red
        ],
        borderColor: [
          '#10B981',
          '#EF4444',
        ],
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 45,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => ` $${context.raw?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F1F5F9',
        },
        ticks: {
          callback: (value) => `$${value}`,
          color: '#64748B',
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#334155',
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            weight: 600,
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '240px', width: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  );
};
