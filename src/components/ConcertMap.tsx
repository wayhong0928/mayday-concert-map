import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Concert } from '../types/schema'

// 修正 Leaflet Default Icon 問題
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

interface ConcertMapProps {
  concerts: Concert[]
  onConcertSelect: (concert: Concert) => void
}

export default function ConcertMap({ concerts, onConcertSelect }: ConcertMapProps) {
  // 自定義 Cluster Icon（五月天藍半透明圓圈）
  const createClusterCustomIcon = (cluster: any) => {
    const count = cluster.getChildCount()
    const size = count < 10 ? 40 : count < 100 ? 50 : 60

    return L.divIcon({
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: rgba(0, 150, 255, 0.6);
          border: 3px solid rgba(0, 150, 255, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${size > 40 ? '16px' : '14px'};
          box-shadow: 0 0 15px rgba(0, 150, 255, 0.5);
        ">
          ${count}
        </div>
      `,
      className: 'custom-cluster-icon',
      iconSize: L.point(size, size),
    })
  }

  return (
    <MapContainer
      center={[23.5, 121]}
      zoom={7}
      style={{ width: '100%', height: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <MarkerClusterGroup
        iconCreateFunction={createClusterCustomIcon}
        chunkedLoading
        maxClusterRadius={80}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
      >
        {concerts.map((concert) => (
          <Marker
            key={concert.id}
            position={concert.coordinates}
            eventHandlers={{
              click: () => {
                onConcertSelect(concert)
              },
            }}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  )
}
