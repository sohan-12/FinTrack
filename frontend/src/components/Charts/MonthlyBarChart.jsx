import React from 'react';
import { Bar } from 'react-chartjs-2';

export const MonthlyBarChart = ({ monthlyData = [] }) => {
  if (!monthlyData || monthlyData.length === 0) {
    return (
      <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
        No historical monthly data yet.
      </div>
    );
  }

  const labels = monthlyData.map((m) => {
    // Format YYYY-MM to Month Name (e.g. 2025-08 -> Aug)
    const parts = m.month.split('-');
    if (parts.length === 2) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
      return d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    }
    return m.month;
  });

  const incomeValues = monthlyData.map((m) => m.income);
  const expenseValues = monthlyData.map((m) => m.expense);

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeValues,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 6,
        barPercentage: 0.6,
      },
      {
        label: 'Expenses',
        data: expenseValues,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
          },
          color: '#475569',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.dataset.label}: $${context.raw?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
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
            weight: 500,
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
