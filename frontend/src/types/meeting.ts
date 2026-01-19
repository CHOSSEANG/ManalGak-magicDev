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

export type MeetingPurposeV1 =
  | 'STUDY_CAFE'
  | 'CAFE'
  | 'ROOM_CAFE'
  | 'MOVIE'
  | 'SHOPPING'
  | 'KARAOKE'
  | 'RESTAURANT'
  | 'BRUNCH'
  | 'DRINK';

export type MeetingStatusV1 = 'PENDING' | 'COMPLETED';

export interface LocationResponse {
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface ParticipantResponse {
  participantId?: number;
  meetingId?: number;
  status?: 'INVITED' | 'CONFIRMED' | 'DECLINED';
  nickName?: string;
  profileImageUrl?: string;
  origin?: LocationResponse;
  destination?: LocationResponse;
  transportType?: 'WALK' | 'PUBLIC' | 'CAR';
  userId?: number;
  handicap?: boolean;
}

export interface MeetingDetailResponse {
  meetingName?: string;
  meetingTime?: string;
  endTime?: string;
  purpose?: MeetingPurposeV1;
  status?: MeetingStatusV1;
  totalParticipants?: number;
  organizerId?: number;
  participants?: ParticipantResponse[];
}
