import { createContext, useContext, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { seasonService } from '../services/api'

const SeasonContext = createContext({})

export const useSeason = () => {
  const context = useContext(SeasonContext)
  if (!context) {
    throw new Error('useSeason must be used within a SeasonProvider')
  }
  return context
}

export const SeasonProvider = ({ children }) => {
  const [selectedSeasonId, setSelectedSeasonId] = useState(null)

  // Fetch active season
  const { 
    data: activeSeason, 
    isLoading: activeSeasonLoading,
    error: activeSeasonError 
  } = useQuery({
    queryKey: ['season', 'active'],
    queryFn: seasonService.getActiveSeason,
    retry: 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  // Fetch most recent season (for default selection)
  const { 
    data: mostRecentSeason, 
    isLoading: mostRecentSeasonLoading 
  } = useQuery({
    queryKey: ['season', 'recent'],
    queryFn: seasonService.getMostRecentSeason,
    retry: 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  // Fetch all seasons for historical data
  const { 
    data: allSeasons = [], 
    isLoading: allSeasonsLoading 
  } = useQuery({
    queryKey: ['seasons', 'all'],
    queryFn: () => seasonService.getAllSeasons(),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Set most recent season as default selection
  useEffect(() => {
    if (mostRecentSeason && !selectedSeasonId) {
      setSelectedSeasonId(mostRecentSeason.id)
    }
  }, [mostRecentSeason, selectedSeasonId])

  // Get currently selected season data
  const selectedSeason = selectedSeasonId 
    ? allSeasons.find(season => season.id === selectedSeasonId) || mostRecentSeason
    : mostRecentSeason

  const value = {
    // Active season data
    activeSeason,
    activeSeasonLoading,
    activeSeasonError,
    
    // Most recent season data
    mostRecentSeason,
    mostRecentSeasonLoading,
    
    // All seasons
    allSeasons,
    allSeasonsLoading,
    
    // Selected season (for historical view)
    selectedSeason,
    selectedSeasonId,
    setSelectedSeasonId,
    
    // Helper methods
    isActiveSeason: selectedSeasonId === activeSeason?.id,
    isMostRecentSeason: selectedSeasonId === mostRecentSeason?.id,
    isRegistrationOpen: activeSeason?.isRegistrationOpen && activeSeason?.isActive,
    
    // Season status helpers
    getSeasonStatus: (season) => {
      if (!season) return 'unknown'
      
      const now = new Date()
      const startDate = new Date(season.startDate)
      const endDate = new Date(season.endDate)
      
      if (now < startDate) return 'upcoming'
      if (now > endDate) return 'completed'
      if (season.isActive) return 'active'
      return 'inactive'
    },
    
    formatSeasonName: (season) => {
      if (!season) return 'Unknown Season'
      return `${season.name} (${season.year})`
    }
  }

  return (
    <SeasonContext.Provider value={value}>
      {children}
    </SeasonContext.Provider>
  )
}