import React from 'react';
import ExpenseForm from '../components/ExpenseForm';
import Layout from '../components/Layout/Layout';

const EditExpensePage: React.FC = () => {
  return (
    <Layout>
      <ExpenseForm />
    </Layout>
  );
};

export default EditExpensePage;