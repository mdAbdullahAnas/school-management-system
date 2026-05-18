import api from "./api";

export const subjectService = {
  getAll: async (filters?: { teacherId?: number; studentId?: number }) => {
    const res = await api.get("/subjects", { params: filters });
    return res.data;
  },
  enroll: async (subjectId: number, studentId: number) => {
    const res = await api.post(`/subjects/${subjectId}/enroll`, { studentId });
    return res.data;
  },
  getOne: async (id: number) => {
    const res = await api.get(`/subjects/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post("/subjects", data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete(`/subjects/${id}`);
    return res.data;
  },
  addStudents: async (id: number, studentIds: number[]) => {
    const res = await api.patch(`/subjects/${id}/add-students`, { studentIds });
    return res.data;
  },
};
