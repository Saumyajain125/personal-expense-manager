import React from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend 
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Expense, Category } from '../../types';
import { formatCurrency, filterExpensesByMonth, getCategoryById } from '../../utils';

ChartJS.register(
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartsProps {
  expenses: Expense[];
  categories: Category[];
  selectedMonth: Date;
}

const Charts: React.FC<ChartsProps> = ({ expenses, categories, selectedMonth }) => {
  const monthlyExpenses = filterExpensesByMonth(expenses, selectedMonth);
  
  // Category distribution data
  const categoryData = categories.map(category => {
    const amount = monthlyExpenses
      .filter(expense => expense.categoryId === category.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return amount;
  });
  
  const pieChartData = {
    labels: categories.map(category => category.name),
    datasets: [
      {
        data: categoryData,
        backgroundColor: categories.map(category => category.color),
        borderWidth: 1,
      },
    ],
  };
  
  // Payment method data
  const paymentApps = [...new Set(monthlyExpenses.map(expense => expense.paidByApp))];
  
  const paymentAppData = paymentApps.map(app => {
    return monthlyExpenses
      .filter(expense => expense.paidByApp === app)
      .reduce((sum, expense) => sum + expense.amount, 0);
  });
  
  const barChartData = {
    labels: paymentApps,
    datasets: [
      {
        label: 'Amount Spent',
        data: paymentAppData,
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };
  
  // Account Type Distribution
  const creditAmount = monthlyExpenses
    .filter(expense => expense.paidByAccount === 'credit')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const debitAmount = monthlyExpenses
    .filter(expense => expense.paidByAccount === 'debit')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const accountTypeData = {
    labels: ['Credit', 'Debit'],
    datasets: [
      {
        data: [creditAmount, debitAmount],
        backgroundColor: ['#F59E0B', '#3B82F6'],
        borderWidth: 1,
      },
    ],
  };
  
  // Calculate total spent
  const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Find top category
  let topCategory = { id: '', name: 'None', amount: 0 };
  
  categories.forEach(category => {
    const amount = monthlyExpenses
      .filter(expense => expense.categoryId === category.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    if (amount > topCategory.amount) {
      topCategory = { id: category.id, name: category.name, amount };
    }
  });
  
  return (
    <div className="mt-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Spent</h3>
          <p className="text-3xl font-bold text-emerald-500">{formatCurrency(totalSpent)}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Top Category</h3>
          <p className="text-3xl font-bold text-emerald-500">{topCategory.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formatCurrency(topCategory.amount)}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-emerald-500">{monthlyExpenses.length}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <div className="h-64">
            {totalSpent > 0 ? (
              <Pie 
                data={pieChartData} 
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        usePointStyle: true,
                        boxWidth: 10,
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const value = context.raw as number;
                          return `${context.label}: ${formatCurrency(value)} (${((value / totalSpent) * 100).toFixed(1)}%)`;
                        },
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                No data available for this month
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Spending by Payment Method</h3>
          <div className="h-64">
            {totalSpent > 0 ? (
              <Bar 
                data={barChartData} 
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const value = context.raw as number;
                          return `Amount: ${formatCurrency(value)}`;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => formatCurrency(value as number),
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                No data available for this month
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Credit vs Debit Spending</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="w-1/2 h-full">
            {totalSpent > 0 ? (
              <Pie 
                data={accountTypeData} 
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        usePointStyle: true,
                        boxWidth: 10,
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const value = context.raw as number;
                          return `${context.label}: ${formatCurrency(value)} (${((value / totalSpent) * 100).toFixed(1)}%)`;
                        },
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                No data available for this month
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;