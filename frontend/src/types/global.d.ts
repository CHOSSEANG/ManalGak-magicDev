// src/types/global.d.ts 
export {}

declare global {
  interface Window {
    kakao: any
    __kakaoMapLoaded?: boolean
  }
}
