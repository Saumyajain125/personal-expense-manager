import React from 'react';
import { format, subMonths, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthPickerProps {
  selectedMonth: Date;
  onChange: (date: Date) => void;
}

const MonthPicker: React.FC<MonthPickerProps> = ({ selectedMonth, onChange }) => {
  const handlePreviousMonth = () => {
    onChange(subMonths(selectedMonth, 1));
  };
  
  const handleNextMonth = () => {
    onChange(addMonths(selectedMonth, 1));
  };
  
  const currentMonth = format(selectedMonth, 'MMMM yyyy');
  
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <button
        onClick={handlePreviousMonth}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Previous month"
      >
        <ChevronLeft size={20} />
      </button>
      
      <h2 className="text-xl font-bold">{currentMonth}</h2>
      
      <button
        onClick={handleNextMonth}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Next month"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default MonthPicker;