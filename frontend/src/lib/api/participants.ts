import apiClient from './client';

export const addParticipant = (meetingUuid: string, payload: unknown) => apiClient.post(`/meetings/${meetingUuid}/participants`, payload);
export const listParticipants = (meetingUuid: string) => apiClient.get(`/meetings/${meetingUuid}/participants`);
