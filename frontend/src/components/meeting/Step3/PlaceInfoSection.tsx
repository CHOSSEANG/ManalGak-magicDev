// src/components/meeting/Step3/PlaceInfoSection.tsx
'use client'

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

export interface PlaceInfo {
  placeName?: string | null
  categoryName?: string | null
  address?: string | null
  phone?: string | null
}

interface Props {
  place?: PlaceInfo | null
}

export default function PlaceInfoSection({ place }: Props): JSX.Element {
  const placeName = place?.placeName?.trim() || '-'
  const categoryName = place?.categoryName?.trim() || '-'
  const address = place?.address?.trim() || '-'
  const phone = place?.phone?.trim() || '-'

  return (
    <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
      {/* 장소 기본 정보 */}
      <CardHeader className="space-y-1">
        <CardTitle className="text-[var(--text)] text-base">
          {placeName}
        </CardTitle>
        <CardDescription className="text-[var(--text-subtle)]">
          {categoryName}
        </CardDescription>
      </CardHeader>

      {/* 상세 정보 */}
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-[var(--text-subtle)]">주소</p>
            <p className="text-sm text-[var(--text)]">
              {address}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--text-subtle)]">전화</p>
            <p className="text-sm text-[var(--text)]">
              {phone}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
