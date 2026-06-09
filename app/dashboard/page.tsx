"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

// Estructura de datos inicial para los espacios (A futuro se conectará a Supabase + tu IA)
const initialSpots = [
  { id: "A-01", section: "Zona A", occupied: true, plate: "LP-2345-X" },
  { id: "A-02", section: "Zona A", occupied: false, plate: null },
  { id: "A-03", section: "Zona A", occupied: true, plate: "SCZ-9811-A" },
  { id: "A-04", section: "Zona A", occupied: false, plate: null },
  { id: "B-01", section: "Zona B", occupied: false, plate: null },
  { id: "B-02", section: "Zona B", occupied: true, plate: "CBBA-4521-U" },
  { id: "B-03", section: "Zona B", occupied: false, plate: null },
  { id: "B-04", section: "Zona B", occupied: false, plate: null },
];
// 1. Definimos la estructura que tiene cada espacio de parqueo
interface ParkingSpot {
  id: string;
  section: string;
  occupied: boolean;
  plate: string | null;
}
export default function DashboardPage() {
  const router = useRouter();
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [spots, setSpots] = useState<ParkingSpot[]>(initialSpots);
  const [showNotifications, setShowNotifications] = useState(false); // Panel de la campana
  const [showProfileModal, setShowProfileModal] = useState(false); // Modal de edición de perfil
  const supabase = createClient();
  

// Datos de prueba para las notificaciones cyber
const [notifications, setNotifications] = useState([
  { id: 1, text: "Nueva lectura ALPR: LP-2345-X ingresó a Bahía A-01", time: "Hace 2 min", unread: true },
  { id: 2, text: "Alerta: Bahía B-02 ha superado las 3 horas de estancia", time: "Hace 15 min", unread: true },
  { id: 3, text: "Sistema: Núcleo de Visión por Computadora operando al 98%", time: "Hace 1 hora", unread: false },
]);

  // Estadísticas calculadas dinámicamente
  const totalSpots = spots.length;
  const occupiedCount = spots.filter((s) => s.occupied).length;
  const freeSpots = totalSpots - occupiedCount;

  // Lógica interactiva para abrir el modal al hacer clic en un espacio
  const handleSpotClick = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
  };

  // Función para simular la reserva o liberación del espacio (Manual Bypass)
  const toggleSpotStatus = () => {
    if (!selectedSpot) return;

    setSpots(
      spots.map((spot) => {
        if (spot.id === selectedSpot.id) {
          const isNowOccupied = !spot.occupied;
          return {
            ...spot,
            occupied: isNowOccupied,
            plate: isNowOccupied ? "RESERVA-MANUAL" : null,
          };
        }
        return spot;
      })
    );
    setSelectedSpot(null); // Cierra el modal
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white font-sans relative">
      
      {/* 1. BARRA SUPERIOR DE NAVEGACIÓN */}
      <nav className="h-16 border-b border-[#2a2a2a] bg-[#141414] px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
  {/* Logo */}
  <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/dashboard")}>
    <div className="w-8 h-8 bg-[#6366f1] rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">P</div>
    <span className="font-bold tracking-wider text-sm hidden sm:inline uppercase text-white">Smart Parking</span>
  </div>
  
  {/* Centro: Pestañas de Navegación */}
  <div className="hidden md:flex gap-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
    <button className="text-white border-b-2 border-[#6366f1] pb-5 pt-5 transition-colors">
      Monitoreo
    </button>
    <button onClick={() => router.push("/dashboard/historial")} className="hover:text-white transition-colors pb-5 pt-5">
      Historial ALPR
    </button>
    <button onClick={() => router.push("/dashboard/reportes")} className="hover:text-white transition-colors pb-5 pt-5">
      Reportes
    </button>
  </div>

  {/* Controles Derechos: Solo Perfil */}
  <div className="flex items-center gap-4">
    <div className="relative">
      {/* Botón que abre/cierra el menú del perfil */}
      <button 
        onClick={() => setShowProfileMenu(!showProfileMenu)} 
        className="flex items-center gap-2 pl-4 border-l border-[#2a2a2a] focus:outline-none cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366f1] to-purple-500 flex items-center justify-center font-bold text-xs text-white">
          J
        </div>
        <span className="text-sm font-medium hidden sm:inline text-gray-200">Administrador</span>
      </button>

      {/* Menú Desplegable */}
      {showProfileMenu && (
        <div className="absolute right-0 mt-3 w-56 bg-[#181818] border border-[#2a2a2a] rounded-xl shadow-2xl p-2 z-50">
          <div className="px-3 py-2 border-b border-[#2a2a2a] mb-1">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Cuenta Activa</p>
            <p className="text-sm font-semibold truncate text-white">Administrador</p>
          </div>
          
          {/* ACCIÓN: Ir a Modificar Perfil */}
          <button 
            onClick={() => {
              setShowProfileMenu(false);
              router.push("/dashboard/profile"); 
            }}
            className="w-full text-left px-3 py-2 text-xs rounded-lg text-gray-300 hover:bg-[#222] transition-colors flex items-center gap-2 cursor-pointer"
          >
            ⚙ Modificar Perfil
          </button>
          
          {/* ACCIÓN: Cerrar Sesión Real */}
          <button 
            onClick={async () => {
              try {
                setShowProfileMenu(false);
                await supabase.auth.signOut();
                router.push("/auth/login");
              } catch (err) {
                console.error("Error al cerrar sesión:", err);
                // Fallback por si Supabase falla, te manda al login igual
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

      {/* CONTENIDO PRINCIPAL DEL DASHBOARD */}
      <div className="p-6 sm:p-10 max-w-7xl mx-auto">
        
        {/* HEADER DE BIENVENIDA */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-[#1f1f1f]">
          <div>
            <span className="text-xs tracking-[0.3em] text-[#888] uppercase block mb-1">
              Smart Parking System
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">Panel de Control</h1>
          </div>
          <div className="flex items-center gap-3 bg-[#181818] border border-[#2a2a2a] rounded-xl px-4 py-2 text-sm text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            IA Core: Listo para Enlace
          </div>
        </header>

        {/* 2. CARDS DE MÉTRICAS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Espacios Disponibles</p>
            <p className="text-4xl font-bold mt-2 text-emerald-400">{freeSpots} <span className="text-base font-normal text-gray-600">/ {totalSpots}</span></p>
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
          </div>

          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Ocupación Actual</p>
            <p className="text-4xl font-bold mt-2 text-indigo-400">{((occupiedCount / totalSpots) * 100).toFixed(0)}%</p>
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
          </div>

          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Vehículos Activos</p>
            <p className="text-4xl font-bold mt-2 text-white">{occupiedCount}</p>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          </div>
        </section>

        {/* 3. VISTA SECCIONAL: MAPA + HISTORIAL */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* GRILLA INTERACTIVA DEL ESTACIONAMIENTO */}
          <div className="lg:col-span-2 bg-[#181818] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Monitoreo de Areas</h2>
              <p className="text-xs text-gray-500 mt-1">Haz clic en cualquier espacio para reservar o alterar su estado manualmente.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {spots.map((spot) => (
                <div 
                  key={spot.id}
                  onClick={() => handleSpotClick(spot)}
                  className={`group relative border rounded-xl p-4 flex flex-col justify-between h-32 cursor-pointer transition-all duration-200 ${
                    spot.occupied 
                      ? "bg-red-950/10 border-red-900/40 hover:bg-red-950/20" 
                      : "bg-emerald-950/10 border-emerald-900/40 hover:border-[#6366f1] hover:scale-[1.02]"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-gray-400">{spot.id}</span>
                    <span className={`w-2.5 h-2.5 rounded-full shadow-lg ${spot.occupied ? "bg-red-500 shadow-red-500/50" : "bg-emerald-500 shadow-emerald-500/50"}`}></span>
                  </div>

                  <div className="mt-2 text-center">
                    {spot.occupied ? (
                      <div>
                        <span className="bg-[#242424] border border-[#333] text-gray-300 text-[10px] font-mono px-2 py-1 rounded tracking-widest uppercase block mb-1 truncate">
                          {spot.plate}
                        </span>
                        <span className="text-[10px] text-red-400 uppercase tracking-widest font-medium">Ocupado</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-medium group-hover:text-white transition-colors">Disponible</span>
                    )}
                  </div>
                  <span className="text-[9px] text-gray-600 block mt-2 text-right font-light">{spot.section}</span>
                </div>
              ))}
            </div>
          </div>

          {/* COLA DE EVENTOS ALPR */}
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Eventos de Placas IA</h2>
                <p className="text-xs text-gray-500 mt-1">Cola de reconocimiento de cámaras.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#111] border border-[#222] rounded-xl text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg font-mono font-bold">IN</div>
                    <div>
                      <p className="font-mono font-semibold text-white">LP-2345-X</p>
                      <p className="text-[10px] text-gray-500">Bahía: A-01</p>
                    </div>
                  </div>
                  <span className="text-gray-600 font-mono text-[10px]">Hace 4 min</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#111] border border-[#222] rounded-xl text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 text-red-400 rounded-lg font-mono font-bold">OUT</div>
                    <div>
                      <p className="font-mono font-semibold text-white">SCZ-4012-K</p>
                      <p className="text-[10px] text-gray-500">Bahía liberada</p>
                    </div>
                  </div>
                  <span className="text-gray-600 font-mono text-[10px]">Hace 12 min</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 bg-[#1f1f1f] border border-[#2a2a2a] text-gray-400 text-xs font-medium py-3 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
              <span className="w-2 h-2 rounded-full bg-[#6366f1] animate-ping"></span>
              Escuchando Flujo de Cámaras Realtime...
            </button>
          </div>
        </section>
      </div>

      {/* 4. MODAL INTERACTIVO DE RESERVA / BYPASS */}
      {selectedSpot && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#2a2a2a] w-full max-w-sm rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold text-white">Espacio {selectedSpot.id}</h2>
              <span className="text-xs font-mono px-2 py-1 bg-[#111] rounded border border-[#2a2a2a] text-gray-400">
                {selectedSpot.section}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-6">Modificación o Reserva manual del estado de la infraestructura.</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-[#111] border border-[#2a2a2a] rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Estado Detectado</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${selectedSpot.occupied ? "bg-red-500" : "bg-emerald-500"}`}></div>
                  <p className={`font-bold text-sm ${selectedSpot.occupied ? "text-red-400" : "text-emerald-400"}`}>
                    {selectedSpot.occupied ? `Ocupado por [${selectedSpot.plate}]` : "Vacío / Disponible"}
                  </p>
                </div>
              </div>

              {/* Botón de Acción Principal */}
              <button 
                onClick={toggleSpotStatus}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-colors shadow-lg ${
                  selectedSpot.occupied 
                    ? "bg-red-600 hover:bg-red-700 shadow-red-950/20" 
                    : "bg-[#6366f1] hover:bg-[#5558e8] shadow-indigo-950/20"
                }`}
              >
                {selectedSpot.occupied ? "Liberar espacio (Bypass)" : "Reservar espacio"}
              </button>
              
              {/* Botón de Salida */}
              <button 
                onClick={() => setSelectedSpot(null)}
                className="w-full py-3 bg-transparent hover:bg-[#222] text-gray-400 hover:text-white rounded-xl text-xs font-medium transition-colors"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>

        //LOGICA DE NAVEGACION
        
        
      )}
    </main>
  );
}