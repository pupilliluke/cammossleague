export default function StatCard({ title, value, subtitle, color = 'primary', icon: Icon }) {
  const colors = {
    primary: 'text-primary-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    gray: 'text-gray-600'
  }

  const bgColors = {
    primary: 'bg-primary-50',
    green: 'bg-green-50',
    blue: 'bg-blue-50',
    red: 'bg-red-50',
    yellow: 'bg-yellow-50',
    purple: 'bg-purple-50',
    gray: 'bg-gray-50'
  }

  return (
    <div className={`text-center p-4 ${bgColors[color]} rounded-lg`}>
      {Icon && (
        <div className="flex justify-center mb-2">
          <Icon className={`h-6 w-6 ${colors[color]}`} />
        </div>
      )}
      <div className={`text-3xl font-bold ${colors[color]} mb-1`}>
        {value}
      </div>
      <div className="text-sm text-gray-600">{title}</div>
      {subtitle && (
        <div className="text-xs text-gray-500 mt-1">
          {subtitle}
        </div>
      )}
    </div>
  )
}