import React from 'react';
import ExpenseList from '../components/ExpenseList';
import Layout from '../components/Layout/Layout';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <ExpenseList />
    </Layout>
  );
};

export default HomePage;