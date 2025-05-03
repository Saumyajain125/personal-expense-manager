import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import Layout from '../components/Layout/Layout';
import MonthPicker from '../components/Dashboard/MonthPicker';
import Charts from '../components/Dashboard/Charts';
import ExpenseSummary from '../components/Dashboard/ExpenseSummary';

const DashboardPage: React.FC = () => {
  const { state } = useExpense();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        
        <MonthPicker selectedMonth={selectedMonth} onChange={setSelectedMonth} />
        
        <Charts 
          expenses={state.expenses}
          categories={state.categories}
          selectedMonth={selectedMonth}
        />
        
        <div className="mt-8">
          <ExpenseSummary 
            expenses={state.expenses}
            categories={state.categories}
            selectedMonth={selectedMonth}
          />
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;