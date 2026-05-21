"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (!user) return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <p className="text-[#555] text-sm">Cargando...</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#0f0f0f] py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-xs tracking-[0.3em] text-[#555] uppercase">Dashboard</span>
            <h1 className="text-3xl font-bold text-white mt-1">
              Hola, {user.user_metadata?.full_name?.split(" ")[0] || "Usuario"} 👋
            </h1>
          </div>
          <button onClick={handleLogout}
            className="text-xs text-red-500 hover:text-red-400 border border-red-900/50 px-4 py-2 rounded-lg transition-colors">
            Cerrar sesión
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Registro", status: "✓ Completado", color: "text-green-400" },
            { label: "Sesión", status: "✓ Activa", color: "text-green-400" },
            { label: "Perfil", status: "Editable", color: "text-[#6366f1]" },
          ].map((item) => (
            <div key={item.label} className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-5">
              <p className="text-xs text-[#555] uppercase tracking-wide mb-1">{item.label}</p>
              <p className={`text-sm font-medium ${item.color}`}>{item.status}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-6">
          <p className="text-xs text-[#555] uppercase tracking-wide mb-3">Tu cuenta</p>
          <p className="text-white text-sm">{user.user_metadata?.full_name}</p>
          <p className="text-[#666] text-sm">{user.email}</p>
          <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
            <a href="/dashboard/profile" className="text-sm text-[#6366f1] hover:underline">
              → Modificar perfil
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}