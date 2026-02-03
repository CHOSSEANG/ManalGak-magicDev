// src/lib/api/route.ts
import client from './client'

export async function calculateRoutes(
  meetingUuid: string,
  payload: { latitude: number; longitude: number }
) {
  return client.post(
    `/v1/routes/${meetingUuid}/calculate`,
    payload,
    {
      silent: true, // ✅ 이동시간 계산은 실패 허용
    }
  )
}


// import apiClient from './client'
// import type { CoordinateRouteRequest } from '@/types/route'

// // 좌표 기반 이동시간 조회 (대중교통 + 자동차)
// export const calculateRoutes = (meetingUuid: string, request: CoordinateRouteRequest) =>
//   apiClient.post(`/v1/routes/${meetingUuid}/calculate`, request)
