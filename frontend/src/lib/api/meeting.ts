// src/lib/api/meeting.ts

import apiClient from './client'

export const getMeetings = () => apiClient.get('/meetings')
export const createMeeting = (payload: unknown) =>
  apiClient.post('/meetings', payload)
export const getMeeting = (meetingUuid: string) =>
  apiClient.get(`/meetings/${meetingUuid}`)
export const getMeetingDetail = (meetingUuid: string) =>
  apiClient.get(`/v1/meetings/${meetingUuid}`)
