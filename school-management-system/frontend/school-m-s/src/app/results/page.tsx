"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { resultService } from "@/services/result.service";
import { useAuthStore } from "@/store/auth-store";
import { ClipboardList, TrendingUp, Award, Search, Download, Plus } from "lucide-react";
import { studentService } from "@/services/student.service";
import { subjectService } from "@/services/subject.service";

export default function ResultsPage() {
  const { role, user } = useAuthStore();
  const [results, setResults] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ studentId: "", subjectId: "", marks: "", examType: "Final" });

  const fetchData = async () => {
    setLoading(true);
    try {
      let resData;
      let stds;
      let subs;

      if (role === "student") {
        resData = await resultService.getStudentResults(user?.id);
        setResults(Array.isArray(resData) ? resData : []);
      } else if (role === "teacher") {
        // Teachers see subjects they teach
        subs = await subjectService.getAll({ teacherId: user?.id });
        setSubjects(Array.isArray(subs) ? subs : []);

        // Filter results and students based on these subjects
        resData = await resultService.getAll();
        resData = resData.filter((r: any) => subs.some((s: any) => s.id === r.subjectId));
        setResults(Array.isArray(resData) ? resData : []);

        // Flatten students from subjects
        const enrolledStudents: any[] = [];
        subs.forEach((s: any) => {
          (s.students || []).forEach((st: any) => {
            if (!enrolledStudents.find(existing => existing.id === st.id)) {
              enrolledStudents.push(st);
            }
          });
        });
        setStudents(enrolledStudents);
      } else {
        // Admin sees everything
        const [res, allStds, allSubs] = await Promise.all([
          resultService.getAll(),
          studentService.getAll(),
          subjectService.getAll()
        ]);
        setResults(Array.isArray(res) ? res : []);
        setStudents(Array.isArray(allStds) ? allStds : []);
        setSubjects(Array.isArray(allSubs) ? allSubs : []);
      }
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resultService.create({
        ...formData,
        studentId: Number(formData.studentId),
        subjectId: Number(formData.subjectId),
        marks: Number(formData.marks)
      });
      setShowModal(false);
      fetchData();
      alert("Result recorded successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to record result");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Results</h1>
          <p className="text-slate-500 mt-1">
            {role === "student" ? "Your academic performance and report cards." : "Manage and view student grades."}
          </p>
        </div>

        <div className="flex gap-3">
          {(role === "admin" || role === "teacher") && (
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus size={20} />
              <span>Record Result</span>
            </button>
          )}
          <button className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-900 transition-all shadow-lg shadow-slate-800/20">
            <Download size={20} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Record Student Result</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Student</label>
                <select 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                  onChange={e => setFormData({...formData, studentId: e.target.value})}
                >
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.user?.fullName} ({s.rollNumber})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <select 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                  onChange={e => setFormData({...formData, subjectId: e.target.value})}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.subjectName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Marks</label>
                  <input 
                    required
                    type="number"
                    max="100"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="85"
                    onChange={e => setFormData({...formData, marks: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Exam Type</label>
                  <select 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                    onChange={e => setFormData({...formData, examType: e.target.value})}
                  >
                    <option value="Final">Final</option>
                    <option value="Mid-Term">Mid-Term</option>
                    <option value="Quiz">Quiz</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl">Save Result</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {role === "student" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <ClipboardList size={20} className="text-blue-600" />
                  Subject Wise Grades
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4 text-center">Score</th>
                      <th className="px-6 py-4 text-center">Grade</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                       Array(3).fill(0).map((_, i) => <tr key={i} className="animate-pulse"><td colSpan={4} className="px-6 py-4"><div className="h-4 bg-slate-50 rounded w-full"></div></td></tr>)
                    ) : results.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No results available yet.</td></tr>
                    ) : (
                      results.map(res => (
                        <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-700">{res.subject?.name}</td>
                          <td className="px-6 py-4 text-center text-slate-600">{res.marksObtained} / {res.totalMarks}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold">{res.grade}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <span className="text-[11px] font-bold text-emerald-600 uppercase">Passed</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-white/20 rounded-xl">
                      <TrendingUp size={24} />
                   </div>
                   <Award size={32} className="text-yellow-400" />
                </div>
                <p className="text-blue-100 text-sm font-medium">Overall GPA</p>
                <h3 className="text-4xl font-bold mt-1">3.85</h3>
                <p className="text-blue-100 text-xs mt-4">Top 5% of your class</p>
             </div>

             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Performance Overview</h3>
                <div className="space-y-4">
                   {['Academics', 'Attendance', 'Behavior'].map(item => (
                     <div key={item}>
                        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-1.5">
                           <span>{item}</span>
                           <span>{Math.floor(Math.random() * 20) + 80}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full">
                           <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.floor(Math.random() * 20) + 80}%` }}></div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search by student name or roll..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" />
             </div>
           </div>
           <div className="p-12 text-center text-slate-500">
              Select a class or search for a student to manage results.
           </div>
        </div>
      )}
    </DashboardLayout>
  );
}
