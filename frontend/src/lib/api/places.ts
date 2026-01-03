import apiClient from './client';

export const getPlaces = (meetingUuid: string) => apiClient.get(`/meetings/${meetingUuid}/places`);
