"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { teacherService } from "@/services/teacher.service";
import { useAuthStore } from "@/store/auth-store";
import { Plus, Search, Edit, Trash2, Eye, X, User, Phone, MapPin, Briefcase, Mail } from "lucide-react";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const { role } = useAuthStore();
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "password123",
    specialization: "",
    designation: "",
    phone: "",
    address: ""
  });

  const fetchTeachers = (searchQuery?: string) => {
    setLoading(true);
    teacherService.getAll(searchQuery).then((data) => {
      setTeachers(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => {
      setTeachers([]);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const triggerSearch = () => {
    fetchTeachers(search);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      try {
        await teacherService.delete(id);
        fetchTeachers(search);
        alert("Teacher deleted successfully!");
      } catch (err: any) {
        alert("Failed to delete teacher");
      }
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await teacherService.create({
        user: {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        },
        specialization: formData.specialization,
        designation: formData.designation,
        phone: formData.phone,
        address: formData.address
      });
      setShowAddModal(false);
      fetchTeachers();
      alert("Teacher added successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add teacher");
    }
  };

  const handleEditClick = (teacher: any) => {
    setSelectedTeacher(teacher);
    setFormData({
      fullName: teacher.user?.fullName || "",
      email: teacher.user?.email || "",
      password: "",
      specialization: teacher.specialization || "",
      designation: teacher.designation || "",
      phone: teacher.phone || "",
      address: teacher.address || ""
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await teacherService.update(selectedTeacher.id, {
        fullName: formData.fullName,
        designation: formData.designation,
        phone: formData.phone,
        address: formData.address,
      });
      setShowEditModal(false);
      fetchTeachers(search);
      alert("Teacher updated successfully!");
    } catch (err: any) {
      alert("Failed to update teacher");
    }
  };

  const handleViewProfile = (teacher: any) => {
    setSelectedTeacher(teacher);
    setShowProfileModal(true);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Teachers</h1>
          <p className="text-slate-500 mt-1">Manage and view all faculty members.</p>
        </div>

        {role === "admin" && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus size={20} />
            <span>Add Teacher</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-md flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search teachers..." 
                value={search}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === 'Enter' && triggerSearch()}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>
            <button 
              onClick={triggerSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
            >
              Search
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                <th className="px-6 py-4">Teacher</th>
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4" colSpan={5}><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                  </tr>
                ))
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No teachers found.</td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                          {teacher.user?.fullName.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-700">{teacher.user?.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{teacher.designation || "Faculty"}</td>
                    <td className="px-6 py-4 text-slate-600">{teacher.user?.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-emerald-100 text-emerald-700">Active</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleViewProfile(teacher)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </button>
                        {role === "admin" && (
                          <>
                            <button 
                              onClick={() => handleEditClick(teacher)}
                              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(teacher.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="relative h-32 bg-gradient-to-r from-purple-600 to-blue-700">
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
                >
                  <X size={20} />
                </button>
             </div>
             <div className="px-8 pb-8 -mt-12">
                <div className="flex flex-col items-center">
                   <div className="w-35 h-50 bg-white p-1.5 rounded-2xl shadow-xl">
                      <div className="w-full h-full bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-3xl font-bold">
                        {selectedTeacher.user?.fullName.charAt(0)}
                      </div>
                   </div>
                   <h2 className="text-2xl font-bold text-slate-800 mt-4">{selectedTeacher.user?.fullName}</h2>
                   <p className="text-slate-500 font-medium">Faculty Member</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                   <ProfileItem icon={Briefcase} label="Designation" value={selectedTeacher.designation || "N/A"} />
                   <ProfileItem icon={Briefcase} label="Specialization" value={selectedTeacher.specialization || "N/A"} />
                   <ProfileItem icon={Mail} label="Email" value={selectedTeacher.user?.email} />
                   <ProfileItem icon={Phone} label="Phone" value={selectedTeacher.phone || "N/A"} />
                   <ProfileItem icon={MapPin} label="Address" value={selectedTeacher.address || "N/A"} colSpan={2} />
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Teacher</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Prof. John Smith"
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  required
                  type="email"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="smith@example.com"
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
                  <input 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Senior Prof"
                    onChange={e => setFormData({...formData, designation: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                  <input 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Mathematics"
                    onChange={e => setFormData({...formData, specialization: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">Add Teacher</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Teacher Info</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  required
                  value={formData.fullName}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email (Cannot be changed)</label>
                <input 
                  disabled
                  value={formData.email}
                  className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
                <input 
                  value={formData.designation}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                  onChange={e => setFormData({...formData, designation: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input 
                    value={formData.phone}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input 
                    value={formData.address}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function ProfileItem({ icon: Icon, label, value, colSpan = 1 }: any) {
   return (
      <div className={`${colSpan === 2 ? 'md:col-span-2' : ''}`}>
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Icon size={12} className="text-purple-500" />
            {label}
         </p>
         <p className="text-slate-700 font-semibold bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{value}</p>
      </div>
   );
}
