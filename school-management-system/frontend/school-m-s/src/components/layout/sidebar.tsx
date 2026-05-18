 
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  BookOpen, 
  CalendarCheck, 
  ClipboardList, 
  Bell,
  GraduationCap,
  School,
  Settings
} from "lucide-react";

const allMenuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "teacher", "student"] },
  { name: "Students", href: "/students", icon: Users, roles: ["admin", "teacher"] },
  { name: "Teachers", href: "/teachers", icon: UserSquare2, roles: ["admin"] },
  { name: "Classes", href: "/classes", icon: School, roles: ["admin", "teacher"] },
  { name: "Subjects", href: "/subjects", icon: BookOpen, roles: ["admin", "teacher", "student"] },
  { name: "Attendance", href: "/attendance", icon: CalendarCheck, roles: ["admin", "teacher", "student"] },
  { name: "Assignments", href: "/assignments", icon: GraduationCap, roles: ["admin", "teacher", "student"] },
  { name: "Results", href: "/results", icon: ClipboardList, roles: ["admin", "teacher", "student"] },
  { name: "Notices", href: "/notices", icon: Bell, roles: ["admin", "teacher", "student"] },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["admin", "teacher", "student"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const role = useAuthStore((s) => s.role);

  const filteredMenu = allMenuItems.filter(item => 
    !item.roles || (role && item.roles.includes(role))
  );

  return (
    <aside className="w-64 h-screen bg-[#1e293b] text-slate-300 p-4 fixed left-0 top-0 z-50 shadow-xl border-r border-slate-700">
      <div className="flex items-center gap-2 px-2 mb-8 mt-2">
        <div className="p-2 bg-blue-600 rounded-lg">
          <School size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">School MS</h1>
      </div>

      <nav className="space-y-1">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"} />
              <span className="font-medium text-[15px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-8 left-4 right-4">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Current Role</p>
          <p className="text-sm font-bold text-white capitalize">{role || "User"}</p>
        </div>
      </div>
    </aside>
  );
}