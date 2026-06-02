import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  Activity, 
  Bell, 
  Droplet, 
  Dumbbell, 
  Apple, 
  X,
  BarChart3
} from 'lucide-react';
import HomeScreen from './components/HomeScreen';
import IMCScreen from './components/IMCScreen';
import TreinosScreen from './components/TreinosScreen';
import DietaScreen from './components/DietaScreen';
import NotificationsScreen from './components/NotificationsScreen';
import DashboardScreen from './components/DashboardScreen';
import { ScreenType, ObjectiveType, WorkoutType } from './types';
import { safeStorage } from './safeStorage';
import { getOrCreateUserId, fetchAllUserData, syncProfile } from './supabaseClient';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  
  const [objective, setObjective] = useState<ObjectiveType | null>(() => {
    return (safeStorage.getItem('vita_objective') as ObjectiveType) || null;
  });
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(() => {
    return (safeStorage.getItem('vita_workout_type') as WorkoutType) || null;
  });

  // Load objective profile stats from Supabase on startup
  useEffect(() => {
    const userId = getOrCreateUserId();
    fetchAllUserData(userId).then((res) => {
      if (res.success && res.profile) {
        if (res.profile.objective) {
          setObjective(res.profile.objective as ObjectiveType);
          safeStorage.setItem('vita_objective', res.profile.objective);
        }
        if (res.profile.workout_type) {
          setWorkoutType(res.profile.workout_type as WorkoutType);
          safeStorage.setItem('vita_workout_type', res.profile.workout_type);
        }
      }
    }).catch(err => {
      console.warn("Could not auto load user profile on startup:", err);
    });
  }, []);

  useEffect(() => {
    if (objective) {
      safeStorage.setItem('vita_objective', objective);
      const userId = getOrCreateUserId();
      syncProfile(userId, objective, workoutType);
    }
  }, [objective]);

  useEffect(() => {
    if (workoutType) {
      safeStorage.setItem('vita_workout_type', workoutType);
      const userId = getOrCreateUserId();
      syncProfile(userId, objective, workoutType);
    }
  }, [workoutType]);

  // Layout mode switcher: simulator (phone view) or fluid full-width web
  const [useSimulator, setUseSimulator] = useState<boolean>(true);

  // Floating notification state for in-app alert simulation
  const [toastNotif, setToastNotif] = useState<{
    id: string;
    title: string;
    body: string;
    type: 'water' | 'workout' | 'meal';
  } | null>(null);

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

  // Set timeout to clear the simulated toast after 6 seconds
  useEffect(() => {
    if (!toastNotif) return;
    const timer = setTimeout(() => {
      setToastNotif(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [toastNotif]);

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    // Smooth scroll page back to top when navigating views
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sound and simulation push trigger function
  const triggerGlobalPush = (title: string, body: string, type: 'water' | 'workout' | 'meal') => {
    // 1. Synthesize audio notification - sweet twin bell sound
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const playNote = (time: number, freq: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, time);
          
          gain.gain.setValueAtTime(0, time);
          gain.gain.linearRampToValueAtTime(0.12, time + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
          
          osc.start(time);
          osc.stop(time + duration);
        };
        const now = ctx.currentTime;
        playNote(now, 880, 0.4); // A5 high note
        playNote(now + 0.08, 1174.66, 0.5); // D6 crisp tone
      }
    } catch (e) {
      console.error("Audio synth not permitted/supported", e);
    }

    // 2. Dispatch browser native push notification if enabled by system settings
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1474&auto=format&fit=crop'
        });
      } catch (e) {
        console.error("System Notification error", e);
      }
    }

    // 3. Clear existing toast and set new one
    setToastNotif(null);
    setTimeout(() => {
      setToastNotif({
        id: Math.random().toString(),
        title,
        body,
        type
      });
    }, 50);
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
      case 'notificacoes':
        return (
          <NotificationsScreen
            onNavigate={handleNavigate}
            objective={objective}
            triggerGlobalPush={triggerGlobalPush}
          />
        );
      case 'dashboard':
        return (
          <DashboardScreen
            onNavigate={handleNavigate}
            objective={objective}
          />
        );
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  const renderToastAlert = () => {
    if (!toastNotif) return null;

    const getIcon = () => {
      switch (toastNotif.type) {
        case 'water':
          return <Droplet className="w-5 h-5 text-blue-500" />;
        case 'workout':
          return <Dumbbell className="w-5 h-5 text-red-500 hover:animate-spin" />;
        case 'meal':
          return <Apple className="w-5 h-5 text-purple-500" />;
        default:
          return <Bell className="w-5 h-5 text-blue-400" />;
      }
    };

    const getBorderColor = () => {
      switch (toastNotif.type) {
        case 'water':
          return 'border-blue-500/40 shadow-blue-950/25';
        case 'workout':
          return 'border-red-500/40 shadow-red-950/25';
        case 'meal':
          return 'border-purple-500/40 shadow-purple-950/25';
        default:
          return 'border-slate-800 shadow-black/45';
      }
    };

    return (
      <motion.div
        initial={{ y: -65, opacity: 0, scale: 0.94 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -35, opacity: 0, scale: 0.94 }}
        transition={{ type: "spring", stiffness: 380, damping: 24 }}
        className={`bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border flex gap-3 shadow-xl w-full ${getBorderColor()}`}
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-center">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-black text-xs leading-tight tracking-tight uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {toastNotif.title}
          </p>
          <p className="text-slate-300 text-[10px] mt-1 leading-relaxed">{toastNotif.body}</p>
        </div>
        <button 
          onClick={() => setToastNotif(null)}
          className="flex-shrink-0 text-slate-500 hover:text-white self-start p-0.5 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    );
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

            {/* Float dashboard link */}
            <button
              onClick={() => handleNavigate('dashboard')}
              id="btn-nav-floating-dashboard"
              title="Dashboard de desempenho e metas"
              className={`border transition-all p-2.5 rounded-xl text-xs font-bold cursor-pointer ${
                currentScreen === 'dashboard' 
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-950/45' 
                  : 'bg-slate-800 hover:bg-slate-755 border-slate-700 text-slate-350 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            {/* Float notification configuration link */}
            <button
              onClick={() => handleNavigate('notificacoes')}
              id="btn-nav-floating-bell"
              title="Central de lembretes e alarmes push"
              className={`border transition-all p-2.5 rounded-xl text-xs font-bold cursor-pointer relative ${
                currentScreen === 'notificacoes' 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-950/45' 
                  : 'bg-slate-800 hover:bg-slate-755 border-slate-700 text-slate-350 hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 border border-slate-900 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 border border-slate-900 rounded-full" />
            </button>

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

            {/* Inside simulated phone push notification toast alert overlay */}
            <div className="absolute inset-x-0 top-7 z-[999] px-3">
              <AnimatePresence>
                {toastNotif && renderToastAlert()}
              </AnimatePresence>
            </div>
            
            <div className="flex-1 flex flex-col pt-3 bg-slate-950">
              {renderActiveScreen()}
            </div>
          </div>
        ) : (
          /* FLUID STANDARD CONTAINER LAYOUT */
          <div className="w-full max-w-4xl bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl shadow-black/50 relative">
            
            {/* Standard full width card alert overlay */}
            <div className="absolute inset-x-0 top-4 z-[999] px-6 max-w-md mx-auto">
              <AnimatePresence>
                {toastNotif && renderToastAlert()}
              </AnimatePresence>
            </div>

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
            <span>•</span>
            <span className="hover:text-blue-400 transition-colors pointer-events-none text-blue-500/80">LEMBULETO PUSH ✓</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
