'use client'

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

export default function PlaceInfoSection(): JSX.Element {
  return (
    <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
      {/* 장소 기본 정보 */}
      <CardHeader className="space-y-1">
        <CardTitle className="text-[var(--text)] text-base">
          마하 한남
        </CardTitle>
        <CardDescription className="text-[var(--text-subtle)]">
          이탈리안 레스토랑
        </CardDescription>
      </CardHeader>

      {/* 상세 정보 */}
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-[var(--text-subtle)]">주소</p>
            <p className="text-sm text-[var(--text)]">
              서울 중구 을지로 170-1
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--text-subtle)]">전화</p>
            <p className="text-sm text-[var(--text)]">
              02-2266-1234
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
