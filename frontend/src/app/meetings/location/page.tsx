// src/app/meetings/location/page.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function OptionLocationPage() {
  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <Card
          className="border"
          style={{
            backgroundColor: "var(--bg-soft)",
            borderColor: "var(--border)",
          }}
        >
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl">만날각 위치 선택</CardTitle>
            <CardDescription style={{ color: "var(--text-subtle)" }}>
              모임 장소를 정하는 기능이 곧 제공될 예정입니다.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div
              className="rounded-lg border p-4"
              style={{
                backgroundColor: "var(--neutral-soft)",
                borderColor: "var(--border)",
                color: "var(--text-subtle)",
              }}
            >
              현재는 위치 선택 UI를 준비 중입니다.
            </div>

            <div
              className="rounded-lg border p-4"
              style={{
                backgroundColor: "var(--neutral)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            >
              추후 카카오맵 기반으로 위치를 검색하고 확정할 수 있도록 제공됩니다.
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <span style={{ color: "var(--text-subtle)" }}>기능 준비 중</span>
            <Button
              className="px-4"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              위치 선택 요청하기
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
