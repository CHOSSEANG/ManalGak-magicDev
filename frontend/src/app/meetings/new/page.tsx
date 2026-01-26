// src/app/meetings/new/page.tsx
import { Suspense } from "react"
import MeetingsNewClient from "./MeetingsNewClient"

export default function CreateEntryPage() {
  return (
    <Suspense fallback={null}>
      <MeetingsNewClient />
    </Suspense>
  )
}
