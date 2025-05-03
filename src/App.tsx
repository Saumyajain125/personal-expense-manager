import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ExpenseProvider } from './context/ExpenseContext';
import HomePage from './pages/HomePage';
import AddExpensePage from './pages/AddExpensePage';
import EditExpensePage from './pages/EditExpensePage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ExpenseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddExpensePage />} />
          <Route path="/edit/:id" element={<EditExpensePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </BrowserRouter>
    </ExpenseProvider>
  );
}

export default App;