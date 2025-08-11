import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { useSeason } from '../../contexts/SeasonContext'
import LoadingSpinner from './LoadingSpinner'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SeasonDropdown({ className = '' }) {
  const { 
    allSeasons, 
    allSeasonsLoading, 
    selectedSeason, 
    selectedSeasonId, 
    setSelectedSeasonId, 
    formatSeasonName,
    getSeasonStatus 
  } = useSeason()

  if (allSeasonsLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <LoadingSpinner size="sm" />
        <span className="text-sm text-gray-500">Loading seasons...</span>
      </div>
    )
  }

  if (!allSeasons || allSeasons.length === 0) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        No seasons available
      </div>
    )
  }

  return (
    <div className={className}>
      <Listbox value={selectedSeasonId} onChange={setSelectedSeasonId}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span className="block truncate">
                {selectedSeason ? formatSeasonName(selectedSeason) : 'Select season...'}
              </span>
              {selectedSeason && (
                <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  getSeasonStatus(selectedSeason) === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : getSeasonStatus(selectedSeason) === 'upcoming'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {getSeasonStatus(selectedSeason)}
                </span>
              )}
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {allSeasons.map((season) => (
                <Listbox.Option
                  key={season.id}
                  className={({ active }) =>
                    classNames(
                      active ? 'text-white bg-primary-600' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-3 pr-9'
                    )
                  }
                  value={season.id}
                >
                  {({ selected, active }) => (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CalendarIcon className={`h-4 w-4 mr-2 ${active ? 'text-white' : 'text-gray-400'}`} />
                          <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                            {formatSeasonName(season)}
                          </span>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          active 
                            ? 'bg-white/20 text-white' 
                            : getSeasonStatus(season) === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : getSeasonStatus(season) === 'upcoming'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getSeasonStatus(season)}
                        </span>
                      </div>

                      {selected ? (
                        <span
                          className={classNames(
                            active ? 'text-white' : 'text-primary-600',
                            'absolute inset-y-0 right-0 flex items-center pr-4'
                          )}
                        >
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