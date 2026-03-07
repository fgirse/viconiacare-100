'use client'
import { useEffect, useRef } from 'react'
import type { Map as LeafletMap } from 'leaflet'

export interface Stop {
  lat:     number
  lng:     number
  label:   string
  address: string
  status?: 'pending' | 'completed' | 'skipped' | 'no_access'
  order?:  number
}

interface Props {
  stops:         Stop[]
  staffPosition?: { lat: number; lng: number }
  className?:    string
}

const STATUS_COLOR: Record<string, string> = {
  completed: '#0f766e',
  pending:   '#ca8a04',
  skipped:   '#a8a29e',
  no_access: '#ef4444',
}

export default function RouteMap({ stops, staffPosition, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<LeafletMap | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    ;(async () => {
      const L = (await import('leaflet')).default

      // Fix Leaflet default icons
      const iconDefaultPrototype = L.Icon.Default.prototype as typeof L.Icon.Default.prototype & {
        _getIconUrl?: () => string
      }
      delete iconDefaultPrototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      // Create map
      const map = L.map(containerRef.current!, { zoomControl: true, scrollWheelZoom: false })
      mapRef.current = map

      // OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      const bounds: [number, number][] = []

      // Add stop markers
      stops.forEach((stop, i) => {
        const color = STATUS_COLOR[stop.status || 'pending']

        const icon = L.divIcon({
          html: `
            <div style="
              width:32px; height:32px;
              background:${color};
              border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              border:3px solid white;
              box-shadow:0 2px 8px rgba(0,0,0,.25);
              display:flex; align-items:center; justify-content:center;
            ">
              <span style="transform:rotate(45deg); color:white; font-size:12px; font-weight:700; font-family:sans-serif;">
                ${i + 1}
              </span>
            </div>`,
          className:  '',
          iconSize:   [32, 32],
          iconAnchor: [16, 32],
          popupAnchor:[0, -36],
        })

        const statusLabel: Record<string,string> = {
          completed:'✓ Abgeschlossen', pending:'⏳ Ausstehend',
          skipped:'— Übersprungen', no_access:'⛔ Kein Zutritt',
        }

        L.marker([stop.lat, stop.lng], { icon })
          .bindPopup(`
            <div style="font-family:sans-serif; min-width:160px; padding:4px">
              <div style="font-weight:700; font-size:13px; color:#1c1917; margin-bottom:4px">
                ${stop.label}
              </div>
              <div style="font-size:11px; color:#78716c; margin-bottom:6px">${stop.address}</div>
              <div style="font-size:11px; font-weight:600; color:${color}">
                ${statusLabel[stop.status || 'pending']}
              </div>
            </div>`)
          .addTo(map)

        bounds.push([stop.lat, stop.lng])
      })

      // Route line
      if (bounds.length > 1) {
        L.polyline(bounds, { color: '#0f766e', weight: 3, opacity: 0.65, dashArray: '8 6' }).addTo(map)
      }

      // Staff position
      if (staffPosition) {
        const staffIcon = L.divIcon({
          html: `<div style="
            width:14px; height:14px; background:#6366f1;
            border-radius:50%; border:3px solid white;
            box-shadow:0 0 0 4px rgba(99,102,241,.25);
          "></div>`,
          className:  '',
          iconSize:   [14, 14],
          iconAnchor: [7, 7],
        })
        L.marker([staffPosition.lat, staffPosition.lng], { icon: staffIcon })
          .bindPopup('<strong>Aktuelle Position</strong>')
          .addTo(map)
        bounds.push([staffPosition.lat, staffPosition.lng])
      }

      if (bounds.length > 0) {
        map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40] })
      }
    })()

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [stops, staffPosition])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={containerRef} className={`w-full rounded-xl overflow-hidden ${className}`} style={{ minHeight: 400 }} />
    </>
  )
}
