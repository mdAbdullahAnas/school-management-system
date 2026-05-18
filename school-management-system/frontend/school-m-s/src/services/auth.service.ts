import api from "./api";

export interface RegisterDTO {
  fullName: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export const authService = {
  register: async (data: RegisterDTO) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  login: async (data: LoginDTO) => {
    const res = await api.post("/auth/login", data);
    return res.data; // expects { accessToken, user }
  },
};