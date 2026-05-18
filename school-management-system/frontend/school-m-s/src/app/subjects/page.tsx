"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { subjectService } from "@/services/subject.service";
import { teacherService } from "@/services/teacher.service";
import { useAuthStore } from "@/store/auth-store";
import { Plus, BookOpen, User, Trash2, CheckCircle, Search } from "lucide-react";

export default function SubjectsPage() {
  const { role, user } = useAuthStore();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ subjectName: "", code: "", teacherId: "" });
  const [view, setView] = useState<"all" | "mine">("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      let subs;
      if (role === "student" && view === "mine") {
        subs = await subjectService.getAll({ studentId: user?.profileId });
      } else if (role === "teacher") {
        subs = await subjectService.getAll({ teacherId: user?.profileId });
      } else {
        subs = await subjectService.getAll();
      }

      setSubjects(Array.isArray(subs) ? subs : []);

      if (role === "admin") {
        const techs = await teacherService.getAll();
        setTeachers(Array.isArray(techs) ? techs : []);
      }
    } catch (err) {
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, user, view]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subjectService.create({
        ...formData,
        teacherId: Number(formData.teacherId)
      });
      setShowModal(false);
      fetchData();
      alert("Subject added successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add subject");
    }
  };

  const handleEnroll = async (subjectId: number) => {
    try {
      await subjectService.enroll(subjectId, user?.profileId);
      alert("Enrolled successfully!");
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this subject?")) {
      await subjectService.delete(id);
      fetchData();
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Subjects</h1>
          <p className="text-slate-500 mt-1">
            {role === "student" ? "Explore and manage your enrolled subjects." : "Manage academic curriculum."}
          </p>
        </div>

        <div className="flex gap-4">
          {role === "student" && (
            <div className="flex bg-slate-100 p-1 rounded-xl">
               <button 
                onClick={() => setView("all")}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${view === "all" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
               >
                 All Subjects
               </button>
               <button 
                onClick={() => setView("mine")}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${view === "mine" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
               >
                 My Enrolled
               </button>
            </div>
          )}

          {role === "admin" && (
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus size={20} />
              <span>Add Subject</span>
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Subject</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
                <input 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Mathematics"
                  onChange={e => setFormData({...formData, subjectName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject Code</label>
                <input 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="MATH101"
                  onChange={e => setFormData({...formData, code: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign Teacher</label>
                <select 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                  onChange={e => setFormData({...formData, teacherId: e.target.value})}
                >
                  <option value="">Select a teacher</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.user?.fullName}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl">Add Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => <div key={i} className="h-40 bg-white animate-pulse rounded-2xl border border-slate-100"></div>)
        ) : subjects.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-100 text-slate-500">
            No subjects found.
          </div>
        ) : (
          subjects.map((subject) => {
            const isEnrolled = subject.students?.some((s: any) => s.id === user?.id);
            return (
              <div key={subject.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex gap-2">
                    {role === "admin" && (
                      <button 
                        onClick={() => handleDelete(subject.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">{subject.subjectName}</h3>
                <p className="text-sm text-slate-500 mb-4">{subject.code}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-600">
                    <User size={16} className="text-slate-400" />
                    <span className="text-xs font-medium">{subject.teacher?.user?.fullName || "Unassigned"}</span>
                  </div>
                  
                  {role === "student" && (
                    isEnrolled ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-md">
                        <CheckCircle size={12} />
                        Enrolled
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleEnroll(subject.id)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Enroll Now
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
