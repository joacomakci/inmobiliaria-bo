export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'agente' | 'editor';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}