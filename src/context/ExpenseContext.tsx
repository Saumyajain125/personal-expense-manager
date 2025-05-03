import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, Category } from '../types';

interface ExpenseState {
  expenses: Expense[];
  categories: Category[];
  paymentApps: string[];
}

type ExpenseAction =
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id'> }
  | { type: 'EDIT_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Omit<Category, 'id'> }
  | { type: 'EDIT_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_PAYMENT_APP'; payload: string }
  | { type: 'INITIALIZE'; payload: ExpenseState };

const initialState: ExpenseState = {
  expenses: [],
  categories: [
    { id: uuidv4(), name: 'Food', color: '#10B981' },
    { id: uuidv4(), name: 'Transportation', color: '#3B82F6' },
    { id: uuidv4(), name: 'Entertainment', color: '#F59E0B' },
    { id: uuidv4(), name: 'Utilities', color: '#8B5CF6' },
    { id: uuidv4(), name: 'Shopping', color: '#EC4899' },
  ],
  paymentApps: ['Cash', 'Credit Card', 'Cred', 'Phone Pay', 'Paytm', 'Google Pay'],
};

const STORAGE_KEY = 'expense_tracker_data';

const expenseReducer = (state: ExpenseState, action: ExpenseAction): ExpenseState => {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, { ...action.payload, id: uuidv4() }],
      };
    case 'EDIT_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, { ...action.payload, id: uuidv4() }],
      };
    case 'EDIT_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((category) => category.id !== action.payload),
      };
    case 'ADD_PAYMENT_APP':
      return {
        ...state,
        paymentApps: [...state.paymentApps, action.payload],
      };
    case 'INITIALIZE':
      return action.payload;
    default:
      return state;
  }
};

interface ExpenseContextType {
  state: ExpenseState;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  editExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  editCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addPaymentApp: (app: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as ExpenseState;
        dispatch({ type: 'INITIALIZE', payload: parsedData });
      } catch (error) {
        console.error('Failed to parse saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
  };

  const editExpense = (expense: Expense) => {
    dispatch({ type: 'EDIT_EXPENSE', payload: expense });
  };

  const deleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    dispatch({ type: 'ADD_CATEGORY', payload: category });
  };

  const editCategory = (category: Category) => {
    dispatch({ type: 'EDIT_CATEGORY', payload: category });
  };

  const deleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  };

  const addPaymentApp = (app: string) => {
    dispatch({ type: 'ADD_PAYMENT_APP', payload: app });
  };

  const value = {
    state,
    addExpense,
    editExpense,
    deleteExpense,
    addCategory,
    editCategory,
    deleteCategory,
    addPaymentApp,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};