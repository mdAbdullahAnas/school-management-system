"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { noticeService } from "@/services/notice.service";
import { useAuthStore } from "@/store/auth-store";
import { Plus, Bell, Calendar, Pin, MoreHorizontal } from "lucide-react";

export default function NoticesPage() {
  const { role } = useAuthStore();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const fetchNotices = () => {
    setLoading(true);
    noticeService.getAll().then(data => {
      setNotices(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => {
      setNotices([]);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await noticeService.create(formData);
      setShowModal(false);
      fetchNotices();
      alert("Notice posted successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to post notice");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Notice Board</h1>
          <p className="text-slate-500 mt-1">Important updates and announcements.</p>
        </div>

        {role === "admin" && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus size={20} />
            <span>Post Notice</span>
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Post New Notice</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="School Reopening"
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Enter notice details..."
                  onChange={e => setFormData({...formData, content: e.target.value})}
                ></textarea>
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
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-4xl space-y-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-32 bg-white animate-pulse rounded-2xl border border-slate-100"></div>)
        ) : notices.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 text-slate-500">
            No notices posted yet.
          </div>
        ) : (
          notices.map((notice) => (
            <div key={notice.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all relative group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl mt-1">
                  <Bell size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-800 text-lg">{notice.title}</h3>
                    <div className="flex items-center gap-2 text-slate-400">
                       <Calendar size={14} />
                       <span className="text-xs font-medium">{new Date(notice.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{notice.content}</p>
                  
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">Posted by Admin</span>
                     {role === "admin" && (
                       <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <MoreHorizontal size={18} />
                       </button>
                     )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
