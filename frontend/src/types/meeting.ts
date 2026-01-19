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
  // eslint: avoid any for API error payload
  error: unknown;
  meta: {
    timestamp: string;
  };
}

export interface MeetingCompleteResponse {
  meetingId: string;
  meetingName: string;
  dateTime: string;
  category: string;
  members: { id: string; name: string }[];
  place: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  messageSent: boolean;
}
