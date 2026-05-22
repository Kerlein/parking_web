"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

// Definimos la estructura de un registro ALPR para TypeScript
interface AlprRecord {
  id: number;
  placa: string;
  tipo_evento: "IN" | "OUT";
  bahia_id: string;
  marca_vehiculo: string;
  detectado_at: string;
}

const mockHistory: AlprRecord[] = [
  { id: 1, placa: "LP-2345-X", tipo_evento: "IN", bahia_id: "A-01", marca_vehiculo: "Toyota Corolla", detectado_at: "2026-05-22T14:30:00Z" },
  { id: 2, placa: "SCZ-9811-A", tipo_evento: "IN", bahia_id: "A-03", marca_vehiculo: "Suzuki Vitara", detectado_at: "2026-05-22T14:15:00Z" },
  { id: 3, placa: "CBBA-4521-U", tipo_evento: "IN", bahia_id: "B-02", marca_vehiculo: "Nissan Sentra", detectado_at: "2026-05-22T13:50:00Z" },
  { id: 4, placa: "SCZ-4012-K", tipo_evento: "OUT", bahia_id: "B-04", marca_vehiculo: "Hyundai Tucson", detectado_at: "2026-05-22T13:42:00Z" },
  { id: 5, placa: "LP-8831-M", tipo_evento: "OUT", bahia_id: "A-02", marca_vehiculo: "Honda Civic", detectado_at: "2026-05-22T12:10:00Z" },
];

export default function HistorialAlprPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "IN" | "OUT">("ALL");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const supabase = createClient();

  const filteredRecords = mockHistory.filter((record) => {
    const matchesSearch = record.placa.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.marca_vehiculo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "ALL" || record.tipo_evento === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      
      {/* NAVBAR SUPERIOR CORREGIDA (CON BOTONES REALES) */}
      <nav className="h-16 border-b border-[#2a2a2a] bg-[#141414] px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
  {/* Logo */}
  <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/dashboard")}>
    <div className="w-8 h-8 bg-[#6366f1] rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">P</div>
    <span className="font-bold tracking-wider text-sm hidden sm:inline uppercase text-white">Smart Parking</span>
  </div>
  
  {/* Centro: Historial Activo */}
  <div className="hidden md:flex gap-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
    <button onClick={() => router.push("/dashboard")} className="hover:text-white transition-colors pb-5 pt-5 cursor-pointer">
      Monitoreo
    </button>
    <button className="text-white border-b-2 border-[#6366f1] pb-5 pt-5 transition-colors">
      Historial ALPR
    </button>
    <button onClick={() => router.push("/dashboard/reportes")} className="hover:text-white transition-colors pb-5 pt-5">
      Reportes
    </button>
  </div>

  {/* Controles Derechos: Solo Perfil */}
  <div className="flex items-center gap-4">
    <div className="relative">
      <button 
        onClick={() => setShowProfileMenu(!showProfileMenu)} 
        className="flex items-center gap-2 pl-4 border-l border-[#2a2a2a] focus:outline-none cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366f1] to-purple-500 flex items-center justify-center font-bold text-xs text-white">
          J
        </div>
        <span className="text-sm font-medium hidden sm:inline text-gray-200">Jiménez</span>
      </button>

      {showProfileMenu && (
        <div className="absolute right-0 mt-3 w-56 bg-[#181818] border border-[#2a2a2a] rounded-xl shadow-2xl p-2 z-50">
          <div className="px-3 py-2 border-b border-[#2a2a2a] mb-1">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Cuenta Activa</p>
            <p className="text-sm font-semibold truncate text-white">Operador</p>
          </div>
          
          <button 
            onClick={() => {
              setShowProfileMenu(false);
              router.push("/dashboard/profile"); 
            }}
            className="w-full text-left px-3 py-2 text-xs rounded-lg text-gray-300 hover:bg-[#222] transition-colors flex items-center gap-2 cursor-pointer"
          >
            ⚙ Modificar Perfil
          </button>
          
          <button 
            onClick={async () => {
              try {
                setShowProfileMenu(false);
                await supabase.auth.signOut();
                router.push("/auth/login");
              } catch (err) {
                router.push("/auth/login");
              }
            }}
            className="w-full text-left px-3 py-2 text-xs rounded-lg text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 border-t border-[#2a2a2a] mt-1 pt-2 cursor-pointer"
          >
            ✕ Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  </div>
</nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="p-6 sm:p-10 max-w-7xl mx-auto">
        
        <header className="mb-8">
          <span className="text-xs tracking-[0.3em] text-[#888] uppercase block mb-1">Registros Computacionales</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Historial de Lecturas ALPR</h1>
          <p className="text-xs text-gray-500 mt-1">Monitoreo histórico de patentes identificadas mediante Visión por Computadora.</p>
        </header>

        {/* BARRA DE FILTROS Y BÚSQUEDA */}
        <section className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 bg-[#181818] border border-[#2a2a2a] p-4 rounded-2xl shadow-xl">
          <div className="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="Buscar por placa o marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111] border border-[#2a2a2a] text-white text-xs rounded-xl pl-4 pr-10 py-3 outline-none focus:border-[#6366f1] transition-colors placeholder:text-[#444]"
            />
          </div>

          <div className="flex bg-[#111] p-1 border border-[#2a2a2a] rounded-xl w-full sm:w-auto">
            <button 
              onClick={() => setFilterType("ALL")}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all ${filterType === "ALL" ? "bg-[#6366f1] text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilterType("IN")}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all ${filterType === "IN" ? "bg-emerald-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
            >
              Ingresos
            </button>
            <button 
              onClick={() => setFilterType("OUT")}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all ${filterType === "OUT" ? "bg-red-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
            >
              Salidas
            </button>
          </div>
        </section>

        {/* TABLA DE DATOS */}
        <section className="bg-[#181818] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2a2a2a] bg-[#141414] text-xs uppercase tracking-wider text-gray-400 font-bold">
                  <th className="py-4 px-6">Evento</th>
                  <th className="py-4 px-6">Placa / Patente</th>
                  <th className="py-4 px-6">Vehículo</th>
                  <th className="py-4 px-6">Bahía Asignada</th>
                  <th className="py-4 px-6 text-right">Fecha y Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a] text-xs">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-[#1f1f1f] transition-colors group">
                      <td className="py-4 px-6">
                        <span className={`inline-block font-mono font-bold px-2.5 py-1 rounded-md tracking-wider text-[10px] ${
                          record.tipo_evento === "IN" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          {record.tipo_evento === "IN" ? "◆ INGRESO" : "◇ SALIDA"}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono font-bold tracking-widest text-white group-hover:text-[#6366f1] transition-colors">
                        <span className="bg-[#111] border border-[#2a2a2a] px-2 py-1 rounded uppercase">
                          {record.placa}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-300 font-medium">{record.marca_vehiculo}</td>
                      <td className="py-4 px-6 font-mono text-gray-400 font-bold">{record.bahia_id}</td>
                      <td className="py-4 px-6 text-right text-gray-500 font-mono">
                        {new Date(record.detectado_at).toLocaleString("es-ES")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500 uppercase tracking-widest text-[10px]">
                      Ningún registro coincide con los filtros establecidos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
}