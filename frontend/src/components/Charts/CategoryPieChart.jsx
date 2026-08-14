import React from 'react';
import { Doughnut } from 'react-chartjs-2';

export const CategoryPieChart = ({ categories = [] }) => {
  if (!categories || categories.length === 0) {
    return (
      <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
        No expense data recorded yet.
      </div>
    );
  }

  const topCategories = categories.slice(0, 6);
  const labels = topCategories.map((c) => c.category);
  const amounts = topCategories.map((c) => c.totalAmount);

  const colors = [
    '#FF6B00', // Vibrant Orange
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#64748B', // Slate
  ];

  const data = {
    labels,
    datasets: [
      {
        data: amounts,
        backgroundColor: colors.slice(0, topCategories.length),
        borderWidth: 2,
        borderColor: '#FFFFFF',
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 3,
          usePointStyle: true,
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
            weight: 500,
          },
          color: '#334155',
          padding: 14,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = topCategories[context.dataIndex]?.percentage || 0;
            return ` ${label}: $${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '240px', width: '100%' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};
