import api from "./api";

export const resultService = {
  getAll: async () => {
    const res = await api.get("/results");
    return res.data;
  },
  getOne: async (id: number) => {
    const res = await api.get(`/results/${id}`);
    return res.data;
  },
  getStudentResults: async (studentId: number) => {
    const res = await api.get(`/results/student/${studentId}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post("/results", data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await api.patch(`/results/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete(`/results/${id}`);
    return res.data;
  },
};
