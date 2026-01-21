// src/stores/meetingDraft.store.ts

import { create } from 'zustand'

interface Participant {
  participantId: number
  meetingId?: number
  status?: string
  nickName: string
  profileImageUrl: string
  origin: { latitude: number; longitude: number; address: string }
  destination: { latitude: number; longitude: number; address: string }
  transportType: string
  userId: number
  handicap: boolean
}

export interface Meeting {
  meetingUuid?: string
  meetingName: string
  meetingTime: string
  endTime: string
  purpose: string
  status: string
  totalParticipants: number
  organizerId: number
  participants: Participant[]
}

interface MeetingStore {
  meetingData: Meeting | null
  setMeetingData: (meeting: Meeting) => void
  clearMeetingData: () => void
}


export const useMeetingStore = create<MeetingStore>((set) => ({
  meetingData: null,
  setMeetingData: (meeting) => set({ meetingData: meeting }),
  clearMeetingData: () => set({ meetingData: null }),
}))
