// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  data?: any;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// 🔥 ADD THIS: The missing RefreshResponse interface
export interface RefreshResponse {
  access_token: string;
  user: User; 
  data?: any;
}