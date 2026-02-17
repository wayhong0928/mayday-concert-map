import { useMemo } from 'react'
import type { Concert, Tour } from '../types/schema'
import { getConcertSetlist, type SetlistItem } from '../utils/setlistHelper'
import { Music, MapPin, Clock, ExternalLink } from 'lucide-react'

interface ConcertDetailProps {
  concert: Concert
  tours: Tour[]
}

export default function ConcertDetail({ concert, tours }: ConcertDetailProps) {
  // 使用 useMemo 計算當前場次的 tour 和 setlist
  const tour = useMemo(
    () => tours.find((t) => t.id === concert.tour_ref) || null,
    [tours, concert.tour_ref]
  )

  const setlist = useMemo<SetlistItem[]>(
    () => (tour ? getConcertSetlist(tour, concert) : []),
    [tour, concert]
  )

  return (
    <div>
      {/* Header */}
      <div className="p-6 space-y-3 border-b border-gray-700/50">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-mayday-blue mt-1 flex-shrink-0" />
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
              {concert.display_venue_name}
            </h2>
            <p className="text-gray-400 text-sm mt-1">{concert.city}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-mayday-blue font-semibold">
          <Clock className="w-4 h-4" />
          <span>{concert.date}</span>
          {concert.time_info?.start_time && (
            <span className="text-gray-400 text-sm ml-2">
              {concert.time_info.start_time}
              {concert.time_info.end_time && ` - ${concert.time_info.end_time}`}
            </span>
          )}
        </div>

        {tour && (
          <div className="text-sm text-gray-400">
            {tour.name.zh} · {tour.period}
          </div>
        )}
      </div>

      {/* Setlist Timeline */}
      {setlist.length > 0 && (
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-white" />
            <h3 className="text-lg font-semibold text-white">演出歌單</h3>
          </div>

          <div className="space-y-2">
            {setlist.map((song, index) => (
              <div
                key={index}
                className={`
                  flex items-start gap-3 p-3 rounded-lg transition-colors
                  ${
                    song.is_encore
                      ? 'bg-purple-500/10 border border-purple-500/30'
                      : song.is_added
                      ? 'bg-yellow-500/10 border border-yellow-500/30'
                      : 'bg-gray-800/30 hover:bg-gray-800/50'
                  }
                `}
              >
                {/* Timeline Dot */}
                <div className="mt-1.5 flex-shrink-0">
                  <div
                    className={`
                      w-2 h-2 rounded-full
                      ${
                        song.is_encore
                          ? 'bg-purple-400'
                          : song.is_added
                          ? 'bg-yellow-400'
                          : 'bg-gray-500'
                      }
                    `}
                  />
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-medium">{song.name}</span>
                    
                    {/* 安可標籤 */}
                    {song.is_encore && (
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                        {song.encore_level ? `第${song.encore_level}安` : '安可'}
                      </span>
                    )}
                    
                    {/* 新增曲目標籤 */}
                    {song.is_added && !song.is_request && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
                        變動曲目
                      </span>
                    )}
                    
                    {/* 點歌標籤 */}
                    {song.is_request && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full">
                        點歌
                      </span>
                    )}
                    
                    {/* 組曲標籤 */}
                    {song.is_medley && (
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                        組曲
                      </span>
                    )}
                    
                    {/* 翻唱標籤 */}
                    {song.is_cover && (
                      <span className="px-2 py-0.5 bg-gray-500/20 text-gray-300 text-xs rounded-full">
                        翻唱
                      </span>
                    )}
                  </div>
                  
                  {/* 備註 */}
                  {song.note && (
                    <p className="text-xs text-gray-400 mt-1">{song.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links Section */}
      {concert.links && (concert.links.youtube_playlist || concert.links.news_reports) && (
        <div className="p-6 pt-0 space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            相關連結
          </h3>

          <div className="space-y-2">
            {concert.links.youtube_playlist && (
              <a
                href={concert.links.youtube_playlist}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center gap-3 p-3 rounded-lg
                  bg-red-500/10 border border-red-500/30
                  hover:bg-red-500/20 transition-colors
                  group
                "
              >
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🎥</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium group-hover:text-red-300 transition-colors">
                    YouTube 播放清單
                  </p>
                  <p className="text-xs text-gray-400 truncate">觀看演唱會精華片段</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-red-300 transition-colors" />
              </a>
            )}

            {concert.links.news_reports && concert.links.news_reports.length > 0 && (
              <div className="space-y-2">
                {concert.links.news_reports.map((news, idx) => (
                  <a
                    key={idx}
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex items-center gap-3 p-3 rounded-lg
                      bg-blue-500/10 border border-blue-500/30
                      hover:bg-blue-500/20 transition-colors
                      group
                    "
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">📰</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium group-hover:text-blue-300 transition-colors line-clamp-2">
                        {news.title}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-300 transition-colors" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
