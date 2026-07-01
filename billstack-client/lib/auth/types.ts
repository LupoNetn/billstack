// ── Authentication Types ──────────────────────────────────────────────────────

export interface AuthResponse {
  status: number;
  message: string;
  data: {
    personal_name: string;
    email: string;
  };
}

export interface RegisterRequest {
  personal_name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  personal_name: string;
  email: string;
}
