import api from "./api";

export const noticeService = {
  getAll: async () => {
    const res = await api.get("/notices");
    return res.data;
  },
  getOne: async (id: number) => {
    const res = await api.get(`/notices/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post("/notices", data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await api.patch(`/notices/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete(`/notices/${id}`);
    return res.data;
  },
};
