import React from 'react';
import ExpenseForm from '../components/ExpenseForm';
import Layout from '../components/Layout/Layout';

const AddExpensePage: React.FC = () => {
  return (
    <Layout>
      <ExpenseForm />
    </Layout>
  );
};

export default AddExpensePage;