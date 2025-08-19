import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { seasonService } from '../../services/api'
import { useSeason } from '../../contexts/SeasonContext'

export default function SeasonSelector({ className = '' }) {
  const { activeSeason, setActiveSeason } = useSeason()
  
  // Fetch all seasons
  const { data: seasons = [], isLoading } = useQuery({
    queryKey: ['seasons'],
    queryFn: () => seasonService.getAllSeasons(),
  })

  if (isLoading || !seasons.length) {
    return null
  }

  return (
    <div className={className}>
      <Listbox value={activeSeason} onChange={setActiveSeason}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-300 sm:text-sm border border-gray-300 hover:border-gray-400 transition-colors">
            <span className="block truncate">
              {activeSeason?.name || 'Select Season'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {seasons.map((season) => (
                <Listbox.Option
                  key={season.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                    }`
                  }
                  value={season}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        <span className="flex items-center justify-between">
                          <span>
                            {season.name}
                            {season.isActive && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            )}
                          </span>
                          <span className="text-sm text-gray-500">
                            {season.year}
                          </span>
                        </span>
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

// Quick Season Filter Buttons Component
export function SeasonFilterButtons({ onSeasonChange, activeSeason, className = '' }) {
  const { data: seasons = [] } = useQuery({
    queryKey: ['seasons'],
    queryFn: () => seasonService.getAllSeasons(),
  })

  if (!seasons.length) {
    return null
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {seasons.map((season) => (
        <button
          key={season.id}
          onClick={() => onSeasonChange(season)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeSeason?.id === season.id
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {season.year}
          {season.isActive && (
            <span className="ml-1 w-2 h-2 bg-green-400 rounded-full inline-block"></span>
          )}
        </button>
      ))}
    </div>
  )
}