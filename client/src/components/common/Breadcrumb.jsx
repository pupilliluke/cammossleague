import { Link } from 'react-router-dom'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="text-gray-400 hover:text-gray-500 transition-colors">
            <HomeIcon className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={item.name} className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" aria-hidden="true" />
            {index === items.length - 1 ? (
              <span className="text-sm font-medium text-gray-900" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}