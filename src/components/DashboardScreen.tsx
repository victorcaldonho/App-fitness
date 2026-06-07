import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Dumbbell, 
  Flame, 
  Apple, 
  Droplet, 
  TrendingUp, 
  Sparkles, 
  Plus, 
  Trash2, 
  Zap, 
  Compass, 
  Award, 
  Calendar,
  Scale,
  Activity,
  ChevronRight,
  Cloud,
  Check,
  Copy,
  RefreshCw
} from 'lucide-react';
import { ScreenType, ObjectiveType } from '../types';
import { safeStorage } from '../safeStorage';
import { 
  getOrCreateUserId, 
  syncDashboardStats, 
  syncWeights, 
  syncActivities, 
  fetchAllUserData 
} from '../supabaseClient';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenType) => void;
  objective: ObjectiveType | null;
}

export default function DashboardScreen({ onNavigate, objective }: DashboardScreenProps) {
  // Stats state (persisted or simulated)
  const [waterLogged, setWaterLogged] = useState<number>(1750); // ml
  const [waterGoal, setWaterGoal] = useState<number>(3000); // ml
  
  const [trainedDays, setTrainedDays] = useState<boolean[]>([true, true, true, false, false, false, false]);
  const [workoutsCompleted, setWorkoutsCompleted] = useState<number>(3); // days this week
  const [workoutsGoal] = useState<number>(7);
  
  const [caloriesLogged, setCaloriesLogged] = useState<number>(1850);
  const [caloriesGoal, setCaloriesGoal] = useState<number>(2400);
  
  // Macronutrients (g)
  const [protein, setProtein] = useState<number>(115);
  const [proteinGoal, setProteinGoal] = useState<number>(160);
  const [carbs, setCarbs] = useState<number>(180);
  const [carbsGoal, setCarbsGoal] = useState<number>(250);
  const [fats, setFats] = useState<number>(55);
  const [fatsGoal, setFatsGoal] = useState<number>(80);

  // Weight History
  const [weights, setWeights] = useState<{ date: string; value: number }[]>([
    { date: 'Jan', value: 84.5 },
    { date: 'Fev', value: 83.8 },
    { date: 'Mar', value: 83.1 },
    { date: 'Abr', value: 82.3 },
    { date: 'Mai', value: 81.5 }
  ]);
  const [newWeight, setNewWeight] = useState<string>('');

  // Supabase Sync states
  const [syncId, setSyncId] = useState<string>('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [customSyncIdInput, setCustomSyncIdInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Daily log activities
  const [activities, setActivities] = useState<{ id: string; time: string; text: string; category: 'workout' | 'meal' | 'water' }[]>([
    { id: '1', time: '08:15', text: 'Copo d\'água de 350ml extraído', category: 'water' },
    { id: '2', time: '13:00', text: 'Refeição de Almoço de Alta Proteína', category: 'meal' },
    { id: '3', time: '18:45', text: 'Treino de Força (Peito e Tríceps)', category: 'workout' }
  ]);

  const getCurrentDayIndex = () => {
    const day = new Date().getDay(); // 0 is Sunday, 1-6 are Mon-Sat
    return day === 0 ? 6 : day - 1;
  };

  const toggleTrainedDay = (index: number) => {
    const updated = [...trainedDays];
    updated[index] = !updated[index];
    setTrainedDays(updated);
    
    const count = updated.filter(Boolean).length;
    setWorkoutsCompleted(count);

    const daysOfWeek = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
    const dayName = daysOfWeek[index];
    const isChecked = updated[index];
    
    const newAct = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      text: isChecked 
        ? `Marcou treino na ${dayName} como realizado!` 
        : `Desmarcou treino na ${dayName}`,
      category: 'workout' as const
    };
    const updatedActs = [newAct, ...activities];
    setActivities(updatedActs);
    
    saveStats(waterLogged, count, caloriesLogged, protein, carbs, fats, weights, updatedActs, updated);
  };

  // Read set goals or set defaults based on user objective
  useEffect(() => {
    // 1. Read cached values standard first
    const cachedStats = safeStorage.getItem('vita_dashboard_stats');
    if (cachedStats) {
      try {
        const data = JSON.parse(cachedStats);
        setWaterLogged(data.waterLogged ?? 1750);
        
        const loadedTrainedDays = data.trainedDays ?? [true, true, true, false, false, false, false];
        setTrainedDays(loadedTrainedDays);
        setWorkoutsCompleted(loadedTrainedDays.filter(Boolean).length);

        setCaloriesLogged(data.caloriesLogged ?? 1850);
        setProtein(data.protein ?? 115);
        setCarbs(data.carbs ?? 180);
        setFats(data.fats ?? 55);
        if (data.weights) setWeights(data.weights);
        if (data.activities) setActivities(data.activities);
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Fetch and set active Supabase User UUID
    const activeId = getOrCreateUserId();
    setSyncId(activeId);

    // 3. Populate from Remote Cloud Database
    setSyncStatus('syncing');
    fetchAllUserData(activeId)
      .then((res) => {
        if (res.success) {
          if (res.dashboard) {
            setWaterLogged(res.dashboard.water_logged ?? 1750);
            setWaterGoal(res.dashboard.water_goal ?? 3200);
            setWorkoutsCompleted(res.dashboard.workouts_completed ?? 3);
            setCaloriesLogged(res.dashboard.calories_logged ?? 1850);
            setCaloriesGoal(res.dashboard.calories_goal ?? 2400);
            setProtein(res.dashboard.protein ?? 115);
            setProteinGoal(res.dashboard.protein_goal ?? 160);
            setCarbs(res.dashboard.carbs ?? 180);
            setCarbsGoal(res.dashboard.carbs_goal ?? 250);
            setFats(res.dashboard.fats ?? 55);
            setFatsGoal(res.dashboard.fats_goal ?? 80);
          }
          if (res.weights && res.weights.length > 0) {
            setWeights(res.weights);
          }
          if (res.activities && res.activities.length > 0) {
            const formatted = res.activities.map((a: any, idx: number) => ({
              id: a.id || String(idx),
              time: a.time,
              text: a.text,
              category: a.category as 'workout' | 'meal' | 'water'
            }));
            setActivities(formatted);
          }
          setSyncStatus('synced');
        } else {
          setSyncStatus('error');
        }
      })
      .catch((e) => {
        console.error("Error loaded:", e);
        setSyncStatus('error');
      });
  }, []);

  // Set default goals based on global user objectives
  useEffect(() => {
    if (objective === 'PERDER PESO') {
      setCaloriesGoal(2000);
      setProteinGoal(150);
      setCarbsGoal(180);
      setFatsGoal(60);
      setWaterGoal(3200);
    } else if (objective === 'GANHAR MASSA') {
      setCaloriesGoal(3100);
      setProteinGoal(180);
      setCarbsGoal(400);
      setFatsGoal(90);
      setWaterGoal(4000);
    } else if (objective === 'HIPERTROFIA') {
      setCaloriesGoal(2700);
      setProteinGoal(200);
      setCarbsGoal(310);
      setFatsGoal(75);
      setWaterGoal(3800);
    }
  }, [objective]);

  // Save to localStorage helper & sync to Supabase Cloud Engine
  const saveStats = (
    wLog: number, 
    workComp: number, 
    calL: number, 
    p: number, 
    c: number, 
    f: number,
    wHistory = weights,
    actList = activities,
    tDays = trainedDays
  ) => {
    // A. Keep Local Storage cached for instant fluid speed
    safeStorage.setItem('vita_dashboard_stats', JSON.stringify({
      waterLogged: wLog,
      workoutsCompleted: workComp,
      caloriesLogged: calL,
      protein: p,
      carbs: c,
      fats: f,
      weights: wHistory,
      activities: actList,
      trainedDays: tDays
    }));

    // B. Push asynchronously to Supabase
    const activeUserId = safeStorage.getItem('vita_supabase_sync_id') || syncId;
    if (activeUserId) {
      setSyncStatus('syncing');
      Promise.all([
        syncDashboardStats(activeUserId, {
          waterLogged: wLog,
          waterGoal,
          workoutsCompleted: workComp,
          workoutsGoal,
          caloriesLogged: calL,
          caloriesGoal,
          protein: p,
          proteinGoal,
          carbs: c,
          carbsGoal,
          fats: f,
          fatsGoal
        }),
        syncWeights(activeUserId, wHistory),
        syncActivities(activeUserId, actList)
      ]).then(() => {
        setSyncStatus('synced');
      }).catch((e) => {
        console.error('Supabase Sync error:', e);
        setSyncStatus('error');
      });
    }
  };

  const handleManualSyncIdConnect = () => {
    const trimmed = customSyncIdInput.trim().toUpperCase();
    if (!trimmed) return;
    
    safeStorage.setItem('vita_supabase_sync_id', trimmed);
    setSyncId(trimmed);
    setSyncStatus('syncing');

    fetchAllUserData(trimmed).then((res) => {
      if (res.success) {
        if (res.dashboard) {
          setWaterLogged(res.dashboard.water_logged ?? 0);
          setWaterGoal(res.dashboard.water_goal ?? 3000);
          setWorkoutsCompleted(res.dashboard.workouts_completed ?? 0);
          setCaloriesLogged(res.dashboard.calories_logged ?? 0);
          setCaloriesGoal(res.dashboard.calories_goal ?? 2000);
          setProtein(res.dashboard.protein ?? 0);
          setProteinGoal(res.dashboard.protein_goal ?? 160);
          setCarbs(res.dashboard.carbs ?? 0);
          setCarbsGoal(res.dashboard.carbs_goal ?? 250);
          setFats(res.dashboard.fats ?? 0);
          setFatsGoal(res.dashboard.fats_goal ?? 80);
        }
        if (res.weights && res.weights.length > 0) {
          setWeights(res.weights);
        }
        if (res.activities && res.activities.length > 0) {
          const formatted = res.activities.map((a: any, idx: number) => ({
            id: a.id || String(idx),
            time: a.time,
            text: a.text,
            category: a.category as 'workout' | 'meal' | 'water'
          }));
          setActivities(formatted);
        }
        setSyncStatus('synced');
        setCustomSyncIdInput('');
        alert('Dados da nuvem Supabase carregados com sucesso!');
      } else {
        setSyncStatus('error');
        alert('Falha ao obter os dados da nuvem. Verifique o Código de Sincronização.');
      }
    }).catch(err => {
      setSyncStatus('error');
      console.error(err);
      alert('Erro de conexão ao carregar dados do Supabase.');
    });
  };

  const copySyncIdToClipboard = () => {
    navigator.clipboard.writeText(syncId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Log fast actions
  const addWater = (ml: number) => {
    const updated = waterLogged + ml;
    setWaterLogged(updated);
    
    const newAct = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      text: `Ingeriu ${ml}ml de água pura`,
      category: 'water' as const
    };
    const updatedActs = [newAct, ...activities];
    setActivities(updatedActs);
    saveStats(updated, workoutsCompleted, caloriesLogged, protein, carbs, fats, weights, updatedActs);
  };

  const addWorkoutLog = (type: string) => {
    const dayIdx = getCurrentDayIndex();
    const updatedTrainedDays = [...trainedDays];
    updatedTrainedDays[dayIdx] = true;
    setTrainedDays(updatedTrainedDays);
    
    const updatedCount = updatedTrainedDays.filter(Boolean).length;
    setWorkoutsCompleted(updatedCount);
    
    const newAct = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      text: `Registrou treino: ${type}`,
      category: 'workout' as const
    };
    const updatedActs = [newAct, ...activities];
    setActivities(updatedActs);
    saveStats(waterLogged, updatedCount, caloriesLogged + 350, protein, carbs, fats, weights, updatedActs, updatedTrainedDays);
    setCaloriesLogged(prev => prev + 350); // Burn activity allowance simulation
  };

  const addMealLog = (cal: number, protValue: number, carbsValue: number, fatsValue: number, description: string) => {
    const updatedCalCount = caloriesLogged + cal;
    const updatedP = protein + protValue;
    const updatedC = carbs + carbsValue;
    const updatedF = fats + fatsValue;

    setCaloriesLogged(updatedCalCount);
    setProtein(updatedP);
    setCarbs(updatedC);
    setFats(updatedF);

    const newAct = {
      id: Math.random().toString(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      text: `Ingetou refeição: ${description} (+${cal} kcal)`,
      category: 'meal' as const
    };
    const updatedActs = [newAct, ...activities];
    setActivities(updatedActs);
    saveStats(waterLogged, workoutsCompleted, updatedCalCount, updatedP, updatedC, updatedF, weights, updatedActs);
  };

  const registerWeight = () => {
    const parsed = parseFloat(newWeight);
    if (!isNaN(parsed) && parsed > 30 && parsed < 220) {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const nextMonth = months[weights.length % 12];
      const updatedWeights = [...weights, { date: nextMonth, value: parsed }];
      setWeights(updatedWeights);
      setNewWeight('');

      const newAct = {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        text: `Novo peso registrado: ${parsed}kg`,
        category: 'workout' as const
      };
      const updatedActs = [newAct, ...activities];
      setActivities(updatedActs);
      saveStats(waterLogged, workoutsCompleted, caloriesLogged, protein, carbs, fats, updatedWeights, updatedActs);
    }
  };

  // Reset metrics
  const resetStats = () => {
    setWaterLogged(0);
    setWorkoutsCompleted(0);
    setCaloriesLogged(0);
    setProtein(0);
    setCarbs(0);
    setFats(0);
    const clearedTrainedDays = [false, false, false, false, false, false, false];
    setTrainedDays(clearedTrainedDays);
    const clearedActs = [{
      id: Math.random().toString(),
      time: 'Agora',
      text: 'Seu painel de métricas foi zerado para reiniciar a jornada.',
      category: 'workout' as const
    }];
    setActivities(clearedActs);
    saveStats(0, 0, 0, 0, 0, 0, weights, clearedActs, clearedTrainedDays);
  };

  // Calculate percentages
  const waterPct = Math.min(100, Math.round((waterLogged / waterGoal) * 100));
  const kcalPct = Math.min(100, Math.round((caloriesLogged / caloriesGoal) * 100));
  const workoutPct = Math.min(100, Math.round((workoutsCompleted / workoutsGoal) * 100));

  const proteinPct = Math.min(100, Math.round((protein / proteinGoal) * 100));
  const carbsPct = Math.min(100, Math.round((carbs / carbsGoal) * 100));
  const fatsPct = Math.min(100, Math.round((fats / fatsGoal) * 100));

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 overflow-x-hidden pb-12">
      {/* HERO COVER BANNER */}
      <div className="relative h-[22vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1470&auto=format&fit=crop"
          alt="Alta Performance Dashboard"
          className="w-full h-full object-cover object-center filter brightness-[0.4] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        
        {/* Navigation line */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')}
            id="btn-dash-back"
            className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-white p-2.5 rounded-full backdrop-blur-md transition-colors cursor-pointer"
          >
            <Compass className="w-5 h-5 rotate-180" />
          </button>
          
          <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black font-mono tracking-widest text-slate-300">CORE ANALYTICS</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-slate-950 rounded-t-[35px] -mt-[40px] px-6 pt-6 flex-1 max-w-xl mx-auto w-full">
        {/* Mock phone slider block */}
        <div className="w-10 h-1 bg-slate-800 rounded-full mx-auto mb-6" />

        {/* HEADER BRAND TITLE */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-white text-2xl font-black font-sans tracking-tight">DASHBOARD DE ALTA PERFORMANCE</h2>
            <p className="text-slate-450 text-xs mt-0.5 leading-relaxed">
              Consistência metabólica, hidratação e constância do treino num só painel inteligente.
            </p>
          </div>
          <Award className="w-7 h-7 text-emerald-500 flex-shrink-0" />
        </div>

        {/* METACARD: CURRENT OBJECTIVE */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-500 animate-bounce" />
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Meta Otimizada Ativa</p>
              <h4 className="text-white font-black text-sm uppercase">{objective || 'MANTER ROTINA SAUDÁVEL'}</h4>
            </div>
          </div>
          <button
            onClick={() => onNavigate('imc')}
            className="text-[10px] font-bold text-blue-500 hover:underline uppercase tracking-wider"
          >
            Mudar Meta
          </button>
        </div>

        {/* CORE STATS Bento Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          
          {/* Calorie Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black tracking-widest text-slate-450 uppercase font-mono">Calorias (kcal)</span>
              <Flame className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-3xl font-black font-mono">{caloriesLogged}</span>
                <span className="text-slate-500 text-xs">/ {caloriesGoal}</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full mt-3.5 overflow-hidden">
                <div 
                  className="bg-red-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${kcalPct}%` }}
                />
              </div>
              <span className="text-[9px] text-slate-400 block mt-1.5 font-bold font-mono text-right">{kcalPct}% batido</span>
            </div>
          </div>

          {/* Water card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black tracking-widest text-slate-450 uppercase font-mono">Água Ingerida</span>
              <Droplet className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-3xl font-black font-mono">{waterLogged}</span>
                <span className="text-slate-500 text-xs">/ {waterGoal}ml</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full mt-3.5 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${waterPct}%` }}
                />
              </div>
              <span className="text-[9px] text-slate-400 block mt-1.5 font-bold font-mono text-right">{waterPct}% batido</span>
            </div>
          </div>

          {/* Workout Adherence */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between col-span-2 shadow-lg">
            <div className="flex flex-col mb-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-black tracking-widest text-slate-350 uppercase">Treinos Semanais (Frequência)</span>
                </div>
                <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15">
                  {workoutsCompleted} de 7 dias
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                * Toque diretamente nos dias abaixo para marcar ou desmarcar os dias em que se exercitou.
              </p>
            </div>
            
            <div className="grid grid-cols-7 h-20 gap-1.5 mt-3 mb-1">
              {[
                { label: 'Seg', desc: 'Segunda-feira' },
                { label: 'Ter', desc: 'Terça-feira' },
                { label: 'Qua', desc: 'Quarta-feira' },
                { label: 'Qui', desc: 'Quinta-feira' },
                { label: 'Sex', desc: 'Sexta-feira' },
                { label: 'Sáb', desc: 'Sábado' },
                { label: 'Dom', desc: 'Domingo' }
              ].map((item, idx) => {
                const isChecked = trainedDays[idx];
                const isCurrentSelf = getCurrentDayIndex() === idx;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleTrainedDay(idx)}
                    className="flex-1 flex flex-col items-center gap-1.5 focus:outline-none group relative cursor-pointer"
                    title={`Marcar/Desmarcar Treino de ${item.desc}`}
                  >
                    <div className={`w-full h-11 rounded-xl relative overflow-hidden transition-all duration-300 border ${
                      isChecked 
                        ? 'bg-emerald-500/20 border-emerald-500/30' 
                        : isCurrentSelf 
                        ? 'bg-slate-900 border-blue-500/40'
                        : 'bg-slate-950 border-slate-850 hover:border-slate-705'
                    }`}>
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: isChecked ? '100%' : '0%' }}
                        className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-emerald-500 to-teal-400"
                        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                      />
                      
                      {/* Check mark indicator overlay */}
                      {isChecked && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3.5px]" />
                        </div>
                      )}

                      {!isChecked && isCurrentSelf && (
                        <div className="absolute inset-x-0 top-1.5 flex justify-center text-[7px] font-mono select-none text-blue-400 font-bold tracking-tight uppercase">
                          Hoje
                        </div>
                      )}
                    </div>
                    
                    <span className={`text-[10px] font-black font-sans uppercase tracking-wider transition-colors ${
                      isChecked 
                        ? 'text-emerald-400' 
                        : isCurrentSelf 
                        ? 'text-blue-400' 
                        : 'text-slate-400'
                    }`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* MACRONUTRIENTS GRAPH RING / PROGRESS BOX */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-6">
          <h3 className="text-white text-sm font-black uppercase tracking-wider flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <Apple className="w-4 h-4 text-emerald-500" />
            Balanço de Macronutrientes (Diário)
          </h3>

          <div className="flex flex-col gap-4">
            {/* Protein bar progress */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-extrabold text-slate-300">Proteínas (Guerreiro)</span>
                <span className="font-mono text-blue-400 font-bold">{protein}g / {proteinGoal}g</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${proteinPct}%` }}
                />
              </div>
            </div>

            {/* Carbs progress */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-extrabold text-slate-300">Carboidratos (Energia)</span>
                <span className="font-mono text-yellow-500 font-bold">{carbs}g / {carbsGoal}g</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-yellow-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${carbsPct}%` }}
                />
              </div>
            </div>

            {/* Fats progress */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-extrabold text-slate-300">Gorduras (Hormonal)</span>
                <span className="font-mono text-purple-500 font-bold">{fats}g / {fatsGoal}g</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${fatsPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE ACTIONS BOX TO SIMULATE METRICS PERFORMANCE */}
        <div className="bg-slate-900/65 border border-slate-800 rounded-3xl p-5 mb-6">
          <h4 className="text-white text-xs font-black uppercase tracking-widest font-mono text-slate-300 mb-3 flex items-center gap-1">
            <Plus className="w-4 h-4 text-emerald-500" />
            Adicionar Registro Rápido
          </h4>
          
          <div className="grid grid-cols-2 gap-3.5">
            {/* Add Water options */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-450">Beber Água</span>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => addWater(250)}
                  className="flex-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white rounded-xl py-2 text-xs font-extrabold active:scale-95 transition-all"
                >
                  +250ml
                </button>
                <button 
                  onClick={() => addWater(500)}
                  className="flex-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white rounded-xl py-2 text-xs font-extrabold active:scale-95 transition-all"
                >
                  +500ml
                </button>
              </div>
            </div>

            {/* Log meal shortcut */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-455">Adicionar Refeição</span>
              <button 
                onClick={() => addMealLog(450, 25, 60, 10, 'Lanche Balanceado')}
                id="btn-quick-log-meal"
                className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl py-2 text-xs font-extrabold active:scale-95 transition-all"
              >
                +450 kcal / +25g Prot
              </button>
            </div>

            {/* Log training */}
            <div className="flex flex-col gap-2 col-span-2 mt-1">
              <span className="text-[10px] uppercase font-bold text-slate-450">Registrar Treinamento</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => addWorkoutLog('Hipertrofia Musculação')}
                  id="btn-quick-log-workout-force"
                  className="flex-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs py-2 rounded-xl font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
                >
                  <Dumbbell className="w-3.5 h-3.5 text-red-500" />
                  +1 Musculação
                </button>

                <button 
                  onClick={() => addWorkoutLog('Aeróbico HIIT')}
                  id="btn-quick-log-workout-cardio"
                  className="flex-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs py-2 rounded-xl font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  +1 Aeróbico
                </button>
              </div>
            </div>
          </div>
        </div>



        {/* DAILY LOG TIMELINE QUEUE HISTORY */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-8">
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
            <h3 className="text-white text-xs font-black uppercase tracking-wider font-mono">Registro e Histórico Recente</h3>
            <button 
              onClick={resetStats}
              id="btn-reset-dash-stats"
              className="text-[10px] text-red-400 hover:text-red-300 font-extrabold flex items-center gap-1 uppercase tracking-wider"
              title="Zera calorias, água e exercícios de hoje"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Zerar Hoje
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {activities.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-4 font-bold">Nenhum evento registrado ainda.</p>
            ) : (
              activities.map((act) => (
                <div 
                  key={act.id} 
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-850/80"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                      {act.time}
                    </span>
                    <p className="text-slate-100 font-bold text-xs">{act.text}</p>
                  </div>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    act.category === 'water' ? 'bg-blue-500' : act.category === 'meal' ? 'bg-purple-500' : 'bg-red-500'
                  }`} />
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
