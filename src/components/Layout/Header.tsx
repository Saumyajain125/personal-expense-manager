import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PieChart, PlusCircle, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">ExpenseTracker</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center space-x-1 transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-emerald-500 font-medium' 
                  : 'text-gray-300 hover:text-emerald-400'
              }`}
            >
              <Home size={18} />
              <span>Home</span>
            </button>
            
            <button
              onClick={() => navigate('/add')}
              className={`flex items-center space-x-1 transition-colors duration-200 ${
                isActive('/add') 
                  ? 'text-emerald-500 font-medium' 
                  : 'text-gray-300 hover:text-emerald-400'
              }`}
            >
              <PlusCircle size={18} />
              <span>Add Expense</span>
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center space-x-1 transition-colors duration-200 ${
                isActive('/dashboard') 
                  ? 'text-emerald-500 font-medium' 
                  : 'text-gray-300 hover:text-emerald-400'
              }`}
            >
              <PieChart size={18} />
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => navigate('/settings')}
              className={`flex items-center space-x-1 transition-colors duration-200 ${
                isActive('/settings') 
                  ? 'text-emerald-500 font-medium' 
                  : 'text-gray-300 hover:text-emerald-400'
              }`}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 shadow-lg">
        <div className="flex justify-around">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center py-2 flex-1 ${
              isActive('/') 
                ? 'text-emerald-500' 
                : 'text-gray-400 hover:text-emerald-400'
            }`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>
          
          <button
            onClick={() => navigate('/add')}
            className={`flex flex-col items-center py-2 flex-1 ${
              isActive('/add') 
                ? 'text-emerald-500' 
                : 'text-gray-400 hover:text-emerald-400'
            }`}
          >
            <PlusCircle size={20} />
            <span className="text-xs mt-1">Add</span>
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className={`flex flex-col items-center py-2 flex-1 ${
              isActive('/dashboard') 
                ? 'text-emerald-500' 
                : 'text-gray-400 hover:text-emerald-400'
            }`}
          >
            <PieChart size={20} />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          
          <button
            onClick={() => navigate('/settings')}
            className={`flex flex-col items-center py-2 flex-1 ${
              isActive('/settings') 
                ? 'text-emerald-500' 
                : 'text-gray-400 hover:text-emerald-400'
            }`}
          >
            <Settings size={20} />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;