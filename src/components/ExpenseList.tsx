import React, { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Calendar, ArrowUp, ArrowDown, Search, Filter } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency, formatDate, getCategoryById } from '../utils';

const ExpenseList: React.FC = () => {
  const { state, deleteExpense } = useExpense();
  const navigate = useNavigate();
  
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  
  const handleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const filteredExpenses = state.expenses.filter((expense) => {
    // Filter by search term
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory ? expense.categoryId === selectedCategory : true;
    
    // Filter by month
    const matchesMonth = selectedMonth
      ? format(new Date(expense.date), 'yyyy-MM') === selectedMonth
      : true;
    
    return matchesSearch && matchesCategory && matchesMonth;
  });
  
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
  });
  
  // Get unique months from expenses
  const months = [...new Set(state.expenses.map((expense) => format(new Date(expense.date), 'yyyy-MM')))];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">Expenses</h2>
          <div className="ml-4 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full text-sm font-medium">
            {filteredExpenses.length} entries
          </div>
        </div>
        
        <button
          onClick={() => navigate('/add')}
          className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <span className="mr-1">+</span> Add Expense
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={16} className="text-gray-400" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg appearance-none dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">All Categories</option>
                  {state.categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg appearance-none dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">All Months</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {format(new Date(`${month}-01`), 'MMMM yyyy')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {sortedExpenses.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No expenses found. Add an expense to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 text-left">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('date')}
                      className="flex items-center"
                    >
                      Date
                      {sortField === 'date' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('amount')}
                      className="flex items-center"
                    >
                      Amount
                      {sortField === 'amount' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedExpenses.map((expense) => {
                  const category = getCategoryById(state.categories, expense.categoryId);
                  
                  return (
                    <tr 
                      key={expense.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-6 py-4 text-sm max-w-xs truncate">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                          style={{ 
                            backgroundColor: category ? `${category.color}20` : '#E5E7EB',
                            color: category ? category.color : '#374151'
                          }}
                        >
                          {category ? category.name : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col">
                          <span>{expense.paidByApp}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {expense.paidByAccount}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/edit/${expense.id}`)}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;