export interface User {
  id: number;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}