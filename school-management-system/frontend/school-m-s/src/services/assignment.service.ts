import api from "./api";

export const assignmentService = {
  getAll: async () => {
    const res = await api.get("/assignments");
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post("/assignments", data);
    return res.data;
  },
  submit: async (data: any) => {
    const res = await api.post("/assignments/submit", data);
    return res.data;
  },
  getSubmissions: async (id: number) => {
    const res = await api.get(`/assignments/${id}/submissions`);
    return res.data;
  },
  getPending: async (id: number) => {
    const res = await api.get(`/assignments/${id}/pending`);
    return res.data;
  },
};
