export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'USER';
}
