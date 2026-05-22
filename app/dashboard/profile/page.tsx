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
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { 
        router.push("/auth/login"); 
        return; 
      }
      setForm({ 
        name: user.user_metadata?.full_name || "", 
        email: user.email || "" 
      });
      setFetching(false);
    };
    getUser();
  }, [router, supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); 
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!form.name.trim()) {
      setError("El nombre no puede estar vacío.");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    // 1. Actualizar en auth metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: form.name },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Actualizar en tabla profiles de la base de datos
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

  if (fetching) return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f] gap-3">
      <div className="w-8 h-8 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[#666] text-xs font-mono tracking-wider uppercase">Sincronizando perfil...</p>
    </main>
  );

  // Obtener inicial para el Avatar visual
  const inicial = form.name ? form.name.charAt(0).toUpperCase() : "U";

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-gray-100 selection:bg-indigo-500/30">
      
      {/* NAVBAR UNIFICADO CON EL RESTO DE TU SISTEMA */}
      <nav className="h-16 border-b border-[#2a2a2a] bg-[#141414] px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/dashboard")}>
          <div className="w-8 h-8 bg-[#6366f1] rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">P</div>
          <span className="font-bold tracking-wider text-sm hidden sm:inline uppercase text-white">Smart Parking</span>
        </div>
        
        {/* Centro: Rutas secundarias opacas porque estás dentro de configuración */}
        <div className="hidden md:flex gap-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <button onClick={() => router.push("/dashboard")} className="hover:text-white transition-colors pb-5 pt-5 cursor-pointer">Monitoreo</button>
          <button onClick={() => router.push("/dashboard/historial")} className="hover:text-white transition-colors pb-5 pt-5 cursor-pointer">Historial ALPR</button>
          <button onClick={() => router.push("/dashboard/reportes")} className="hover:text-white transition-colors pb-5 pt-5 cursor-pointer">Reportes</button>
        </div>

        {/* Perfil Derecho del Navbar */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)} 
            className="flex items-center gap-2 pl-4 border-l border-[#2a2a2a] focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366f1] to-purple-500 flex items-center justify-center font-bold text-xs text-white">
              {inicial}
            </div>
            <span className="text-sm font-medium hidden sm:inline text-gray-200">{form.name.split(" ")[0] || "Usuario"}</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-[#181818] border border-[#2a2a2a] rounded-xl shadow-2xl p-2 z-50">
              <button 
                onClick={() => { setShowProfileMenu(false); router.push("/dashboard"); }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg text-gray-300 hover:bg-[#222] transition-colors flex items-center gap-2 cursor-pointer"
              >
                🏠 Volver al Panel
              </button>
              <button 
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/auth/login");
                }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 border-t border-[#2a2a2a] mt-1 pt-2 cursor-pointer"
              >
                ✕ Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-xl mx-auto py-12 px-4">
        
        {/* Cabecera y Botón de Retroceso */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => router.push("/dashboard")}
              className="text-[#666] text-xs hover:text-[#aaa] transition-colors flex items-center gap-1 group cursor-pointer font-mono uppercase tracking-wider"
            >
              <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span> Volver al panel
            </button>
            <h1 className="text-2xl font-bold text-white mt-2 tracking-tight">Configuración del Perfil</h1>
          </div>
        </div>

        {/* Tarjeta de Formulario */}
        <div className="bg-[#141414] border border-[#232323] rounded-2xl p-8 shadow-xl shadow-black/50">
          
          {/* Sección de Avatar Estética */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#232323]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#6366f1] to-purple-600 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg shadow-indigo-500/10">
              {inicial}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Identidad Operativa</p>
              <h3 className="text-lg font-bold text-white truncate max-w-[280px]">{form.name || "Sin nombre asignado"}</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Nombre */}
            <div>
              <label className="block text-[11px] text-[#888] mb-2 tracking-widest uppercase font-semibold">Nombre Completo</label>
              <input 
                name="name" 
                type="text" 
                value={form.name} 
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                className="w-full bg-[#0b0b0b] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/30 transition-all font-medium"
              />
            </div>

            {/* Campo Email Deshabilitado */}
            <div>
              <label className="block text-[11px] text-[#888] mb-2 tracking-widest uppercase font-semibold">Correo Electrónico</label>
              <input 
                name="email" 
                type="email" 
                value={form.email} 
                disabled
                className="w-full bg-[#0e0e0e] border border-[#1c1c1c] text-[#555] rounded-xl px-4 py-3 text-sm cursor-not-allowed font-mono"
              />
              <p className="text-[#444] text-[11px] font-mono mt-1.5 pl-1">El email corporativo no es modificable por motivos de auditoría.</p>
            </div>

            {/* Alertas de Feedback */}
            {error && (
              <div className="bg-red-950/30 border border-red-500/30 text-red-400 text-xs rounded-xl px-4 py-3 flex items-center gap-2 font-medium">
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl px-4 py-3 flex items-center gap-2 font-medium animate-fadeIn">
                ✓ Cambios almacenados con éxito en la base de datos y sesión.
              </div>
            )}

            {/* Botón de Envíos */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#6366f1] hover:bg-[#5558e8] active:scale-[0.99] disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm shadow-lg shadow-indigo-500/10 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Guardando cambios...</span>
                </>
              ) : (
                "Guardar cambios"
              )}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}