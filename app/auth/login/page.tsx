"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (signInError) {
      setError("Acceso denegado: credenciales incorrectas.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="w-full max-w-md px-4">
        <div className="mb-10 text-center">
          <span className="inline-block text-xs tracking-[0.3em] text-[#a0a0a0] uppercase mb-4">
            Smart_Parking
          </span>
          <h1 className="text-3xl font-bold text-white">Bienvenido</h1>
          <p className="text-sm text-[#666] mt-2">Inicio de Sesión</p>
        </div>

        <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-[#888] mb-2 tracking-wide uppercase">Correo electrónico</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className="w-full bg-[#111] border border-[#2a2a2a] text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-[#6366f1] transition-colors placeholder:text-[#3a3a3a]"/>
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-2 tracking-wide uppercase">Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#111] border border-[#2a2a2a] text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-[#6366f1] transition-colors placeholder:text-[#3a3a3a]"/>
            </div>
            {error && (
              <div className="bg-red-950/40 border border-red-800/50 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-[#6366f1] hover:bg-[#5558e8] disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm transition-colors">
              {loading ? "Validando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
        <p className="text-center text-[#555] text-sm mt-6">
          ¿No tienes cuenta?{" "}
          <a href="/auth/register" className="text-[#6366f1] hover:underline">Regístrate</a>
        </p>
      </div>
    </main>
  );
}