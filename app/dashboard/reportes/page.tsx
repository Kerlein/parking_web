"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function ReportesPage() {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const supabase = createClient();

  // Datos simulados de analíticas para el Smart Parking
  const stats = {
    ingresosHoy: "Bs. 450",
    tiempoPromedio: "1h 45m",
    eficienciaIA: "98.4%",
    totalVehiculosMes: "1,240"
  };

  // Datos para la gráfica de ocupación por horas del día (Simulada con barras Tailwind)
  const ocupacionPorHoras = [
    { hora: "08:00", porcentaje: 40, color: "bg-indigo-500" },
    { hora: "10:00", porcentaje: 75, color: "bg-indigo-500" },
    { hora: "12:00", porcentaje: 95, color: "bg-red-500" }, // Hora pico
    { hora: "14:00", porcentaje: 85, color: "bg-indigo-500" },
    { hora: "16:00", porcentaje: 60, color: "bg-indigo-500" },
    { hora: "18:00", porcentaje: 90, color: "bg-red-500" }, // Hora pico salida oficina
    { hora: "20:00", porcentaje: 30, color: "bg-emerald-500" },
  ];

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      
      {/* NAVBAR SUPERIOR UNIFICADA */}
      <nav className="h-16 border-b border-[#2a2a2a] bg-[#141414] px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
  {/* Logo */}
  <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/dashboard")}>
    <div className="w-8 h-8 bg-[#6366f1] rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">P</div>
    <span className="font-bold tracking-wider text-sm hidden sm:inline uppercase text-white">Smart Parking</span>
  </div>
  
  {/* Centro: Reportes Activo */}
  <div className="hidden md:flex gap-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
    <button onClick={() => router.push("/dashboard")} className="hover:text-white transition-colors pb-5 pt-5 cursor-pointer">
      Monitoreo
    </button>
    <button onClick={() => router.push("/dashboard/historial")} className="hover:text-white transition-colors pb-5 pt-5 cursor-pointer">
      Historial ALPR
    </button>
    <button className="text-white border-b-2 border-[#6366f1] pb-5 pt-5 transition-colors">
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

      {/* CONTENIDO DE REPORTES */}
      <div className="p-6 sm:p-10 max-w-7xl mx-auto">
        <header className="mb-10">
          <span className="text-xs tracking-[0.3em] text-[#888] uppercase block mb-1">Business Intelligence</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Análisis de Rendimiento</h1>
          <p className="text-xs text-gray-500 mt-1">Métricas analíticas consolidadas de uso del suelo e ingresos optimizados por el núcleo IA.</p>
        </header>

        {/* METRICAS AVANZADAS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Recaudación Estimada (Hoy)</p>
            <p className="text-3xl font-black mt-2 text-emerald-400">{stats.ingresosHoy}</p>
            <span className="text-[10px] text-gray-500 block mt-2">◆ Basado en tarifa por minuto</span>
          </div>

          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Tiempo de Estancia Promedio</p>
            <p className="text-3xl font-black mt-2 text-white">{stats.tiempoPromedio}</p>
            <span className="text-[10px] text-indigo-400 block mt-2">▲ 5% menor que la semana pasada</span>
          </div>

          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Precisión de Detección IA</p>
            <p className="text-3xl font-black mt-2 text-indigo-400">{stats.eficienciaIA}</p>
            <span className="text-[10px] text-emerald-400 block mt-2">● Tasa de acierto de visión ALPR</span>
          </div>

          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Flujo Total Mensual</p>
            <p className="text-3xl font-black mt-2 text-gray-300">{stats.totalVehiculosMes}</p>
            <span className="text-[10px] text-gray-500 block mt-2">Vehículos únicos controlados</span>
          </div>
        </section>

        {/* PANALES GRÁFICOS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* GRÁFICA DE BARRAS NATIVA: FLUJO POR HORA */}
          <div className="lg:col-span-2 bg-[#181818] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Densidad de Ocupación por Horario</h2>
              <p className="text-xs text-gray-500 mt-1">Monitoreo de carga computado para predecir saturación.</p>
            </div>

            {/* Gráfica de Barras Verticales en puro CSS/Tailwind */}
            <div className="flex justify-between items-end h-64 px-4 pt-4 bg-[#111] border border-[#222] rounded-xl">
              {ocupacionPorHoras.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 w-full group">
                  {/* Tooltip de Porcentaje al pasar el mouse */}
                  <span className="text-[10px] font-mono font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.porcentaje}%
                  </span>
                  {/* Cuerpo de la Barra */}
                  <div 
                    style={{ height: `${item.porcentaje}%` }} 
                    className={`w-8 sm:w-12 ${item.color} rounded-t-lg transition-all duration-500 shadow-lg group-hover:brightness-125`}
                  ></div>
                  {/* Etiqueta de Hora */}
                  <span className="text-[10px] text-gray-500 font-mono mt-1 mb-2">
                    {item.hora}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* DISTRIBUCIÓN DE USO DE ZONAS */}
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Uso Seccional</h2>
                <p className="text-xs text-gray-500 mt-1">Zonas con mayor recurrencia de estacionamiento.</p>
              </div>

              {/* Barras de progreso horizontales */}
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-300">Zona A (Preferencial)</span>
                    <span className="text-indigo-400 font-mono">82%</span>
                  </div>
                  <div className="w-full bg-[#111] border border-[#222] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#6366f1] h-full rounded-full" style={{ width: "82%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-300">Zona B (General)</span>
                    <span className="text-emerald-400 font-mono">45%</span>
                  </div>
                  <div className="w-full bg-[#111] border border-[#222] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-300">Zona C (Carga / Descarga)</span>
                    <span className="text-red-400 font-mono">15%</span>
                  </div>
                  <div className="w-full bg-[#111] border border-[#222] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: "15%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTÓN EXPORTAR DATOS */}
            <button 
              onClick={() => alert("Generando reporte PDF...")}
              className="w-full mt-8 bg-[#222] hover:bg-[#2e2e2e] border border-[#333] text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar Reporte (PDF / CSV)
            </button>
          </div>

        </section>
      </div>
    </main>
  );
}