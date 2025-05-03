import React, { useState, useRef } from 'react';
import Layout from '../components/Layout/Layout';
import CategoryManager from '../components/CategoryManager';
import { useExpense } from '../context/ExpenseContext';
import { Plus, X, Upload, Download } from 'lucide-react';
import { exportToExcel, importFromExcel } from '../utils';

const SettingsPage: React.FC = () => {
  const { state, addPaymentApp, addExpense, addCategory } = useExpense();
  const [newApp, setNewApp] = useState('');
  const [showAppForm, setShowAppForm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleAddApp = () => {
    if (newApp.trim() && !state.paymentApps.includes(newApp.trim())) {
      addPaymentApp(newApp.trim());
      setNewApp('');
      setShowAppForm(false);
    }
  };
  
  const handleExport = () => {
    exportToExcel(state.expenses, state.categories);
  };
  
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setImportError(null);
      const { expenses, newCategories, newPaymentApps } = await importFromExcel(file, state.categories, state.paymentApps);
      
      // Add new categories
      newCategories.forEach(category => addCategory(category));
      
      // Add new payment apps
      newPaymentApps.forEach(app => addPaymentApp(app));
      
      // Add expenses
      expenses.forEach(expense => addExpense(expense));
      
      alert(`Import successful!\n${expenses.length} expenses added\n${newCategories.length} new categories created\n${newPaymentApps.length} new payment methods added`);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import data');
    }
  };
  
  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <CategoryManager />
          </div>
          
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Payment Methods</h3>
              
              <div className="space-y-2">
                {state.paymentApps.map((app, index) => (
                  <div key={index} className="p-3 border rounded-lg border-gray-700">
                    {app}
                  </div>
                ))}
              </div>
              
              {showAppForm ? (
                <div className="mt-4 p-3 border rounded-lg border-gray-700">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newApp}
                      onChange={(e) => setNewApp(e.target.value)}
                      placeholder="Payment method name"
                      className="flex-1 px-3 py-2 border rounded-md bg-gray-700 border-gray-600"
                    />
                    <button
                      onClick={handleAddApp}
                      className="px-3 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                    >
                      <Plus size={18} />
                    </button>
                    <button
                      onClick={() => setShowAppForm(false)}
                      className="px-3 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAppForm(true)}
                  className="mt-4 flex items-center text-emerald-500 hover:text-emerald-600"
                >
                  <Plus size={18} className="mr-1" />
                  Add Payment Method
                </button>
              )}
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Data Management</h3>
              
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={handleExport}
                    className="flex items-center justify-center w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Download size={18} className="mr-2" />
                    Export to Excel
                  </button>
                  
                  <label className="flex items-center justify-center w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 cursor-pointer transition-colors">
                    <Upload size={18} className="mr-2" />
                    Import from Excel
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {importError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                    {importError}
                  </div>
                )}
                
                <div className="p-4 bg-amber-900 text-amber-100 rounded-lg">
                  <h4 className="font-medium mb-2">Excel Import Format</h4>
                  <p className="text-sm">
                    The Excel file should have the following columns:
                  </p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>Date (YYYY-MM-DD format)</li>
                    <li>Description</li>
                    <li>Amount</li>
                    <li>Category (new categories will be created automatically)</li>
                    <li>Payment App (new payment methods will be added automatically)</li>
                    <li>Account Type (credit or debit)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;