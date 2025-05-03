import { format, parseISO, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import XLSX from 'xlsx-js-style';
import { v4 as uuidv4 } from 'uuid';
import { Expense, Category, MonthlyData } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM dd, yyyy');
};

export const getMonthName = (dateString: string): string => {
  return format(parseISO(dateString), 'MMMM yyyy');
};

export const filterExpensesByMonth = (expenses: Expense[], date: Date): Expense[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  
  return expenses.filter((expense) => {
    const expenseDate = parseISO(expense.date);
    return expenseDate >= start && expenseDate <= end;
  });
};

export const calculateMonthlyData = (expenses: Expense[], categories: Category[]): MonthlyData => {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categoriesAmount = categories.map((category) => {
    const amount = expenses
      .filter((expense) => expense.categoryId === category.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return { categoryId: category.id, amount };
  });
  
  const paymentAppsMap = new Map<string, number>();
  expenses.forEach((expense) => {
    const currentAmount = paymentAppsMap.get(expense.paidByApp) || 0;
    paymentAppsMap.set(expense.paidByApp, currentAmount + expense.amount);
  });
  
  const paidByAppAmount = Array.from(paymentAppsMap.entries()).map(([app, amount]) => ({
    app,
    amount,
  }));
  
  const accountsMap = new Map<'credit' | 'debit', number>();
  expenses.forEach((expense) => {
    const currentAmount = accountsMap.get(expense.paidByAccount) || 0;
    accountsMap.set(expense.paidByAccount, currentAmount + expense.amount);
  });
  
  const paidByAccountAmount = Array.from(accountsMap.entries()).map(([account, amount]) => ({
    account,
    amount,
  }));
  
  return {
    totalAmount,
    categoriesAmount,
    paidByAppAmount,
    paidByAccountAmount,
  };
};

export const generateRandomColor = (): string => {
  const colors = [
    '#10B981', // emerald
    '#3B82F6', // blue
    '#F59E0B', // amber
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#EF4444', // red
    '#06B6D4', // cyan
    '#14B8A6', // teal
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getDaysInMonth = (date: Date): number => {
  return differenceInDays(endOfMonth(date), startOfMonth(date)) + 1;
};

export const getCategoryById = (categories: Category[], id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const exportToExcel = (expenses: Expense[], categories: Category[]): void => {
  const worksheet = XLSX.utils.json_to_sheet(
    expenses.map(expense => ({
      Date: format(parseISO(expense.date), 'yyyy-MM-dd'),
      Description: expense.description,
      Amount: expense.amount,
      Category: getCategoryById(categories, expense.categoryId)?.name || 'Unknown',
      'Payment App': expense.paidByApp,
      'Account Type': expense.paidByAccount
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');

  XLSX.writeFile(workbook, `expenses-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

const validateExcelRow = (row: any): { isValid: boolean; error?: string } => {
  if (!row.Date || !row.Description || row.Amount === undefined || !row.Category || !row['Payment App'] || !row['Account Type']) {
    return { isValid: false, error: 'Missing required fields in the Excel file' };
  }

  const date = new Date(row.Date);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date format. Use YYYY-MM-DD' };
  }

  const amount = Number(row.Amount);
  if (isNaN(amount) || amount < 0) {
    return { isValid: false, error: 'Invalid amount value' };
  }

  if (!['credit', 'debit'].includes(String(row['Account Type']).toLowerCase())) {
    return { isValid: false, error: 'Account Type must be either "credit" or "debit"' };
  }

  return { isValid: true };
};

interface ImportResult {
  expenses: Expense[];
  newCategories: Category[];
  newPaymentApps: string[];
}

export const importFromExcel = async (file: File, categories: Category[], paymentApps: string[]): Promise<ImportResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (!workbook.SheetNames.length) {
          throw new Error('Excel file is empty');
        }

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (!jsonData.length) {
          throw new Error('No data found in the Excel file');
        }

        const expenses: Expense[] = [];
        const errors: string[] = [];
        const newCategories: Category[] = [];
        const newPaymentApps: Set<string> = new Set();
        const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c]));

        jsonData.forEach((row: any, index: number) => {
          const validation = validateExcelRow(row);
          if (!validation.isValid) {
            errors.push(`Row ${index + 2}: ${validation.error}`);
            return;
          }

          const categoryName = String(row.Category);
          let category = categoryMap.get(categoryName.toLowerCase());

          // Create new category if it doesn't exist
          if (!category) {
            category = {
              id: uuidv4(),
              name: categoryName,
              color: generateRandomColor()
            };
            categoryMap.set(categoryName.toLowerCase(), category);
            newCategories.push(category);
          }

          // Track new payment apps
          const paymentApp = String(row['Payment App']);
          if (!paymentApps.includes(paymentApp)) {
            newPaymentApps.add(paymentApp);
          }

          expenses.push({
            id: uuidv4(),
            date: new Date(row.Date).toISOString(),
            description: String(row.Description),
            amount: Number(row.Amount),
            categoryId: category.id,
            paidByApp: paymentApp,
            paidByAccount: String(row['Account Type']).toLowerCase() as 'credit' | 'debit'
          });
        });

        if (errors.length > 0) {
          throw new Error(`Validation errors:\n${errors.join('\n')}`);
        }

        resolve({
          expenses,
          newCategories,
          newPaymentApps: Array.from(newPaymentApps)
        });
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to parse Excel file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read the file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};