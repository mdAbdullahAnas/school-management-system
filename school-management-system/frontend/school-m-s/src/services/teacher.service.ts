import api from "./api";

export const teacherService = {
  getAll: async (search?: string) => {
    const res = await api.get("/teachers", { params: { search } });
    return res.data;
  },
  getOne: async (id: number) => {
    const res = await api.get(`/teachers/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post("/teachers", data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await api.patch(`/teachers/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete(`/teachers/${id}`);
    return res.data;
  },
};
