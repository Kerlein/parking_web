"use client"; 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export const dynamic = "force-dynamic"; // <--- AGREGA ESTO

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Validaciones básicas locales
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Error en validación: todos los campos son requeridos.");
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError("Error en validación: la contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    // 2. Registro en el módulo de autenticación (auth) de Supabase
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { 
        data: { full_name: form.name } 
      },
    });

    // Manejo robusto de errores de autenticación
    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        setError("Este correo ya tiene una cuenta registrada.");
      } else if (signUpError.message.includes("invalid email")) {
        setError("El formato del correo no es válido.");
      } else {
        setError(signUpError.message); // Muestra cualquier otro error del servidor
      }
      setLoading(false);
      return;
    }

    // 3. Insertar datos complementarios en la tabla pública de perfiles
    if (authData?.user) {
      const { error: profileError } = await supabase
        .from("perfiles")
        .insert([
          {
            id: authData.user.id, // Vincula directamente con el ID autogenerado
            nombre_completo: form.name,
            rol: "conductor", // Rol predeterminado para el ingreso al parqueo inteligente
          },
        ]);

      if (profileError) {
        setError("Cuenta de autenticación creada, pero falló el registro de perfil: " + profileError.message);
        setLoading(false);
        return;
      }
    }

    // Éxito total
    setSuccess(true);
    setTimeout(() => router.push("/auth/login"), 2500);
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="w-full max-w-md px-4">
        <div className="mb-10 text-center">
          <span className="inline-block text-xs tracking-[0.3em] text-[#a0a0a0] uppercase mb-4">
            SMART PARKING
          </span>
          <h1 className="text-3xl font-bold text-white">Crear cuenta</h1>
          <p className="text-sm text-[#666] mt-2">Registro de Usuario</p>
        </div>

        <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl">
          {success ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4 text-green-400">✓</div>
              <p className="text-green-400 font-medium">¡Registro exitoso!</p>
              <p className="text-[#666] text-sm mt-2">
                Verifica tu correo electrónico si la confirmación está activa o espera redirección.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs text-[#888] mb-2 tracking-wide uppercase">Nombre completo</label>
                <input name="name" type="text" value={form.name} onChange={handleChange}
                  placeholder="Juan Pérez"
                  className="w-full bg-[#111] border border-[#2a2a2a] text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-[#6366f1] transition-colors placeholder:text-[#3a3a3a]"/>
              </div>
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
                {loading ? "Registrando..." : "Crear cuenta"}
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-[#555] text-sm mt-6">
          ¿Ya tienes cuenta?{" "}
          <a href="/auth/login" className="text-[#6366f1] hover:underline">Inicia sesión</a>
        </p>
      </div>
    </main>
  );
}