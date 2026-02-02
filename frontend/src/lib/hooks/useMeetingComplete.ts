import { useEffect, useState } from 'react'

import { getMeetingDetail } from '@/lib/api/meeting'
import { getCandidatePlaces, getSelectedPlace } from '@/lib/api/place'
import type { CommonResponse } from '@/types/api'
import type { MeetingDetailResponse } from '@/types/meeting'
import type { PlaceResponse, PlaceCandidate, SelectedPlace } from '@/types/place'

export interface MeetingCompleteViewModel {
  meetingName?: string
  dateTime?: string
  memberCount?: number
  category?: string
  placeName?: string
  address?: string
  lat?: number
  lng?: number
  parkingInfo?: string
  reservationInfo?: string
  phoneNumber?: string
  organizerId?: number
}

interface UseMeetingCompleteState {
  data: MeetingCompleteViewModel | null
  isLoading: boolean
  error: Error | null
}

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

export const useMeetingComplete = (
  meetingId: string,
  candidateId?: number
) => {
  const [state, setState] = useState<UseMeetingCompleteState>({
    data: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    if (!meetingId) {
      setState({ data: null, isLoading: false, error: null })
      return
    }

    let isActive = true

    const fetchMeetingComplete = async () => {
      try {
        const meetingResponse =
          (await getMeetingDetail(
            meetingId
          )) as CommonResponse<MeetingDetailResponse>
        const meetingData = meetingResponse?.data
        const memberCount =
          isNumber(meetingData?.totalParticipants)
            ? meetingData?.totalParticipants
            : meetingData?.participants?.length

        // 장소 정보 조회: candidateId가 있으면 후보 조회, 없으면 확정된 장소 조회
        let placeData: PlaceCandidate | SelectedPlace | undefined
        if (isNumber(candidateId)) {
          const placeResponse =
            (await getCandidatePlaces(
              meetingId,
              candidateId
            )) as CommonResponse<PlaceResponse>
          placeData = placeResponse?.data?.places?.[0]
        } else {
          // candidateId가 없으면 확정된 장소 조회
          const selectedPlaceResponse =
            (await getSelectedPlace(meetingId)) as CommonResponse<SelectedPlace>
          placeData = selectedPlaceResponse?.data
        }

        const viewModel: MeetingCompleteViewModel = {
          meetingName: meetingData?.meetingName ?? '',
          dateTime: meetingData?.meetingTime ?? '',
          memberCount,
          category: placeData?.categoryName ?? '',
          placeName: placeData?.placeName ?? '',
          address: placeData?.address ?? '',
          lat: isNumber(placeData?.latitude) ? placeData.latitude : undefined,
          lng: isNumber(placeData?.longitude) ? placeData.longitude : undefined,
          parkingInfo: '',
          reservationInfo: '',
          phoneNumber: '',
          organizerId: meetingData?.organizerId,
        }

        if (!isActive) return
        setState({ data: viewModel, isLoading: false, error: null })
      } catch (error) {
        if (!isActive) return
        const normalizedError =
          error instanceof Error ? error : new Error('Failed to load meeting')
        setState({ data: null, isLoading: false, error: normalizedError })
      }
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    fetchMeetingComplete()

    return () => {
      isActive = false
    }
  }, [meetingId, candidateId])

  return state
}
