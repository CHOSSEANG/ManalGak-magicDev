import apiClient from './client'
import type { CoordinateRouteRequest } from '@/types/route'

// 좌표 기반 이동시간 조회 (대중교통 + 자동차)
export const calculateRoutes = (meetingUuid: string, request: CoordinateRouteRequest) =>
  apiClient.post(`/v1/routes/${meetingUuid}/calculate`, request)