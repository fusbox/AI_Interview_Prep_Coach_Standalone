export interface ApiRequest {
  method?: string;
  body: unknown;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
}

export interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  send: (body: unknown) => void;
  end: () => void;
}
