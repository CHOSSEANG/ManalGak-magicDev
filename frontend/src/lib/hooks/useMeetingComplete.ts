import { useEffect, useState } from 'react'

import { getMeetingComplete } from '@/lib/api/meeting'
import type { MeetingCompleteResponse } from '@/types/meeting'

interface UseMeetingCompleteState {
  data: MeetingCompleteResponse | null
  isLoading: boolean
  error: Error | null
}

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
        const data = await getMeetingComplete(meetingId)
        if (!isActive) return
        setState({ data, isLoading: false, error: null })
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
