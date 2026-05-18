 
"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { LogOut, User, Bell } from "lucide-react";

export default function Navbar() {
  const { user, role, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-40">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-800">Welcome back, {user?.fullName || "User"}</h2>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-900">{user?.fullName}</span>
            <span className="text-xs font-medium text-slate-500 capitalize px-2 py-0.5 bg-slate-100 rounded-md mt-0.5">{role}</span>
          </div>
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold border-2 border-blue-50">
            <User size={20} />
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}