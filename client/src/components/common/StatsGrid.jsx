import React from 'react';

const StatsGrid = ({ 
  stats = [],
  columns = 4,
  className = ""
}) => {
  const gridClass = `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-4`;
  
  return (
    <div className={`${gridClass} ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;