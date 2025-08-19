import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { 
  MegaphoneIcon, 
  NewspaperIcon, 
  CalendarIcon,
  TrophyIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import { MapPinIcon as MapPinIconSolid } from '@heroicons/react/24/solid'

const updateTypeIcons = {
  NEWS: NewspaperIcon,
  ANNOUNCEMENT: MegaphoneIcon,
  SCHEDULE_CHANGE: CalendarIcon,
  PLAYOFF_UPDATE: TrophyIcon
}

const updateTypeColors = {
  NEWS: 'bg-blue-100 text-blue-800',
  ANNOUNCEMENT: 'bg-green-100 text-green-800', 
  SCHEDULE_CHANGE: 'bg-yellow-100 text-yellow-800',
  PLAYOFF_UPDATE: 'bg-purple-100 text-purple-800'
}

export default function LeagueUpdates({ updates = [], showAll = false }) {
  const [expandedUpdates, setExpandedUpdates] = useState(new Set())

  const toggleUpdate = (updateId) => {
    const newExpanded = new Set(expandedUpdates)
    if (newExpanded.has(updateId)) {
      newExpanded.delete(updateId)
    } else {
      newExpanded.add(updateId)
    }
    setExpandedUpdates(newExpanded)
  }

  // Sort updates: pinned first, then by date
  const sortedUpdates = [...updates].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.publishedAt) - new Date(a.publishedAt)
  })

  const displayedUpdates = showAll ? sortedUpdates : sortedUpdates.slice(0, 5)

  if (updates.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-8">
          <NewspaperIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No league updates yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {displayedUpdates.map((update) => {
        const IconComponent = updateTypeIcons[update.updateType] || NewspaperIcon
        const isExpanded = expandedUpdates.has(update.id)
        const publishedDate = parseISO(update.publishedAt)
        const shouldShowPreview = update.content.length > 200

        return (
          <div key={update.id} className="card hover:shadow-md transition-shadow duration-200">
            <div className="card-body">
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`flex-shrink-0 p-2 rounded-lg ${updateTypeColors[update.updateType]}`}>
                  <IconComponent className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {update.isPinned && (
                          <MapPinIconSolid className="h-4 w-4 text-primary-500" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {update.title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{format(publishedDate, 'MMM d, yyyy')}</span>
                        <span>•</span>
                        <span>by {update.author?.firstName} {update.author?.lastName}</span>
                        {update.season && (
                          <>
                            <span>•</span>
                            <span>{update.season.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${updateTypeColors[update.updateType]}`}>
                      {update.updateType.replace('_', ' ').toLowerCase()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="prose prose-sm max-w-none">
                    {shouldShowPreview && !isExpanded ? (
                      <div>
                        <p className="text-gray-700 leading-relaxed">
                          {update.content.substring(0, 200)}...
                        </p>
                        <button
                          onClick={() => toggleUpdate(update.id)}
                          className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Read more
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div 
                          className="text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ 
                            __html: update.content.replace(/\n/g, '<br>') 
                          }}
                        />
                        {shouldShowPreview && (
                          <button
                            onClick={() => toggleUpdate(update.id)}
                            className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            Show less
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Image */}
                  {update.imageUrl && (
                    <div className="mt-3">
                      <img
                        src={update.imageUrl}
                        alt={update.title}
                        className="rounded-lg max-w-full h-auto"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {!showAll && sortedUpdates.length > 5 && (
        <div className="text-center">
          <a
            href="/updates"
            className="btn-outline"
          >
            View All Updates ({sortedUpdates.length})
          </a>
        </div>
      )}
    </div>
  )
}