import { useState, useEffect } from 'react'
import { Drawer } from 'vaul'
import ConcertMap from './components/ConcertMap'
import ConcertDetail from './components/ConcertDetail'
import type { Concert, Tour } from './types/schema'
import { cn } from './utils/cn'
import { useMediaQuery } from './hooks/useMediaQuery'
import { fetchAllConcerts, fetchTours } from './utils/dataLoader'

function App() {
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [tours, setTours] = useState<Tour[]>([])
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  // 載入所有演唱會資料與巡迴資料
  useEffect(() => {
    Promise.all([fetchAllConcerts(), fetchTours()])
      .then(([concertsData, toursData]) => {
        setConcerts(concertsData)
        setTours(toursData)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load data:', err)
        setError('無法載入資料，請重新整理頁面')
        setIsLoading(false)
      })
  }, [])

  // Loading 狀態
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-mayday-blue border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">載入演唱會資料中...</p>
        </div>
      </div>
    )
  }

  // Error 狀態
  if (error) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center space-y-4 p-6">
          <div className="text-6xl">⚠️</div>
          <p className="text-red-400 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-mayday-blue text-white rounded-lg hover:bg-mayday-blue/80 transition-colors"
          >
            重新載入
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-900">
      {/* Desktop Layout */}
      <div className="hidden md:flex h-full">
        {/* Sidebar */}
        <aside
          className={cn(
            'w-96 h-full flex-shrink-0',
            'overflow-y-auto overflow-x-hidden',
            'bg-black/40 backdrop-blur-md border-r border-gray-800',
            'z-10'
          )}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          {selectedConcert ? (
            <ConcertDetail concert={selectedConcert} tours={tours} />
          ) : (
            <div className="p-6 text-gray-400">
              <h2 className="text-xl font-bold text-white mb-2">Mayday Chronicle</h2>
              <p className="text-sm">點擊地圖上的標記查看演唱會詳情</p>
            </div>
          )}
        </aside>

        {/* Map Container */}
        <div className="flex-1 relative">
          <ConcertMap concerts={concerts} onConcertSelect={setSelectedConcert} />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-full relative">
        <ConcertMap concerts={concerts} onConcertSelect={setSelectedConcert} />

        {/* Bottom Drawer */}
        <Drawer.Root open={!!selectedConcert && !isDesktop} onOpenChange={(open) => !open && setSelectedConcert(null)}>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40 md:hidden" />
            <Drawer.Content
              className={cn(
                'fixed bottom-0 left-0 right-0 z-50',
                'bg-gray-900/95 backdrop-blur-lg',
                'rounded-t-2xl border-t border-gray-700',
                'flex flex-col',
                'focus:outline-none',
                'md:hidden'
              )}
              style={{ maxHeight: '85vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-shrink-0">
                <div className="mx-auto w-12 h-1.5 bg-gray-600 rounded-full my-4" />
                <Drawer.Title className="sr-only">
                  {selectedConcert?.display_venue_name || '演唱會詳情'}
                </Drawer.Title>
                <Drawer.Description className="sr-only">
                  查看演唱會的詳細資訊、歌單變動與相關連結
                </Drawer.Description>
              </div>
              <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
                {selectedConcert && <ConcertDetail concert={selectedConcert} tours={tours} />}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </div>
  )
}

export default App
