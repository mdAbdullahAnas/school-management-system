import api from "./api";

export const attendanceService = {
  create: async (data: any) => {
    const res = await api.post("/attendance", data);
    return res.data;
  },
  getStudentAttendance: async (studentId: number) => {
    const res = await api.get(`/attendance/student/${studentId}`);
    return res.data;
  },
};
