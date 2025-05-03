export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  paidByApp: string;
  paidByAccount: 'credit' | 'debit';
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface MonthlyData {
  totalAmount: number;
  categoriesAmount: {
    categoryId: string;
    amount: number;
  }[];
  paidByAppAmount: {
    app: string;
    amount: number;
  }[];
  paidByAccountAmount: {
    account: 'credit' | 'debit';
    amount: number;
  }[];
}