// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const sx = searchParams.get('sx')
  const sy = searchParams.get('sy')
  const ex = searchParams.get('ex')
  const ey = searchParams.get('ey')

  if (!sx || !sy || !ex || !ey) {
    return NextResponse.json({ error: '좌표 누락' }, { status: 400 })
  }

  const apiKey = process.env.ODSAY_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ODSAY_API_KEY 없음' }, { status: 500 })
  }

  const url = `https://api.odsay.com/v1/api/searchPubTransPathT
    ?SX=${sx}&SY=${sy}&EX=${ex}&EY=${ey}&apiKey=${apiKey}`

  const res = await fetch(url)
  const data = await res.json()

  return NextResponse.json(data)
}
