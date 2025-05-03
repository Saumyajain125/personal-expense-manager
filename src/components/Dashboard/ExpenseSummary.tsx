import React from 'react';
import { format, parseISO, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { Expense, Category } from '../../types';
import { formatCurrency, filterExpensesByMonth, getCategoryById } from '../../utils';

interface ExpenseSummaryProps {
  expenses: Expense[];
  categories: Category[];
  selectedMonth: Date;
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ expenses, categories, selectedMonth }) => {
  const monthlyExpenses = filterExpensesByMonth(expenses, selectedMonth);
  
  // Calculate the total for each day of the month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth),
  });
  
  const dailyTotals = daysInMonth.map((day) => {
    const dayExpenses = monthlyExpenses.filter(
      (expense) => format(parseISO(expense.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    
    const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      date: day,
      total,
      count: dayExpenses.length,
    };
  });
  
  // Filter out days with no expenses for the recent transactions section
  const daysWithExpenses = dailyTotals.filter((day) => day.count > 0);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <h3 className="p-4 text-lg font-semibold border-b dark:border-gray-700">
        Recent Transactions
      </h3>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {daysWithExpenses.length > 0 ? (
          daysWithExpenses
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 10)
            .map((day, index) => {
              const dayExpenses = monthlyExpenses.filter(
                (expense) => format(parseISO(expense.date), 'yyyy-MM-dd') === format(day.date, 'yyyy-MM-dd')
              );
              
              return (
                <div key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm">
                        {format(day.date, 'dd')}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">{format(day.date, 'EEEE')}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(day.date, 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(day.total)}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {day.count} {day.count === 1 ? 'transaction' : 'transactions'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pl-14 space-y-2">
                    {dayExpenses.map((expense) => {
                      const category = getCategoryById(categories, expense.categoryId);
                      
                      return (
                        <div key={expense.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{expense.description}</p>
                            <div className="flex items-center">
                              <span 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-2" 
                                style={{ 
                                  backgroundColor: category ? `${category.color}20` : '#E5E7EB',
                                  color: category ? category.color : '#374151'
                                }}
                              >
                                {category ? category.name : 'Unknown'}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {expense.paidByApp}
                              </span>
                            </div>
                          </div>
                          <p className="font-medium">{formatCurrency(expense.amount)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No transactions found for this month
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseSummary;