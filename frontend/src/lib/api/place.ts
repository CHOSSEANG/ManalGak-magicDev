import apiClient from './client'

interface CandidatePlacesParams {
  purpose?: string
  limit?: number
}

export const getCandidatePlaces = (
  meetingUuid: string,
  candidateId: number,
  params?: CandidatePlacesParams
) =>
  apiClient.get(
    `/v1/meetings/${meetingUuid}/candidates/${candidateId}`,
    params ? { params } : undefined
  )

// 선택된(확정된) 장소 조회
export const getSelectedPlace = (meetingUuid: string) =>
  apiClient.get(`/v1/meetings/${meetingUuid}/place`)

export const getCandidateSummary = (
  meetingUuid: string,
  candidateId: number,
  tone?: string
) =>
  apiClient.get(
    `/v1/meetings/${meetingUuid}/candidates/${candidateId}/summary`,
    tone ? { params: { tone } } : undefined
  )
