"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { studentService } from "@/services/student.service";
import { useAuthStore } from "@/store/auth-store";
import { Plus, Search, Edit, Trash2, Eye, X, User, Phone, MapPin, Hash, School } from "lucide-react";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  const { role } = useAuthStore();
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "password123",
    rollNumber: "",
    phone: "",
    address: ""
  });

  const fetchStudents = (searchQuery?: string) => {
    setLoading(true);
    studentService.getAll(searchQuery).then((data) => {
      setStudents(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => {
      setStudents([]);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const triggerSearch = () => {
    fetchStudents(search);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(id);
        fetchStudents(search);
        alert("Student deleted successfully!");
      } catch (err: any) {
        alert("Failed to delete student");
      }
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await studentService.create({
        user: {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        },
        rollNumber: formData.rollNumber,
        phone: formData.phone,
        address: formData.address
      });
      setShowAddModal(false);
      fetchStudents();
      alert("Student added successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add student");
    }
  };

  const handleEditClick = (student: any) => {
    setSelectedStudent(student);
    setFormData({
      fullName: student.user?.fullName || "",
      email: student.user?.email || "",
      password: "", // Not used in edit
      rollNumber: student.rollNumber || "",
      phone: student.phone || "",
      address: student.address || ""
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await studentService.update(selectedStudent.id, {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        // Backend update method handles which fields to update
      });
      setShowEditModal(false);
      fetchStudents(search);
      alert("Student updated successfully!");
    } catch (err: any) {
      alert("Failed to update student");
    }
  };

  const handleViewProfile = (student: any) => {
    setSelectedStudent(student);
    setShowProfileModal(true);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Students</h1>
          <p className="text-slate-500 mt-1">Manage and view all students in the system.</p>
        </div>

        {role === "admin" && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus size={20} />
            <span>Add Student</span>
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
                placeholder="Search students..." 
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
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">ID / Roll</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Class</th>
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
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No students found.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                          {student.user?.fullName.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-700">{student.user?.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">{student.rollNumber || `ID-${student.id}`}</td>
                    <td className="px-6 py-4 text-slate-600">{student.user?.email}</td>
                    <td className="px-6 py-4 text-slate-600">{student.classroom?.className || "Unassigned"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleViewProfile(student)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Profile"
                        >
                          <Eye size={18} />
                        </button>
                        {role === "admin" && (
                          <>
                            <button 
                              onClick={() => handleEditClick(student)}
                              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(student.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                              title="Delete"
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
      {showProfileModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="relative h-25 bg-gradient-to-r from-blue-600 to-indigo-700">
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
                >
                  <X size={10} />
                </button>
             </div>
             <div className="px-8 pb-8 -mt-12">
                <div className="flex flex-col items-center">
                   <div className="w-35 h-50 bg-white p-1.5 rounded-2xl shadow-xl">
                      <div className="w-full h-full bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-3xl font-bold">
                        {selectedStudent.user?.fullName.charAt(0)}
                      </div>
                   </div>
                   <h2 className="text-2xl font-bold text-slate-800 mt-4">{selectedStudent.user?.fullName}</h2>
                   <p className="text-slate-500 font-medium">Student</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                   <ProfileItem icon={Hash} label="Roll Number" value={selectedStudent.rollNumber || "N/A"} />
                   <ProfileItem icon={School} label="Class" value={selectedStudent.classroom?.className || "Unassigned"} />
                   <ProfileItem icon={User} label="Email" value={selectedStudent.user?.email} />
                   <ProfileItem icon={Phone} label="Phone" value={selectedStudent.phone || "N/A"} />
                   <ProfileItem icon={MapPin} label="Address" value={selectedStudent.address || "N/A"} colSpan={2} />
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Student</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="John Doe"
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  required
                  type="email"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="john@example.com"
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Roll Number</label>
                  <input 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="S101"
                    onChange={e => setFormData({...formData, rollNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="+123456789"
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Student Info</h2>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Roll Number</label>
                  <input 
                    value={formData.rollNumber}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                    onChange={e => setFormData({...formData, rollNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input 
                    value={formData.phone}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input 
                  value={formData.address}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
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
            <Icon size={12} className="text-blue-500" />
            {label}
         </p>
         <p className="text-slate-700 font-semibold bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{value}</p>
      </div>
   );
}
