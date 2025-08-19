import React from 'react';
import { UserIcon } from '@heroicons/react/24/solid';

const CardImage = ({ 
  src, 
  alt, 
  fallbackIcon: FallbackIcon = UserIcon,
  size = "w-16 h-16",
  className = ""
}) => {
  const [imageError, setImageError] = React.useState(false);
  
  return (
    <div className={`${size} ${className} flex-shrink-0`}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className={`${size} rounded-full object-cover`}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`${size} bg-gray-100 rounded-full flex items-center justify-center`}>
          <FallbackIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default CardImage;