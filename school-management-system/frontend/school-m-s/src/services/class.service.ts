import api from "./api";

export const classService = {
  getAll: async () => {
    const res = await api.get("/classes");
    return res.data;
  },
  getOne: async (id: number) => {
    const res = await api.get(`/classes/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post("/classes", data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await api.patch(`/classes/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete(`/classes/${id}`);
    return res.data;
  },
};
