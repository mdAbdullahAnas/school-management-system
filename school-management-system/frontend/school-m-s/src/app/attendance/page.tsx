"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { attendanceService } from "@/services/attendance.service";
import { studentService } from "@/services/student.service";
import { classService } from "@/services/class.service";
import { subjectService } from "@/services/subject.service";
import { useAuthStore } from "@/store/auth-store";
import { Calendar, CheckCircle, XCircle, Users, Clock, School } from "lucide-react";

export default function AttendancePage() {
  const { role, user } = useAuthStore();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role === "student") {
      attendanceService.getStudentAttendance(user?.id).then(data => {
        setAttendance(Array.isArray(data) ? data : []);
        setLoading(false);
      }).catch(() => {
        setAttendance([]);
        setLoading(false);
      });
    } else {
      classService.getAll().then(data => {
        setClasses(Array.isArray(data) ? data : []);
        setLoading(false);
      }).catch(() => {
        setClasses([]);
        setLoading(false);
      });
    }
  }, [role, user]);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Attendance</h1>
        <p className="text-slate-500 mt-1">
          {role === "student" ? "Track your daily attendance history." : "Manage and record student attendance."}
        </p>
      </div>

      {role === "student" ? (
        <StudentAttendanceView attendance={attendance} loading={loading} />
      ) : (
        <FacultyAttendanceView classes={classes} loading={loading} />
      )}
    </DashboardLayout>
  );
}

function StudentAttendanceView({ attendance, loading }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={20} className="text-blue-600" />
            Recent History
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center animate-pulse text-slate-400">Loading attendance data...</div>
          ) : attendance.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No attendance records found.</div>
          ) : (
            attendance.map((record: any) => (
              <div key={record.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${record.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {record.status === 'PRESENT' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">{new Date(record.date).toLocaleDateString()}</p>
                    <p className="text-xs text-slate-500">{record.subject?.name || "Regular Class"}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  record.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {record.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-amber-500" />
            Attendance Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-slate-500 text-sm font-medium">Monthly Average</span>
              <span className="text-2xl font-bold text-slate-800">92%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '92%' }}></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="text-center p-3 bg-emerald-50 rounded-xl">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Present</p>
                <p className="text-xl font-bold text-emerald-800">18</p>
              </div>
              <div className="text-center p-3 bg-rose-50 rounded-xl">
                <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">Absent</p>
                <p className="text-xl font-bold text-rose-800">2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FacultyAttendanceView({ classes, loading }: any) {
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [attendanceData, setAttendanceData] = useState<any>({});

  useEffect(() => {
    if (role === "teacher") {
      subjectService.getAll({ teacherId: user?.id }).then(data => setSubjects(Array.isArray(data) ? data : []));
    } else {
      subjectService.getAll().then(data => setSubjects(Array.isArray(data) ? data : []));
    }
  }, [role, user]);

  const handleSelectClass = async (cls: any) => {
    setSelectedClass(cls);
    setLoadingStudents(true);
    try {
      const data = await classService.getOne(cls.id);
      setStudents(Array.isArray(data.students) ? data.students : []);
      const initial: any = {};
      (data.students || []).forEach((s: any) => initial[s.id] = 'PRESENT');
      setAttendanceData(initial);
    } catch (err) {
      alert("Failed to fetch students");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSubject) return alert("Please select a subject");

    try {
      const promises = Object.entries(attendanceData).map(([studentId, status]) => 
        attendanceService.create({
          studentId: Number(studentId),
          status,
          date: new Date().toISOString().split('T')[0],
          subjectId: Number(selectedSubject)
        })
      );
      await Promise.all(promises);
      alert("Attendance recorded successfully!");
      setSelectedClass(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to record attendance");
    }
  };

  if (selectedClass) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Mark Attendance: {selectedClass.className}</h3>
            <p className="text-sm text-slate-500">{new Date().toLocaleDateString()}</p>
          </div>
          <button 
            onClick={() => setSelectedClass(null)}
            className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
          >
            Back to Classes
          </button>
        </div>
        <div className="p-6">
          <div className="mb-8 max-w-xs">
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Select Subject</label>
            <select 
              required
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Choose a subject...</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.subjectName}</option>
              ))}
            </select>
          </div>

          {loadingStudents ? (
            <div className="text-center py-12 animate-pulse text-slate-400">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No students found in this class.</div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-4">Student Name</th>
                      <th className="pb-4 text-center w-48">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {students.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 font-medium text-slate-700">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                 {s.user?.fullName?.charAt(0)}
                              </div>
                              {s.user?.fullName}
                           </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center justify-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer group">
                              <input 
                                type="radio" 
                                name={`attendance-${s.id}`} 
                                checked={attendanceData[s.id] === 'PRESENT'}
                                onChange={() => setAttendanceData({...attendanceData, [s.id]: 'PRESENT'})}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                              />
                              <span className={`text-sm font-bold ${attendanceData[s.id] === 'PRESENT' ? 'text-emerald-600' : 'text-slate-400'}`}>Present</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                              <input 
                                type="radio" 
                                name={`attendance-${s.id}`} 
                                checked={attendanceData[s.id] === 'ABSENT'}
                                onChange={() => setAttendanceData({...attendanceData, [s.id]: 'ABSENT'})}
                                className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                              />
                              <span className={`text-sm font-bold ${attendanceData[s.id] === 'ABSENT' ? 'text-rose-600' : 'text-slate-400'}`}>Absent</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-8">
                <button 
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
                >
                  <CheckCircle size={20} />
                  Save Attendance
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Users size={20} className="text-blue-600" />
          Select Class to Mark Attendance
        </h3>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-32 bg-slate-50 animate-pulse rounded-2xl"></div>)
        ) : classes.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500">No classes assigned.</div>
        ) : (
          classes.map((cls: any) => (
            <div 
              key={cls.id} 
              onClick={() => handleSelectClass(cls)}
              className="p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <School size={24} />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{cls.section || "A"}</span>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-1">{cls.className}</h4>
              <p className="text-sm text-slate-500 mb-4">{cls.students?.length || 0} Students</p>
              <button className="w-full py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                Mark Attendance
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
