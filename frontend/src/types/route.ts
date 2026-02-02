// 대중교통 경로 정보
export interface RouteInfo {
  participantName: string
  path: string
  travelTime: number
  transferCount: number
  transportType: string
}

// 자동차 경로 정보
export interface CarRouteInfo {
  participantId: number
  participantName: string
  profileImageUrl?: string
  transportType: string
  travelTime: number
  distance: number
}

// 경로 통계
export interface RouteStatistics {
  averageTravelTime: number
  maxTravelTime: number
  minTravelTime: number
  totalTransfers: number
  mostFrequentTransport: string
}

// 경로 응답
export interface RouteResponse {
  routes?: RouteInfo[]
  carRoutes?: CarRouteInfo[]
  statistics?: RouteStatistics
}

// 좌표 기반 경로 요청
export interface CoordinateRouteRequest {
  latitude: number
  longitude: number
}