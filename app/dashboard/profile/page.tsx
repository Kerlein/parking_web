"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      setForm({ name: user.user_metadata?.full_name || "", email: user.email || "" });
      setFetching(false);
    };
    getUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); setSuccess(false);
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  if (!form.name.trim()) {
    setError("El nombre no puede estar vacío.");
    setLoading(false);
    return;
  }

  const { data: { user } } = await supabase.auth.getUser();

  // Actualizar en auth
  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: form.name },
  });

  if (authError) {
    setError(authError.message);
    setLoading(false);
    return;
  }

  // Actualizar en tabla profiles
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: form.name })
    .eq("id", user?.id);

  if (profileError) {
    setError(profileError.message);
    setLoading(false);
    return;
  }

  setSuccess(true);
  setLoading(false);
};

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (fetching) return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <p className="text-[#555] text-sm">Cargando perfil...</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#0f0f0f] py-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <a href="/dashboard" className="text-[#555] text-xs hover:text-[#888] transition-colors">← Dashboard</a>
            <h1 className="text-2xl font-bold text-white mt-2">Modificar Perfil</h1>
          </div>
          <button onClick={handleLogout}
            className="text-xs text-red-500 hover:text-red-400 border border-red-900/50 px-4 py-2 rounded-lg transition-colors">
            Cerrar sesión
          </button>
        </div>

        <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-[#888] mb-2 tracking-wide uppercase">Nombre completo</label>
              <input name="name" type="text" value={form.name} onChange={handleChange}
                className="w-full bg-[#111] border border-[#2a2a2a] text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-[#6366f1] transition-colors"/>
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-2 tracking-wide uppercase">Correo electrónico</label>
              <input name="email" type="email" value={form.email} disabled
                className="w-full bg-[#0a0a0a] border border-[#1e1e1e] text-[#555] rounded-lg px-4 py-3 text-sm cursor-not-allowed"/>
              <p className="text-[#444] text-xs mt-1">El correo no se puede modificar.</p>
            </div>
            {error && (
              <div className="bg-red-950/40 border border-red-800/50 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>
            )}
            {success && (
              <div className="bg-green-950/40 border border-green-800/50 text-green-400 text-sm rounded-lg px-4 py-3">
                ✓ Perfil actualizado correctamente.
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-[#6366f1] hover:bg-[#5558e8] disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm transition-colors">
              {loading ? "Actualizando..." : "Guardar cambios"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}