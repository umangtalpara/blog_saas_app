import React from 'react';

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TitleInput: React.FC<TitleInputProps> = ({ value, onChange, placeholder = 'Enter Title' }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-5xl font-black focus:outline-none placeholder:text-gray-300 border-none bg-transparent mb-4"
      placeholder={placeholder}
    />
  );
};

export default TitleInput;
