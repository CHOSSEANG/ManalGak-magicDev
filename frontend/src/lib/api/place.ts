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

export const getCandidateSummary = (
  meetingUuid: string,
  candidateId: number,
  tone?: string
) =>
  apiClient.get(
    `/v1/meetings/${meetingUuid}/candidates/${candidateId}/summary`,
    tone ? { params: { tone } } : undefined
  )
