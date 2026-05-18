"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/store/auth-store";
import { Users, UserSquare2, School, Bell, Calendar, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { studentService } from "@/services/student.service";
import { teacherService } from "@/services/teacher.service";
import { classService } from "@/services/class.service";
import { noticeService } from "@/services/notice.service";

export default function DashboardPage() {
  const { role, user } = useAuthStore();
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (role === "admin") {
          const [stds, techs, cls, ntcs] = await Promise.all([
            studentService.getAll(),
            teacherService.getAll(),
            classService.getAll(),
            noticeService.getAll()
          ]);
          setStats({
            students: stds.length,
            teachers: techs.length,
            classes: cls.length,
            notices: ntcs.length
          });
        }
        // Add stats for teacher/student if needed
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [role]);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of the school management system.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => <div key={i} className="h-24 bg-white animate-pulse rounded-2xl border border-slate-100"></div>)}
        </div>
      ) : (
        <>
          {role === "admin" && <AdminDashboard stats={stats} />}
          {role === "teacher" && <TeacherDashboard user={user} />}
          {role === "student" && <StudentDashboard user={user} />}
        </>
      )}
    </DashboardLayout>
  );
}

function AdminDashboard({ stats }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Students" value={stats.students || 0} icon={Users} color="bg-blue-500" />
      <StatCard title="Total Teachers" value={stats.teachers || 0} icon={UserSquare2} color="bg-purple-500" />
      <StatCard title="Active Classes" value={stats.classes || 0} icon={School} color="bg-emerald-500" />
      <StatCard title="New Notices" value={stats.notices || 0} icon={Bell} color="bg-orange-500" />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function TeacherDashboard({ user }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="My Subjects" value="4" icon={BookOpen} color="bg-indigo-500" />
      <StatCard title="My Classes" value="6" icon={School} color="bg-pink-500" />
      <StatCard title="Pending Assignments" value="15" icon={Calendar} color="bg-amber-500" />
    </div>
  );
}

function StudentDashboard({ user }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="My Attendance" value="94%" icon={Calendar} color="bg-cyan-500" />
      <StatCard title="My Subjects" value="6" icon={BookOpen} color="bg-violet-500" />
      <StatCard title="Pending Tasks" value="3" icon={Bell} color="bg-rose-500" />
    </div>
  );
}
