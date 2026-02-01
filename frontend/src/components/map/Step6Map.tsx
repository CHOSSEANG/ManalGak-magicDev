// src/components/map/Step6Map.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'

interface MapRouteData {
  destination: {
    lat: number
    lng: number
    placeName: string
  }
  participants: Array<{
    participantId: number
    nickName: string
    profileImageUrl: string
    origin: {
      lat: number
      lng: number
      address: string
    }
    path: number[][] // [[lat, lng], ...]
    color: string
  }>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KakaoMapAny = any
type KakaoCustomOverlay = { setMap: (map: KakaoMapAny | null) => void }
type KakaoPolyline = { setMap: (map: KakaoMapAny | null) => void }

interface Step6MapProps {
  meetingUuid: string
  destLat: number
  destLng: number
  placeName: string
  className?: string
  style?: React.CSSProperties
  minHeight?: number | string
}

export default function Step6Map({
  meetingUuid,
  destLat,
  destLng,
  placeName,
  className,
  style,
  minHeight = 300,
}: Step6MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<KakaoMapAny | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [routeData, setRouteData] = useState<MapRouteData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const overlaysRef = useRef<KakaoCustomOverlay[]>([])
  const polylinesRef = useRef<KakaoPolyline[]>([])

  useEffect(() => {
    if (!meetingUuid) return
    if (!Number.isFinite(destLat) || !Number.isFinite(destLng)) return

    const fetchRoutes = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const res = await axios.get(
          `${API_BASE_URL}/v1/routes/map/${meetingUuid}/place`,
          {
            params: {
              destLat,
              destLng,
              placeName,
            },
            withCredentials: true,
          }
        )
        setRouteData(res.data?.data)
      } catch (err) {
        console.error('경로 조회 실패:', err)
        setError('경로를 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoutes()
  }, [meetingUuid, destLat, destLng, placeName])

  useEffect(() => {
    if (!mapRef.current || !routeData) return
    if (mapInstanceRef.current) return

    const kakao = window.kakao
    if (!kakao?.maps?.load) return

    kakao.maps.load(() => {
      if (mapInstanceRef.current) return

      const maps = kakao.maps
      if (!maps) return

      const map = new maps.Map(mapRef.current!, {
        center: new maps.LatLng(routeData.destination.lat, routeData.destination.lng),
        level: 6,
      })

      mapInstanceRef.current = map
      setIsMapLoaded(true)
    })
  }, [routeData])

  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current || !routeData) return

    const kakao = window.kakao
    if (!kakao?.maps) return

    const maps = kakao.maps
    const map = mapInstanceRef.current

    // 기존 오버레이 제거
    overlaysRef.current.forEach((overlay) => overlay.setMap(null))
    overlaysRef.current = []

    // 기존 폴리라인 제거
    polylinesRef.current.forEach((polyline) => polyline.setMap(null))
    polylinesRef.current = []

    const bounds = new maps.LatLngBounds()

    routeData.participants.forEach((participant) => {
      bounds.extend(new maps.LatLng(participant.origin.lat, participant.origin.lng))

      const profileContent = document.createElement('div')
      profileContent.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-50%);">
          <div style="
            width:44px;height:44px;border-radius:50%;
            background:linear-gradient(135deg,${participant.color},${adjustColor(participant.color, -20)});
            border:3px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
            display:flex;align-items:center;justify-content:center;
            color:white;font-weight:bold;font-size:16px;
            overflow:hidden;
          ">
            ${participant.profileImageUrl
              ? `<img src="${participant.profileImageUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.parentElement.textContent='${participant.nickName.charAt(0)}';" />`
              : participant.nickName.charAt(0)
            }
          </div>
          <div style="
            margin-top:4px;padding:2px 8px;
            background:${participant.color};color:white;
            font-size:11px;font-weight:600;
            border-radius:10px;white-space:nowrap;
          ">${participant.nickName}</div>
        </div>
      `

      const profileOverlay = new maps.CustomOverlay({
        position: new maps.LatLng(participant.origin.lat, participant.origin.lng),
        content: profileContent,
        yAnchor: 1,
      })
      profileOverlay.setMap(map)
      overlaysRef.current.push(profileOverlay)

      if (participant.path && participant.path.length > 0) {
        const linePath = participant.path.map(
          (coord) => new maps.LatLng(coord[0], coord[1])
        )

        const polyline = new maps.Polyline({
          path: linePath,
          strokeWeight: 4,
          strokeColor: participant.color,
          strokeOpacity: 0.8,
          strokeStyle: 'solid',
        })

        polyline.setMap(map)
        polylinesRef.current.push(polyline)
      }
    })

    bounds.extend(
      new maps.LatLng(routeData.destination.lat, routeData.destination.lng)
    )

    const placeContent = document.createElement('div')
    placeContent.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-50%);">
        <div style="
          width:52px;height:52px;border-radius:50%;
          background:linear-gradient(135deg,#FF6B6B,#ee5a5a);
          border:3px solid white;
          box-shadow:0 4px 12px rgba(255,107,107,0.4);
          display:flex;align-items:center;justify-content:center;
          font-size:24px;
        ">📍</div>
        <div style="
          margin-top:4px;padding:4px 12px;
          background:linear-gradient(135deg,#FF6B6B,#ee5a5a);
          color:white;font-size:12px;font-weight:700;
          border-radius:12px;white-space:nowrap;
          box-shadow:0 2px 8px rgba(255,107,107,0.3);
        ">${routeData.destination.placeName}</div>
      </div>
    `

    const placeOverlay = new maps.CustomOverlay({
      position: new maps.LatLng(routeData.destination.lat, routeData.destination.lng),
      content: placeContent,
      yAnchor: 1,
    })
    placeOverlay.setMap(map)
    overlaysRef.current.push(placeOverlay)

    map.setBounds(bounds)
  }, [isMapLoaded, routeData])

  if (isLoading) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          minHeight,
          background: '#e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          ...style,
        }}
      >
        <span className="text-sm text-gray-500">경로를 불러오는 중...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          minHeight,
          background: '#fef2f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          ...style,
        }}
      >
        <span className="text-sm text-red-500">{error}</span>
      </div>
    )
  }

  return (
    <div
      ref={mapRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight,
        background: '#e5e7eb',
        ...style,
      }}
    />
  )
}

function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount))
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}
