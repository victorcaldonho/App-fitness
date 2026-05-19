import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Monitor, ShieldCheck, HeartPulse, Activity } from 'lucide-react';
import HomeScreen from './components/HomeScreen';
import IMCScreen from './components/IMCScreen';
import TreinosScreen from './components/TreinosScreen';
import DietaScreen from './components/DietaScreen';
import { ScreenType, ObjectiveType, WorkoutType } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [objective, setObjective] = useState<ObjectiveType | null>(null);
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(null);

  // Layout mode switcher: simulator (phone view) or fluid full-width web
  const [useSimulator, setUseSimulator] = useState<boolean>(true);

  // Auto detect if the actual screen size is already a mobile screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setUseSimulator(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    // Smooth scroll page back to top when navigating views
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;
      case 'imc':
        return (
          <IMCScreen 
            onNavigate={handleNavigate} 
            setGlobalObjective={setObjective} 
          />
        );
      case 'treinos':
        return (
          <TreinosScreen
            onNavigate={handleNavigate}
            objective={objective}
            setObjective={setObjective}
            workoutType={workoutType}
            setWorkoutType={setWorkoutType}
          />
        );
      case 'dieta':
        return (
          <DietaScreen
            onNavigate={handleNavigate}
            objective={objective}
            setObjective={setObjective}
          />
        );
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100 flex flex-col justify-between selection:bg-blue-650 selection:text-white">
      
      {/* PERSISTENT LIGHT GLOBAL BAR */}
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-md shadow-blue-900/40">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-0.5 leading-none">
                <span className="font-display font-light text-xl tracking-tight text-white">VITA</span>
                <span className="font-display font-black text-xl tracking-tight text-blue-500">ELITE</span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-slate-500 font-bold">ATLETAS PRO</span>
            </div>
          </div>

          {/* VIEW SWITCHER FOR DESKTOP WORKSPACE DEVELOPERS */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-950/45 backdrop-blur-lg px-2 py-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setUseSimulator(true)}
              id="btn-layout-simulator"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold tracking-wide transition-all cursor-pointer ${
                useSimulator 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/40' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Simulador Celular
            </button>
            <button
              onClick={() => setUseSimulator(false)}
              id="btn-layout-fullscreen"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold tracking-wide transition-all cursor-pointer ${
                !useSimulator 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/40' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Widescreen Cheio
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/15 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              AMBIENTE SEGURO
            </span>
            {currentScreen !== 'home' && (
              <button
                onClick={() => handleNavigate('home')}
                id="btn-nav-floating-home"
                className="bg-slate-800 hover:bg-slate-755 border border-slate-700 text-slate-350 hover:text-white transition-all px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer font-sans"
              >
                Início
              </button>
            )}
          </div>
        </div>
      </header>

      {/* CORE VIEWPORT SHELL */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex items-center justify-center py-6 px-4 md:px-8">
        {useSimulator ? (
          /* MOCK PHYSICAL DEVICE FOR MAJESTIC PRESENTATION */
          <div className="w-full max-w-[430px] min-h-[820px] bg-slate-950 rounded-[48px] shadow-2xl border-[10px] border-slate-900 overflow-hidden flex flex-col relative shadow-black/90">
            {/* Phone Top Notch decoration */}
            <div className="absolute top-0 inset-x-0 h-6 bg-slate-950 flex justify-center items-center z-50">
              <div className="w-24 h-4 bg-slate-950 rounded-b-xl flex items-center justify-center">
                <div className="w-12 h-1 bg-slate-900 rounded-full" />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col pt-3 bg-slate-950">
              {renderActiveScreen()}
            </div>
          </div>
        ) : (
          /* FLUID STANDARD CONTAINER LAYOUT */
          <div className="w-full max-w-4xl bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl shadow-black/50">
            {renderActiveScreen()}
          </div>
        )}
      </main>

      {/* FOOTER ACCENTS */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center select-none text-slate-500 text-[11px] font-mono tracking-wider">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 VITA ELITE ATHLETICS. LICENÇA SUPREMA.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-blue-500 transition-colors pointer-events-none">IMC COMPUTADOR</span>
            <span>•</span>
            <span className="hover:text-red-500 transition-colors pointer-events-none">TREINOS PRO</span>
            <span>•</span>
            <span className="hover:text-emerald-500 transition-colors pointer-events-none">DIETA METABÓLICA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
