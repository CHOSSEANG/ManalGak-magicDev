import apiClient from './client';

export const getRoutes = (meetingUuid: string) => apiClient.get(`/meetings/${meetingUuid}/routes`);
