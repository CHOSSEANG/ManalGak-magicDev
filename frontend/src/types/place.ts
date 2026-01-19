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
