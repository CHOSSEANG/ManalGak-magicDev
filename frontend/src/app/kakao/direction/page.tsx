import { redirect } from 'next/navigation'

export default function KakaoDirection({
  searchParams,
}: {
  searchParams: {
    lat?: string
    lng?: string
    place?: string
  }
}) {
  const { lat, lng, place } = searchParams

  if (!lat || !lng) {
    redirect('/')
  }

  const url = `https://map.kakao.com/link/to/${encodeURIComponent(
    place ?? ''
  )},${lat},${lng}`

  redirect(url)
}
