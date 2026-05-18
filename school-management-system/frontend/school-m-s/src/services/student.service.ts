import api from "./api";

export const studentService = {
  getAll: async (search?: string) => {
    const res = await api.get("/students", { params: { search } });
    return res.data;
  },
  getOne: async (id: number) => {
    const res = await api.get(`/students/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post("/students", data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await api.patch(`/students/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete(`/students/${id}`);
    return res.data;
  },
};
