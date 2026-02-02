export interface Place {
  placeId: string;
  name: string;
}

export interface PlaceCandidate {
  placeName?: string;
  categoryName?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  rating?: number;
}

// 선택된(확정된) 장소 응답 타입
export interface SelectedPlace {
  placeId?: string;
  placeName?: string;
  category?: string;
  categoryGroupCode?: string;
  categoryGroupName?: string;
  categoryName?: string;
  address?: string;
  roadAddress?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  walkingMinutes?: number;
  stationName?: string;
  phone?: string;
  placeUrl?: string;
}

export interface PlaceResponse {
  places?: PlaceCandidate[];
  totalCount?: number;
  fromCache?: boolean;
}

export interface PlaceRecommendation {
  placeName?: string;
  categoryName?: string;
  distance?: number;
  rating?: number;
}

export interface PlaceSummaryResponse {
  summary?: string;
  recommendations?: PlaceRecommendation[];
  totalPlaces?: number;
  generatedAt?: string;
  fromCache?: boolean;
}
