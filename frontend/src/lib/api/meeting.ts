// src/lib/api/meeting.ts

import apiClient from "./client";

export interface CreateMeetingResponse {
  meetingId: string;
}

export const getMeetings = () => apiClient.get("/meetings");

export const createMeeting = (
  payload: unknown,
): Promise<CreateMeetingResponse> => {
  return apiClient.post("/meetings", payload);
};

export const getMeeting = (meetingUuid: string) =>
  apiClient.get(`/meetings/${meetingUuid}`);

export const getMeetingDetail = (meetingUuid: string) =>
  apiClient.get(`/meetings/${meetingUuid}`);
