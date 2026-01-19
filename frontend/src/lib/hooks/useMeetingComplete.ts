import { useEffect, useState } from 'react'

import {
  getMeetingCandidate,
  getMeetingDetail,
  getMeetingLastTrain,
} from '@/lib/api/meeting'

interface MeetingApiResponse {
  meetingName?: string
  candidateId?: string
  members?: { id?: string; name?: string }[]
}

interface CandidateApiResponse {
  dateTime?: string
  category?: string
  members?: { id?: string; name?: string }[]
  place?: {
    name?: string
    address?: string
    lat?: number
    lng?: number
  }
}

interface LastTrainApiResponse {
  dateTime?: string
}

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
}

interface UseMeetingCompleteState {
  data: MeetingCompleteViewModel | null
  isLoading: boolean
  error: Error | null
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

export const useMeetingComplete = (meetingId: string) => {
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
        const meetingData = (await getMeetingDetail(
          meetingId
        )) as MeetingApiResponse
        const candidateId = isNonEmptyString(meetingData?.candidateId)
          ? meetingData.candidateId
          : ''

        const [candidateData, lastTrainData] = await Promise.all([
          candidateId
            ? (getMeetingCandidate(
                meetingId,
                candidateId
              ) as Promise<CandidateApiResponse>)
            : Promise.resolve(null),
          getMeetingLastTrain(meetingId) as Promise<LastTrainApiResponse>,
        ])

        const resolvedDateTime =
          (candidateData && isNonEmptyString(candidateData.dateTime)
            ? candidateData.dateTime
            : null) ??
          (lastTrainData && isNonEmptyString(lastTrainData.dateTime)
            ? lastTrainData.dateTime
            : '')

        const candidateMembers = Array.isArray(candidateData?.members)
          ? candidateData.members
          : null
        const meetingMembers = Array.isArray(meetingData?.members)
          ? meetingData.members
          : null
        const memberCount =
          candidateMembers?.length ?? meetingMembers?.length

        const place = candidateData?.place

        const viewModel: MeetingCompleteViewModel = {
          meetingName: isNonEmptyString(meetingData?.meetingName)
            ? meetingData.meetingName
            : '',
          dateTime: resolvedDateTime,
          memberCount,
          category: isNonEmptyString(candidateData?.category)
            ? candidateData.category
            : '',
          placeName: isNonEmptyString(place?.name) ? place.name : '',
          address: isNonEmptyString(place?.address) ? place.address : '',
          lat: isNumber(place?.lat) ? place.lat : undefined,
          lng: isNumber(place?.lng) ? place.lng : undefined,
          parkingInfo: '',
          reservationInfo: '',
          phoneNumber: '',
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
  }, [meetingId])

  return state
}
