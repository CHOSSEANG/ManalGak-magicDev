// src/types/kakao.d.ts
export {}

declare global {
  namespace kakao {
    namespace maps {
      class LatLng {
        constructor(lat: number, lng: number)
      }

      class LatLngBounds {
        extend(latlng: LatLng): void
      }

      interface MapOptions {
        center: LatLng
        level: number
      }

      // ✅ Map 클래스는 딱 한 번만
      class Map {
        constructor(container: HTMLElement, options: MapOptions)
        setBounds(bounds: LatLngBounds): void
        setDraggable(draggable: boolean): void
      }

      interface CustomOverlayOptions {
        position: LatLng
        content: HTMLElement | string
        yAnchor?: number
      }

      class CustomOverlay {
        constructor(options: CustomOverlayOptions)
        setMap(map: Map | null): void
      }

      interface PolylineOptions {
        path: LatLng[]
        strokeWeight: number
        strokeColor: string
        strokeOpacity: number
        strokeStyle?: string
      }

      class Polyline {
        constructor(options: PolylineOptions)
        setMap(map: Map | null): void
      }

      function load(callback: () => void): void
    }
  }

  interface Window {
    kakao: typeof kakao
  }
}
