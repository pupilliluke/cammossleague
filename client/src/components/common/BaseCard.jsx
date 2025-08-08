import React from 'react';

const BaseCard = ({ 
  children, 
  className = "", 
  hover = true,
  padding = "p-6",
  ...props 
}) => {
  const hoverClass = hover ? "hover:shadow-md transition-shadow duration-200" : "";
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${hoverClass} ${className}`}
      {...props}
    >
      <div className={`${padding}`}>
        {children}
      </div>
    </div>
  );
};

export default BaseCard;