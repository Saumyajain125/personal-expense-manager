import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreditCard, Wallet, Tag, IndianRupee, Calendar, FileText } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { Expense } from '../types';

const ExpenseForm: React.FC = () => {
  const { state, addExpense, editExpense } = useExpense();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    paidByApp: state.paymentApps[0] || '',
    paidByAccount: 'debit',
    categoryId: state.categories[0]?.id || '',
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  useEffect(() => {
    if (id) {
      const expense = state.expenses.find((e) => e.id === id);
      if (expense) {
        setFormData({
          amount: expense.amount,
          description: expense.description,
          date: new Date(expense.date).toISOString().split('T')[0],
          paidByApp: expense.paidByApp,
          paidByAccount: expense.paidByAccount,
          categoryId: expense.categoryId,
        });
      }
    }
  }, [id, state.expenses]);
  
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.paidByApp) {
      newErrors.paidByApp = 'Payment app is required';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    const submissionData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
    };
    
    if (id) {
      editExpense({ ...submissionData, id });
    } else {
      addExpense(submissionData);
    }
    
    navigate('/');
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };
  
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Expense' : 'Add New Expense'}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="flex items-center text-sm font-medium">
            <IndianRupee size={18} className="mr-2 text-emerald-500" />
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="1"
              min="0"
              className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-800`}
            />
          </div>
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
        </div>
        
        <div className="space-y-1">
          <label className="flex items-center text-sm font-medium">
            <FileText size={18} className="mr-2 text-emerald-500" />
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800`}
            placeholder="What was this expense for?"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>
        
        <div className="space-y-1">
          <label className="flex items-center text-sm font-medium">
            <Calendar size={18} className="mr-2 text-emerald-500" />
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800 [color-scheme:dark]`}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>
        
        <div className="space-y-1">
          <label className="flex items-center text-sm font-medium">
            <Wallet size={18} className="mr-2 text-emerald-500" />
            Paid By (App)
          </label>
          <select
            name="paidByApp"
            value={formData.paidByApp}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors.paidByApp ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800`}
          >
            {state.paymentApps.map((app) => (
              <option key={app} value={app}>
                {app}
              </option>
            ))}
          </select>
          {errors.paidByApp && <p className="text-red-500 text-xs mt-1">{errors.paidByApp}</p>}
        </div>
        
        <div className="space-y-1">
          <label className="flex items-center text-sm font-medium">
            <CreditCard size={18} className="mr-2 text-emerald-500" />
            Paid By (Account)
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="paidByAccount"
                value="credit"
                checked={formData.paidByAccount === 'credit'}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 dark:border-gray-600"
              />
              <span className="ml-2">Credit</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paidByAccount"
                value="debit"
                checked={formData.paidByAccount === 'debit'}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 dark:border-gray-600"
              />
              <span className="ml-2">Debit</span>
            </label>
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="flex items-center text-sm font-medium">
            <Tag size={18} className="mr-2 text-emerald-500" />
            Category
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              errors.categoryId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800`}
          >
            {state.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
        </div>
        
        <div className="flex flex-col md:flex-row md:justify-end space-y-3 md:space-y-0 md:space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 rounded-lg text-white font-medium hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            {id ? 'Update Expense' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;