import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const FilterSelect = ({ 
  value, 
  onChange, 
  options = [],
  placeholder = "All",
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

export default FilterSelect;