export type MeetingPurpose = 'DINING' | 'DATE' | 'STUDY' | 'GENERAL';

export type MeetingStatus = 'PENDING' | 'CALCULATING' | 'COMPLETED' | 'EXPIRED';

export interface Meeting {
  meetingId: number;
  meetingUuid: string;
  meetingName: string;
  purpose: MeetingPurpose;
  maxParticipants: number;
  status: MeetingStatus;
  createdAt: string;
  expiresAt: string;
}

export interface MeetingCreateRequest {
  meetingName: string;
  purpose: MeetingPurpose;
  maxParticipants: number;
}

export interface MeetingResponse {
  success: boolean;
  data: Meeting;
  error: any;
  meta: {
    timestamp: string;
  };
}
