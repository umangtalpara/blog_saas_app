import React, { useState } from 'react';
import { Folder, X, Plus } from 'lucide-react';

interface CategorySelectorProps {
  value: string[];
  onChange: (categories: string[]) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const addCategory = () => {
    const category = inputValue.trim();
    if (category && !value.includes(category)) {
      onChange([...value, category]);
    }
    setInputValue('');
  };

  const removeCategory = (catToRemove: string) => {
    onChange(value.filter(cat => cat !== catToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <Folder size={16} />
        Categories
      </label>
      <div className="space-y-2 mb-3">
        {value.map(cat => (
          <div 
            key={cat} 
            className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-50 text-sm text-gray-700 border border-gray-100"
          >
            {cat}
            <button 
              onClick={() => removeCategory(cat)}
              className="text-gray-400 hover:text-red-500 focus:outline-none"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="New category..."
        />
        <button 
          onClick={addCategory}
          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

export default CategorySelector;
