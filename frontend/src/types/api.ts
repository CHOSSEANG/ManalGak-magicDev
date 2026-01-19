export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: unknown;
}

export interface ErrorResponse {
  code?: string;
  message?: string;
  details?: Record<string, unknown>;
}

export interface MetaResponse {
  time?: string;
}

export interface CommonResponse<T> {
  data?: T;
  success?: boolean;
  error?: ErrorResponse;
  meta?: MetaResponse;
}
