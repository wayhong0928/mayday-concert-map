import type { Venue, ConcertRaw, Concert, Tour } from '../types/schema'

/**
 * Data Hydration Service
 * 負責載入並組裝關聯式資料，將 venue_ref 轉換為完整的場館資訊
 */

interface VenuesData {
  [key: string]: Venue
}

/**
 * 並行載入所有資料並進行 Hydration
 */
export async function fetchAllConcerts(): Promise<Concert[]> {
  try {
    // Parallel Fetching - 同時載入三個 JSON 檔案
    const [venuesData, concertsData] = await Promise.all([
      fetch('/data/venues.json').then((res) => res.json() as Promise<VenuesData>),
      fetch('/data/concerts.json').then((res) => res.json() as Promise<ConcertRaw[]>),
    ])

    // Runtime Join - 將場館資訊注入到演唱會資料中
    const hydratedConcerts: Concert[] = concertsData.map((concert) => {
      const venue = venuesData[concert.venue_ref]

      if (!venue) {
        console.warn(`Venue not found for concert ${concert.id}: ${concert.venue_ref}`)
        // Fallback to default values if venue not found
        return {
          ...concert,
          coordinates: [0, 0] as [number, number],
          city: 'Unknown',
          display_venue_name: concert.venue_name_historical || 'Unknown Venue',
        }
      }

      // Derived Fields
      const display_venue_name = concert.venue_name_historical || venue.name.zh

      return {
        ...concert,
        coordinates: venue.coordinates,
        city: venue.city,
        display_venue_name,
      }
    })

    return hydratedConcerts
  } catch (error) {
    console.error('Failed to fetch and hydrate concert data:', error)
    throw error
  }
}

/**
 * 載入場館資料（用於獨立場館資訊查詢）
 */
export async function fetchVenues(): Promise<VenuesData> {
  try {
    const response = await fetch('/data/venues.json')
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch venues:', error)
    throw error
  }
}

/**
 * 載入巡迴資料
 */
export async function fetchTours(): Promise<Tour[]> {
  try {
    const response = await fetch('/data/tours.json')
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch tours:', error)
    throw error
  }
}
