"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { assignmentService } from "@/services/assignment.service";
import { subjectService } from "@/services/subject.service";
import { useAuthStore } from "@/store/auth-store";
import { Plus, BookOpen, Clock, FileText, Send, CheckCircle2 } from "lucide-react";

export default function AssignmentsPage() {
  const { role } = useAuthStore();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", deadline: "", subjectId: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      let asgn;
      let subs;

      if (role === "teacher") {
        // Teachers see only their subjects and assignments for those subjects
        subs = await subjectService.getAll({ teacherId: user?.id });
        // The backend might need an update to filter assignments by teacherId
        // For now, we'll filter on the frontend or assume getAll handles it if we pass params
        asgn = await assignmentService.getAll(); 
        asgn = asgn.filter((a: any) => subs.some((s: any) => s.id === a.subjectId));
      } else if (role === "student") {
        // Students see only their enrolled subjects and assignments for those
        subs = await subjectService.getAll({ studentId: user?.id });
        asgn = await assignmentService.getAll();
        asgn = asgn.filter((a: any) => subs.some((s: any) => s.id === a.subjectId));
      } else {
        [asgn, subs] = await Promise.all([
          assignmentService.getAll(),
          subjectService.getAll()
        ]);
      }

      setAssignments(Array.isArray(asgn) ? asgn : []);
      setSubjects(Array.isArray(subs) ? subs : []);
    } catch (err) {
      setAssignments([]);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assignmentService.create({
        ...formData,
        subjectId: Number(formData.subjectId),
        deadline: new Date(formData.deadline).toISOString()
      });
      setShowModal(false);
      fetchData();
      alert("Assignment created successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create assignment");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Assignments</h1>
          <p className="text-slate-500 mt-1">
            {role === "student" ? "View and submit your assignments." : "Manage and track student assignments."}
          </p>
        </div>

        {(role === "admin" || role === "teacher") && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus size={20} />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Create New Assignment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Final Project"
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Details about the assignment..."
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <select 
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    onChange={e => setFormData({...formData, subjectId: e.target.value})}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.subjectName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                  <input 
                    required
                    type="date"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="h-48 bg-white animate-pulse rounded-2xl border border-slate-100"></div>)
        ) : assignments.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-100 text-slate-500">
            No assignments found.
          </div>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{assignment.title}</h3>
                    <p className="text-sm text-slate-500">{assignment.subject?.name || "General"}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-amber-100">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </div>

              <p className="text-slate-600 text-sm mb-6 line-clamp-2">{assignment.description || "No description provided."}</p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                    <Clock size={14} />
                    <span>Posted {new Date(assignment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                    <FileText size={14} />
                    <span>{assignment.maxPoints || 100} Points</span>
                  </div>
                </div>

                {role === "student" ? (
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                    <Send size={16} />
                    Submit Work
                  </button>
                ) : (
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-800 hover:text-white transition-all">
                    <CheckCircle2 size={16} />
                    View Submissions
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
