import React from 'react';

const CardActions = ({ 
  children, 
  className = "",
  hasBorder = true 
}) => {
  const borderClass = hasBorder ? "border-t border-gray-200" : "";
  
  return (
    <div className={`flex space-x-2 pt-4 ${borderClass} ${className}`}>
      {children}
    </div>
  );
};

export default CardActions;