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
    path: number[][]
    color: string
  }>
}

type KakaoMap = kakao.maps.Map
type KakaoCustomOverlay = kakao.maps.CustomOverlay
type KakaoPolyline = kakao.maps.Polyline
type KakaoMapWithZoomable = KakaoMap & { setZoomable: (zoomable: boolean) => void }

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
  const mapInstanceRef = useRef<KakaoMap | null>(null)

  const overlaysRef = useRef<KakaoCustomOverlay[]>([])
  const polylinesRef = useRef<KakaoPolyline[]>([])

  const [routeData, setRouteData] = useState<MapRouteData | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ------------------------------------------------------------------
   * 1️⃣ 경로 데이터 조회
   * ------------------------------------------------------------------ */
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
            params: { destLat, destLng, placeName },
            withCredentials: true,
          }
        )
        setRouteData(res.data?.data ?? null)
      } catch (e) {
        console.error('경로 조회 실패', e)
        setError('경로를 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoutes()
  }, [meetingUuid, destLat, destLng, placeName])

  /* ------------------------------------------------------------------
   * 2️⃣ 지도 생성 (드래그 여기서 설정)
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!mapRef.current || !routeData) return
    if (mapInstanceRef.current) return

    const kakao = window.kakao
    if (!kakao?.maps?.load) return

    kakao.maps.load(() => {
      if (mapInstanceRef.current) return

      const map = new kakao.maps.Map(mapRef.current!, {
        center: new kakao.maps.LatLng(
          routeData.destination.lat,
          routeData.destination.lng
        ),
        level: 4,
      })

      // ✅ 드래그 활성화 (any ❌)
      map.setDraggable(true)
      // ✅ 확대/축소 활성화 (휠/핀치)
      ;(map as unknown as KakaoMapWithZoomable).setZoomable(true)

      mapInstanceRef.current = map
      setIsMapLoaded(true)
    })
  }, [routeData])

  /* ------------------------------------------------------------------
   * 3️⃣ 오버레이 / 경로 렌더링
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current || !routeData) return

    const map = mapInstanceRef.current
    const bounds = new kakao.maps.LatLngBounds()

    // 기존 제거
    overlaysRef.current.forEach(o => o.setMap(null))
    overlaysRef.current = []
    polylinesRef.current.forEach(p => p.setMap(null))
    polylinesRef.current = []

    routeData.participants.forEach(p => {
      const origin = new kakao.maps.LatLng(p.origin.lat, p.origin.lng)
      bounds.extend(origin)

      const overlay = new kakao.maps.CustomOverlay({
        position: origin,
        content: `<div style="background:${p.color};color:#fff;padding:4px 8px;border-radius:8px">${p.nickName}</div>`,
        yAnchor: 1,
      })

      overlay.setMap(map)
      overlaysRef.current.push(overlay)

      if (p.path?.length) {
        const linePath = p.path.map(
          ([lat, lng]) => new kakao.maps.LatLng(lat, lng)
        )

        const polyline = new kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 4,
          strokeColor: p.color,
          strokeOpacity: 0.8,
        })

        polyline.setMap(map)
        polylinesRef.current.push(polyline)
      }
    })

    bounds.extend(
      new kakao.maps.LatLng(
        routeData.destination.lat,
        routeData.destination.lng
      )
    )

    map.setBounds(bounds)
  }, [isMapLoaded, routeData])

  /* ------------------------------------------------------------------ */

  if (isLoading) {
    return (
      <div
        className={className}
        style={{ minHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        로딩 중…
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={className}
        style={{ minHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {error}
      </div>
    )
  }

  return (
    <div
      ref={mapRef}
      className={className}
      style={{ width: '100%', height: '100%', minHeight, ...style }}
    />
  )
}
