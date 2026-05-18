"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { classService } from "@/services/class.service";
import { useAuthStore } from "@/store/auth-store";
import { Plus, School, Users, UserSquare2, ChevronRight } from "lucide-react";

export default function ClassesPage() {
  const { role } = useAuthStore();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", section: "" });

  const fetchClasses = () => {
    setLoading(true);
    classService.getAll().then(data => {
      setClasses(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => {
      setClasses([]);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await classService.create(formData);
      setShowModal(false);
      fetchClasses();
      alert("Class added successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add class");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Classes</h1>
          <p className="text-slate-500 mt-1">Manage and view all class sections.</p>
        </div>

        {role === "admin" && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus size={20} />
            <span>Add Class</span>
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Class</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class Name</label>
                <input 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Grade 10"
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
                <input 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="A"
                  onChange={e => setFormData({...formData, section: e.target.value})}
                />
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
                  Add Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => <div key={i} className="h-48 bg-white animate-pulse rounded-2xl border border-slate-100"></div>)
        ) : classes.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-100 text-slate-500">
            No classes found.
          </div>
        ) : (
          classes.map((cls) => (
            <div key={cls.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <School size={24} />
                </div>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md">Section {cls.section || "A"}</span>
              </div>

              <h3 className="font-bold text-slate-800 text-xl mb-4">{cls.name}</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2 text-slate-500">
                      <Users size={16} />
                      <span>Students</span>
                   </div>
                   <span className="font-bold text-slate-700">{cls.students?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2 text-slate-500">
                      <UserSquare2 size={16} />
                      <span>Class Teacher</span>
                   </div>
                   <span className="font-semibold text-slate-700 text-xs">{cls.classTeacher?.user?.fullName || "Unassigned"}</span>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-blue-600/20">
                View Details
                <ChevronRight size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
