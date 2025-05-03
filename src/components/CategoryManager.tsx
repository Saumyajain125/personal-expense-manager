import React, { useState } from 'react';
import { Edit, Trash2, Plus, Check, X } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { Category } from '../types';
import { generateRandomColor } from '../utils';

const CategoryManager: React.FC = () => {
  const { state, addCategory, editCategory, deleteCategory } = useExpense();
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
    color: generateRandomColor(),
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      addCategory(newCategory);
      setNewCategory({ name: '', color: generateRandomColor() });
      setShowForm(false);
    }
  };
  
  const handleUpdateCategory = () => {
    if (editingCategory && editingCategory.name.trim()) {
      editCategory(editingCategory);
      setEditingCategory(null);
    }
  };
  
  const handleDeleteCategory = (id: string) => {
    // Check if category is used in any expense
    const isUsed = state.expenses.some((expense) => expense.categoryId === id);
    
    if (isUsed) {
      alert('This category is being used by some expenses and cannot be deleted.');
      return;
    }
    
    deleteCategory(id);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Manage Categories</h3>
      
      <div className="space-y-4">
        {state.categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
          >
            {editingCategory?.id === category.id ? (
              <div className="flex flex-1 space-x-2">
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  className="flex-1 px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="color"
                  value={editingCategory.color}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, color: e.target.value })
                  }
                  className="w-8 h-8 p-0 border-0 rounded-md cursor-pointer"
                />
                <button
                  onClick={handleUpdateCategory}
                  className="p-1 text-green-500 hover:text-green-600"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="p-1 text-red-500 hover:text-red-600"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span>{category.name}</span>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      
      {showForm ? (
        <div className="mt-4 p-3 border rounded-lg dark:border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="Category name"
              className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="color"
              value={newCategory.color}
              onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
              className="w-10 h-10 p-0 border-0 rounded-md cursor-pointer"
            />
            <button
              onClick={handleAddCategory}
              className="px-3 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
              <Check size={18} />
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-2 bg-gray-300 dark:bg-gray-700 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 flex items-center text-emerald-500 hover:text-emerald-600"
        >
          <Plus size={18} className="mr-1" />
          Add Category
        </button>
      )}
    </div>
  );
};

export default CategoryManager;