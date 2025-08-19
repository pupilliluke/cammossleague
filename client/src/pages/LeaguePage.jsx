import { CalendarIcon } from '@heroicons/react/24/outline'

export default function LeaguePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h1>
        <p className="text-lg text-gray-600 mb-8">
          We're working hard to bring you the league dashboard. Check back soon!
        </p>
        <div className="text-sm text-gray-500">
          In the meantime, you can check out the teams and bracket sections.
        </div>
      </div>
    </div>
  )
}