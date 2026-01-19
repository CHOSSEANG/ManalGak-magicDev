// src/lib/api/meeting.ts

import apiClient from './client'

export const getMeetings = () => apiClient.get('/meetings')
export const createMeeting = (payload: unknown) =>
  apiClient.post('/meetings', payload)
export const getMeeting = (meetingUuid: string) =>
  apiClient.get(`/meetings/${meetingUuid}`)
export const getMeetingDetail = (meetingUuid: string) =>
  apiClient.get(`/v1/meetings/${meetingUuid}`)
export const getMeetingCandidate = (
  meetingUuid: string,
  candidateId: string
) => apiClient.get(`/v1/meetings/${meetingUuid}/candidates/${candidateId}`)
export const getMeetingLastTrain = (meetingUuid: string) =>
  apiClient.get(`/v1/meetings/${meetingUuid}/last-train`)
