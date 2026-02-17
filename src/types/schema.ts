// Venue 場館資訊
export interface Venue {
  id: string
  name: {
    zh: string
    en: string
  }
  city: string
  coordinates: [number, number]
  aliases: string[]
}

// Song 歌曲資訊
export interface Song {
  seq?: number // 在標準歌單中的序號
  name: string
  is_medley?: boolean
  is_cover?: boolean
  is_request?: boolean
  note?: string
}

// Tour 巡迴資訊
export interface Tour {
  id: string
  name: {
    zh: string
    en: string
  }
  period: string
  description?: string
  standard_main_set: Song[]
}

// Concert 演唱會場次 (Raw from JSON)
export interface ConcertRaw {
  id: string
  tour_ref: string
  venue_ref: string
  venue_name_historical?: string
  date: string
  time_info?: {
    start_time?: string
    end_time?: string
    timezone: string
  }
  main_set_modifications?: {
    removed_seq?: number[]
    added?: {
      after_seq: number
      songs: Song[]
    }[]
  }
  encores?: {
    level: number
    songs: Song[]
  }[]
  links?: {
    youtube_playlist?: string
    news_reports?: {
      title: string
      url: string
    }[]
  }
}

// Concert 演唱會場次 (Hydrated with Venue data)
export interface Concert extends ConcertRaw {
  // Hydrated fields from Venue
  coordinates: [number, number]
  city: string
  display_venue_name: string
}
