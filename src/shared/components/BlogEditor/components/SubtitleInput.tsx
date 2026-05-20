import React from 'react';

interface SubtitleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SubtitleInput: React.FC<SubtitleInputProps> = ({ value, onChange, placeholder = 'Enter subtitle or summary...' }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={2}
      className="w-full text-xl text-gray-500 font-medium focus:outline-none placeholder:text-gray-200 border-none bg-transparent resize-none mb-8"
      placeholder={placeholder}
    />
  );
};

export default SubtitleInput;
