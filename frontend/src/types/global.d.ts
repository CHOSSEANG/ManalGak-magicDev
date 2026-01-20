// src/types/global.d.ts 
export {}

type KakaoLatLng = unknown
type KakaoMapInstance = {
  relayout: () => void
  setCenter: (center: KakaoLatLng) => void
}
type KakaoMapMarker = { setMap: (map: KakaoMapInstance | null) => void }
type KakaoMaps = {
  load: (cb: () => void) => void
  LatLng: new (lat: number, lng: number) => KakaoLatLng
  Map: new (
    container: HTMLElement,
    options: { center: KakaoLatLng; level: number }
  ) => KakaoMapInstance
  Marker: new (options: {
    map: KakaoMapInstance
    position: KakaoLatLng
  }) => KakaoMapMarker
}
type KakaoShare = {
  sendDefault: (params: {
    objectType: 'text'
    text: string
    link: { mobileWebUrl: string; webUrl: string }
  }) => void
}
type KakaoSdk = { maps?: KakaoMaps }
type KakaoJavascriptSdk = {
  isInitialized: () => boolean
  init: (key?: string) => void
  Share: KakaoShare
}

declare global {
  interface Window {
    // eslint: minimal Kakao SDK typing to avoid any
    kakao?: KakaoSdk
    Kakao?: KakaoJavascriptSdk
    __kakaoMapLoaded?: boolean
  }
}



declare global {
  interface Window {
    Kakao: KakaoSDK;
  }

  interface KakaoShare {
  sendDefault: (params: {
    objectType: "feed" | "text" | "location" | "commerce";
    content?: unknown;
    text?: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
    buttons?: Array<{
      title: string;
      link: {
        mobileWebUrl: string;
        webUrl: string;
      };
    }>;
  }) => void;

  /** ✅ 커스텀 템플릿 전송 */
  sendCustom: (params: {
    templateId: number;
    templateArgs?: Record<string, string>;
  }) => void;
}

}
