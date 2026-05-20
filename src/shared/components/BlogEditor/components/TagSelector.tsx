import React, { useState } from 'react';
import { Tag as TagIcon, X, Plus } from 'lucide-react';

interface TagSelectorProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = inputValue.trim().toLowerCase();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <TagIcon size={16} />
        Tags
      </label>
      <div className="flex flex-wrap gap-2 mb-3">
        {value.map(tag => (
          <span 
            key={tag} 
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
          >
            {tag}
            <button 
              onClick={() => removeTag(tag)}
              className="ml-1 text-blue-400 hover:text-blue-600 focus:outline-none"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Add tags... (press Enter)"
        />
        <button 
          onClick={addTag}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

export default TagSelector;
