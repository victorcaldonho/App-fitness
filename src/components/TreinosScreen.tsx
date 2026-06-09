import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Dumbbell, 
  Flame, 
  CheckCircle, 
  Trophy, 
  Sparkles, 
  Clock, 
  Check, 
  Play, 
  TrendingUp,
  Award,
  Zap,
  Activity,
  Eye,
  Info,
  HelpCircle
} from 'lucide-react';
import { ScreenType, ObjectiveType, WorkoutType } from '../types';
import { safeStorage } from '../safeStorage';
import { getOrCreateUserId, syncDashboardStats, syncActivities } from '../supabaseClient';
import { EXERCISE_DEMO_DATABASE, getGenericExerciseDemo } from '../data/demonstrations';

interface TreinosScreenProps {
  onNavigate: (screen: ScreenType) => void;
  objective: ObjectiveType | null;
  setObjective: (obj: ObjectiveType | null) => void;
  workoutType: WorkoutType | null;
  setWorkoutType: (type: WorkoutType | null) => void;
}

interface Exercise {
  name: string;
  muscleGroup: string;
}

export default function TreinosScreen({
  onNavigate,
  objective,
  setObjective,
  workoutType,
  setWorkoutType,
}: TreinosScreenProps) {
  
  const [selectedTreino, setSelectedTreino] = useState<'A' | 'B' | 'C' | null>(null);
  const [completedExercises, setCompletedExercises] = useState<{ [key: string]: boolean }>({});
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // 1. Get custom exercises depending on chosen user objective
  const getExercisesForSplit = (obj: ObjectiveType | null, split: 'A' | 'B' | 'C'): Exercise[] => {
    const isWeightLoss = obj === 'PERDER PESO';
    
    if (split === 'A') {
      // 4 Peito, 2 Ombros, 2 Triceps
      if (isWeightLoss) {
        return [
          { name: 'Flexão de Braço Dinâmica (Peso Corporal)', muscleGroup: 'PEITO' },
          { name: 'Supino Inclinado com Halteres (Foco Definição)', muscleGroup: 'PEITO' },
          { name: 'Crucifixo Reto com Halteres', muscleGroup: 'PEITO' },
          { name: 'Crossover Polia Alta (Foco Miolo/Cardio)', muscleGroup: 'PEITO' },
          { name: 'Desenvolvimento com Halteres no Banco', muscleGroup: 'OMBROS' },
          { name: 'Elevação Lateral de Alta Cadência', muscleGroup: 'OMBROS' },
          { name: 'Tríceps no Pulley Alto com Corda', muscleGroup: 'TRÍCEPS' },
          { name: 'Tríceps Coice Unilateral na Polia', muscleGroup: 'TRÍCEPS' }
        ];
      } else {
        // GANHAR MASSA or HIPERTROFIA
        return [
          { name: 'Supino Reto com Barra Olímpica', muscleGroup: 'PEITO' },
          { name: 'Supino Inclinado com Halteres Pesados', muscleGroup: 'PEITO' },
          { name: 'Crucifixo Inclinado com Halteres', muscleGroup: 'PEITO' },
          { name: 'Supino Declinado com Barra', muscleGroup: 'PEITO' },
          { name: 'Desenvolvimento Militar Barra Livre em Pé', muscleGroup: 'OMBROS' },
          { name: 'Elevação Lateral com Carga Progressiva', muscleGroup: 'OMBROS' },
          { name: 'Tríceps Testa na Barra W (Banco Reto)', muscleGroup: 'TRÍCEPS' },
          { name: 'Tríceps Francês Sentado com Halter Pesado', muscleGroup: 'TRÍCEPS' }
        ];
      }
    }

    if (split === 'B') {
      // 4 Costas, 2 Ombros, 2 Biceps
      if (isWeightLoss) {
        return [
          { name: 'Puxador Alto Frente com Barra', muscleGroup: 'COSTAS' },
          { name: 'Remada Curvada com Halteres (Pegada Supinada)', muscleGroup: 'COSTAS' },
          { name: 'Remada Sentada na Máquina Triângulo', muscleGroup: 'COSTAS' },
          { name: 'Pulldown com Corda (Metabólico)', muscleGroup: 'COSTAS' },
          { name: 'Desenvolvimento Arnold Sentado', muscleGroup: 'OMBROS' },
          { name: 'Crucifixo Invertido Sentado com Halteres', muscleGroup: 'OMBROS' },
          { name: 'Rosca Direta Clássica com Barra W', muscleGroup: 'BÍCEPS' },
          { name: 'Rosca Martelo Alternada com Halteres', muscleGroup: 'BÍCEPS' }
        ];
      } else {
        // GANHAR MASSA / HIPERTROFIA
        return [
          { name: 'Levantamento Terra (Força Base)', muscleGroup: 'COSTAS' },
          { name: 'Barra Fixa - Pegada Aberta (ou Graviton)', muscleGroup: 'COSTAS' },
          { name: 'Remada Curvada com Barra Reta Maciça', muscleGroup: 'COSTAS' },
          { name: 'Remada Unilateral com Halter Pesado (Serrote)', muscleGroup: 'COSTAS' },
          { name: 'Desenvolvimento Militar Sentado com Halteres', muscleGroup: 'OMBROS' },
          { name: 'Crucifixo Invertido na Polia Alta', muscleGroup: 'OMBROS' },
          { name: 'Rosca Direta com Barra Reta de Aço', muscleGroup: 'BÍCEPS' },
          { name: 'Rosca Scott com Barra W Concentrada', muscleGroup: 'BÍCEPS' }
        ];
      }
    }

    // Split C: Inferior Completo (Quadríceps, Isquiotibiais, Glúteos, Panturrilhas)
    if (isWeightLoss) {
      return [
        { name: 'Agachamento Livre com Peso Corporal (Completo)', muscleGroup: 'INFERIOR COMPLETO' },
        { name: 'Leg Press 45º Contínuo de Alta Repetição', muscleGroup: 'INFERIOR COMPLETO' },
        { name: 'Cadeira Extensora com Isometria no Topo', muscleGroup: 'INFERIOR COMPLETO' },
        { name: 'Cadeira Flexora Sentado', muscleGroup: 'INFERIOR COMPLETO' },
        { name: 'Afundo Dinâmico com Passadas Alternadas', muscleGroup: 'INFERIOR COMPLETO' },
        { name: 'Stiff Unilateral ou Bilateral Halteres Leves', muscleGroup: 'INFERIOR COMPLETO' },
        { name: 'Elevação Pélvica Rápida no Solo', muscleGroup: 'INFERIOR COMPLETO' },
        { name: 'Gêmeos em Pé (Panturrilhas) Explosivo', muscleGroup: 'INFERIOR COMPLETO' }
      ];
    } else {
      // GANHAR MASSA / HIPERTROFIA
      return [
        { name: 'Agachamento Livre Traseiro Barra Pesada', muscleGroup: 'INFERIOR COMPLETO' },
        { name: 'Leg Press 45º Pesado Repetições Estritas', muscleGroup: 'INFERIOR COMPLETO' },
        { name: 'Cadeira Extensora (Carga Máxima de Quadríceps)', muscleGroup: 'INFERIOR COMPLETO' },
        { name: 'Mesa Flexora Deitado (Isometria de Isquiotibiais)', muscleGroup: 'INFERIOR COMPLETO' },
        { name: 'Stiff Pesado com Barra Reta Olímpica', muscleGroup: 'INFERIOR COMPLETO' },
        { name: 'Avanço Caminhando com Halteres e Passadas Longas', muscleGroup: 'INFERIOR COMPLETO' },
        { name: 'Elevação Pélvica Pesada com Barra Reta', muscleGroup: 'INFERIOR COMPLETO' },
        { name: 'Gêmeos em Pé Máquina (Carga de Panturrilhas)', muscleGroup: 'INFERIOR COMPLETO' }
      ];
    }
  };

  const activeExercises = getExercisesForSplit(objective, selectedTreino || 'A');

  useEffect(() => {
    setExpandedExercise(null);
  }, [selectedTreino, objective]);

  // Toggle singular exercise
  const handleToggleExercise = (index: number) => {
    const key = `${objective}-${selectedTreino}-${index}`;
    setCompletedExercises(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Helper values
  const currentCompletedCount = activeExercises.filter(
    (_, idx) => !!completedExercises[`${objective}-${selectedTreino}-${idx}`]
  ).length;

  const isCurrentWorkoutFinished = activeExercises.length > 0 && currentCompletedCount === activeExercises.length;
  const progressPctValue = activeExercises.length > 0 
    ? Math.round((currentCompletedCount / activeExercises.length) * 100) 
    : 0;

  // Handle finalize entire split (Treino A, B or C)
  const handleFinalizeWorkout = async () => {
    if (!selectedTreino || !objective) return;
    setIsSyncing(true);

    const splitName = selectedTreino === 'A' 
      ? 'Treino A (Peito, Ombros e Tríceps)' 
      : selectedTreino === 'B' 
      ? 'Treino B (Costas, Ombros e Bíceps)' 
      : 'Treino C (Inferior Completo)';

    try {
      // Get current hours
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const timeStr = `${hrs}:${mins}`;

      // Initialize defaults
      let cachedStats: any = {
        waterLogged: 0,
        workoutsCompleted: 0,
        caloriesLogged: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        weights: [],
        activities: [],
        trainedDays: [false, false, false, false, false, false, false]
      };

      const localStr = safeStorage.getItem('vita_dashboard_stats');
      if (localStr) {
        try {
          const parsed = JSON.parse(localStr);
          cachedStats = { ...cachedStats, ...parsed };
        } catch (e) {
          console.error(e);
        }
      }

      // Aligned with weekday: Seg=0, Ter=1, Qua=2, Qui=3, Sex=4, Sáb=5, Dom=6
      const getDayIdx = () => {
        const d = new Date().getDay();
        return d === 0 ? 6 : d - 1;
      };
      const currentDayIdx = getDayIdx();
      
      const newTrainedDays = Array.isArray(cachedStats.trainedDays) 
        ? [...cachedStats.trainedDays] 
        : [false, false, false, false, false, false, false];
      
      newTrainedDays[currentDayIdx] = true;
      const updatedWorkouts = newTrainedDays.filter(Boolean).length;

      const newActivity = {
        id: Date.now().toString(),
        time: timeStr,
        text: `Ficha ${selectedTreino} Executada: ${splitName} finalizado com sucesso! 💪 Metabólico ativo.`,
        category: 'workout'
      };

      const currentActs = Array.isArray(cachedStats.activities) ? [...cachedStats.activities] : [];
      const updatedActs = [newActivity, ...currentActs].slice(0, 35);

      cachedStats.workoutsCompleted = updatedWorkouts;
      cachedStats.trainedDays = newTrainedDays;
      cachedStats.activities = updatedActs;

      // Update offline persistence
      safeStorage.setItem('vita_dashboard_stats', JSON.stringify(cachedStats));

      // Push safely to Cloud Supabase DB Client
      const activeUserId = getOrCreateUserId();
      if (activeUserId) {
        await Promise.all([
          syncDashboardStats(activeUserId, {
            waterLogged: cachedStats.waterLogged ?? 0,
            waterGoal: 3200,
            workoutsCompleted: updatedWorkouts,
            workoutsGoal: 5,
            caloriesLogged: cachedStats.caloriesLogged ?? 0,
            caloriesGoal: 2400,
            protein: cachedStats.protein ?? 0,
            proteinGoal: 160,
            carbs: cachedStats.carbs ?? 0,
            carbsGoal: 250,
            fats: cachedStats.fats ?? 0,
            fatsGoal: 80
          }),
          syncActivities(activeUserId, updatedActs.map(act => ({
            id: act.id,
            time: act.time,
            text: act.text,
            category: act.category
          })))
        ]);
        console.log('[TreinosScreen] Successfully updated Supabase engine stats.');
      }
      
      // Trigger local congratulations screen
      setShowCelebration(true);
    } catch (err) {
      console.error('[TreinosScreen] Critical finalization error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleBack = () => {
    if (showCelebration) {
      setShowCelebration(false);
      setSelectedTreino(null);
    } else if (selectedTreino) {
      setSelectedTreino(null);
    } else if (objective) {
      setObjective(null);
    } else {
      onNavigate('home');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 overflow-x-hidden pb-12 w-full">
      
      {/* HEADER HERO BANNER */}
      <div className="relative h-[25vh] sm:h-[180px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop"
          alt="Sports & Workout Athlete"
          className="w-full h-full object-cover object-center filter brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <button 
            onClick={handleBack}
            id="btn-treinos-back"
            className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer border border-white/5 text-white shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-1.5 font-sans bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
            <span className="text-white text-xs font-light tracking-tight">VITA</span>
            <span className="text-blue-500 text-xs font-black tracking-tight">ELITE</span>
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* CORE CONTAINER INTERFACE PANEL */}
      <div className="relative z-10 bg-slate-950 rounded-t-[38px] -mt-[45px] px-6 pt-7 flex-1 max-w-xl mx-auto w-full">
        
        <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-6" />

        <AnimatePresence mode="wait">
          
          {/* STEP 1: CHOOSE THE PHYSICAL OBJECTIVE */}
          {!objective && (
            <motion.div
              key="step-objective"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="p-1 rounded-lg bg-blue-500/10 border border-blue-500/15">
                  <Dumbbell className="w-4 h-4 text-blue-500" />
                </span>
                <span className="text-slate-500 text-[10px] font-mono font-black uppercase tracking-[0.2em]">Alta Performance</span>
              </div>
              <h2 className="text-white text-3xl font-black tracking-tight font-sans mb-1 leading-none">SEU OBJETIVO</h2>
              <p className="text-slate-450 text-xs mb-6">Selecione seu foco corporal ideal para calibrar seus splits de treino:</p>

              <div className="flex flex-col gap-4">
                {[
                  { id: 'PERDER PESO', desc: 'Definição, aceleração metabólica e resistência física.' },
                  { id: 'GANHAR MASSA', desc: 'Construção muscular de força bruta e sobrecarga progressiva.' },
                  { id: 'HIPERTROFIA', desc: 'Aumento de volume muscular com alto tempo sob tensão.' }
                ].map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => setObjective(obj.id as ObjectiveType)}
                    id={`btn-target-${obj.id.toLowerCase().replace(' ', '-')}`}
                    className="flex flex-col bg-slate-900 hover:bg-slate-850 border border-slate-800/80 hover:border-blue-500/30 p-5 rounded-2xl cursor-pointer active:scale-[0.99] transition-all group text-left shadow-lg shadow-black/10"
                  >
                    <div className="flex justify-between items-center w-full mb-1">
                      <span className="text-white font-black tracking-wide text-lg font-sans">{obj.id}</span>
                      <Sparkles className="w-4.5 h-4.5 text-blue-500 group-hover:scale-125 group-hover:animate-spin transition-transform" />
                    </div>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">{obj.desc}</p>
                  </button>
                ))}
              </div>

              {/* MOTIVATIONAL WATERMARK */}
              <div className="mt-14 flex flex-col items-center text-center px-4">
                <div className="w-10 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mb-6 rounded-full" />
                <p className="text-white text-[16px] font-black leading-snug uppercase max-w-sm tracking-wide font-sans">
                  A DISCIPLINA É A <span className="text-blue-500 underline decoration-2 underline-offset-4">PONTE</span> ENTRE SEUS OBJETIVOS E SUAS <span className="text-blue-500 underline decoration-2 underline-offset-4">CONQUISTAS</span>.
                </p>
                <p className="text-slate-500 font-bold font-mono text-[9px] tracking-[0.3em] uppercase mt-4">
                  VITA ELITE • HIGH PERFORMANCE
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SELECT WORKOUT SPLIT FICHA (TREINO A / B / C) */}
          {objective && !selectedTreino && !showCelebration && (
            <motion.div
              key="step-split-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-1.5 mb-1.5 text-blue-500 font-mono text-[9px] font-extrabold uppercase tracking-widest">
                <span>OBJETIVO: {objective}</span>
              </div>
              <h2 className="text-white text-3xl font-black tracking-tight font-sans mb-1 leading-none">FICHAS DE TREINO</h2>
              <p className="text-slate-400 text-xs mb-6">Qual split muscular você deseja executar hoje?</p>

              <div className="flex flex-col gap-4">
                {[
                  {
                    id: 'A',
                    nome: 'TREINO A',
                    alvo: 'Peito, Ombros e Tríceps',
                    detalhe: '8 Exercícios: 4 Peito, 2 Ombros e 2 Tríceps • Foco superior anterior.',
                    bgGradient: 'from-blue-900/40 to-slate-900/90 hover:border-blue-500/40'
                  },
                  {
                    id: 'B',
                    nome: 'TREINO B',
                    alvo: 'Costas, Ombros e Bíceps',
                    detalhe: '8 Exercícios: 4 Costas, 2 Ombros e 2 Bíceps • Foco tração posterior.',
                    bgGradient: 'from-sky-900/40 to-slate-900/90 hover:border-sky-500/40'
                  },
                  {
                    id: 'C',
                    nome: 'TREINO C',
                    alvo: 'Membros Inferiores Completo',
                    detalhe: '8 Exercícios: Quadríceps, Posterior, Glúteos & Panturrilhas • Foco pernas completo.',
                    bgGradient: 'from-emerald-900/40 to-slate-900/90 hover:border-emerald-500/40'
                  }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTreino(t.id as 'A' | 'B' | 'C')}
                    id={`btn-split-${t.id}`}
                    className={`flex flex-col bg-gradient-to-br ${t.bgGradient} border border-slate-800/80 p-5 rounded-2xl cursor-pointer active:scale-[0.99] transition-all group text-left`}
                  >
                    <div className="flex justify-between items-center w-full mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black border border-white/20 bg-white/5 text-white/90 px-2 py-0.5 rounded">SPLIT {t.id}</span>
                        <span className="text-white font-black tracking-wide text-lg font-sans">{t.nome}</span>
                      </div>
                      <Dumbbell className="w-5 h-5 text-blue-500 group-hover:scale-120 group-hover:rotate-12 transition-transform" />
                    </div>
                    <span className="text-blue-400 font-extrabold text-[15px] font-sans mb-1.5">{t.alvo}</span>
                    <p className="text-slate-400 text-xs leading-relaxed font-medium">{t.detalhe}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setObjective(null)}
                className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-white font-mono font-black uppercase tracking-wider py-3 border border-slate-850/60 rounded-xl hover:bg-slate-900/30 transition-all cursor-pointer"
              >
                Voltar e alterar Objetivo
              </button>
            </motion.div>
          )}

          {/* STEP 3: EXERCISE SHEET DETAIL (TREINO A / B / C SCROLL) */}
          {objective && selectedTreino && !showCelebration && (
            <motion.div
              key="step-exercise-sheet"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col"
            >
              {/* TOP SEGMENTED SWITCH BAR */}
              <div className="flex bg-slate-900 border border-slate-800/80 p-1.5 rounded-2xl mb-5 shadow-inner">
                {['A', 'B', 'C'].map((letter) => (
                  <button
                    key={letter}
                    onClick={() => setSelectedTreino(letter as 'A' | 'B' | 'C')}
                    className={`flex-1 text-center py-2.5 rounded-xl font-bold font-sans text-xs uppercase tracking-wide transition-colors cursor-pointer ${
                      selectedTreino === letter 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-950/40' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850/45'
                    }`}
                  >
                    Treino {letter}
                  </button>
                ))}
              </div>

              {/* SHEET HEADLINE STATS */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 mb-5 shadow-md">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-mono font-black text-blue-500 uppercase tracking-widest">Ativo: {objective}</span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400 font-bold">
                    <Clock className="w-3.5 h-3.5 text-blue-500 animate-pulse" /> ~50 MIN
                  </span>
                </div>
                
                <h3 className="text-white text-xl font-black font-sans leading-none mb-1">
                  Ficha {selectedTreino} • {
                    selectedTreino === 'A' 
                      ? 'Peito, Ombros e Tríceps' 
                      : selectedTreino === 'B' 
                      ? 'Costas, Ombros e Bíceps' 
                      : 'Inferior Completo'
                  }
                </h3>
                <p className="text-[11px] text-slate-450 leading-relaxed mb-4">
                  Dividido de forma milimétrica com a orientação de <span className="font-mono text-blue-400 font-bold">3 séries de 12 repetições (3x12)</span> por exercício para ganho de desempenho ótimo.
                </p>

                {/* VISUAL SESSION STATUS */}
                <div className="border-t border-slate-800/80 pt-3.5 mt-3.5">
                  <div className="flex justify-between items-center text-xs font-black text-slate-300 mb-2">
                    <span className="flex items-center gap-1.5 uppercase font-sans tracking-wide">
                      <Trophy className="w-4 h-4 text-amber-500" /> Progression
                    </span>
                    <span className="font-mono text-blue-400 text-xs">
                      {currentCompletedCount} de {activeExercises.length} ({progressPctValue}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPctValue}%` }}
                      transition={{ type: 'spring', stiffness: 80, damping: 12 }}
                      className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* EXERCISE ITEMS LIST WITH CONFIRM BUTTON */}
              <div className="flex flex-col gap-3.5 mb-8">
                {activeExercises.map((ex, index) => {
                  const key = `${objective}-${selectedTreino}-${index}`;
                  const isDone = !!completedExercises[key];
                  const isExpanded = expandedExercise === index;
                  const demo = EXERCISE_DEMO_DATABASE[ex.name] || getGenericExerciseDemo(ex.name);

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      id={`exercise-card-${index}`}
                      className={`flex flex-col rounded-2xl border transition-all ${
                        isDone 
                          ? 'bg-slate-950/40 border-emerald-500/20 text-slate-500 shadow-inner' 
                          : isExpanded
                          ? 'bg-slate-900 border-blue-500/40 text-slate-100 shadow-lg ring-1 ring-blue-500/10'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-705 border-slate-800 text-slate-100 shadow-md'
                      }`}
                    >
                      {/* Main Card Header Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5">
                        {/* Exercise Name and Muscles */}
                        <div className="flex-1 flex flex-col min-w-0 pr-2">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded uppercase ${
                              isDone 
                                ? 'bg-slate-900 text-slate-600 border border-slate-850' 
                                : ex.muscleGroup === 'PEITO' 
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/15'
                                : ex.muscleGroup === 'OMBROS'
                                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/15'
                                : ex.muscleGroup === 'TRÍCEPS'
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15'
                                : ex.muscleGroup === 'COSTAS'
                                ? 'bg-violet-500/10 text-violet-400 border border-violet-500/15'
                                : ex.muscleGroup === 'BÍCEPS'
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/15'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                            }`}>
                              {ex.muscleGroup}
                            </span>

                            <span className={`text-[9px] font-mono font-bold uppercase ${
                              isDone ? 'text-slate-600' : 'text-amber-500 font-extrabold'
                            }`}>
                              ORIENTAÇÃO: 3x12
                            </span>

                            {/* EXCELENT GUIDE EXPANDABLE LINK POINTER TRIGGER */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedExercise(isExpanded ? null : index);
                              }}
                              className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded border flex items-center gap-1 transition-all cursor-pointer ${
                                isExpanded
                                  ? 'bg-blue-600 text-white border-blue-500'
                                  : 'bg-slate-950 text-blue-400 border-blue-500/20 hover:border-blue-500/40'
                              }`}
                            >
                              <Eye className="w-3 h-3" />
                              {isExpanded ? 'Ocultar Guia' : 'Como Executar?'}
                            </button>
                          </div>
                          <h4 className={`text-[15px] font-black leading-snug font-sans tracking-tight break-words ${isDone ? 'line-through text-slate-500 font-medium' : 'text-white'}`}>
                            {ex.name}
                          </h4>
                        </div>

                        {/* SIDE RECTANGULAR ACTION BUTTON TO CONFIRM DETECTED */}
                        <div>
                          <button
                            onClick={() => handleToggleExercise(index)}
                            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-sans font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all ${
                              isDone 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 text-[10px] font-bold' 
                                : 'bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            {isDone ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3px]" />
                                <span>Executado ✓</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 text-blue-500 fill-blue-500" />
                                <span>Confirmar</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* EXPANDED INTERACTIVE DEMONSTRATION BOX */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18, ease: 'easeInOut' }}
                            className="overflow-hidden border-t border-slate-800/80 bg-slate-950/45 rounded-b-2xl"
                          >
                            <div className="p-4.5 space-y-4 text-xs font-sans text-slate-300">
                              {/* Step by step execution directions */}
                              <div className="space-y-2">
                                <h5 className="font-extrabold text-blue-400 uppercase tracking-widest font-mono text-[10px] flex items-center gap-1.5">
                                  <HelpCircle className="w-3.5 h-3.5 text-blue-400" /> Modo de Execução:
                                </h5>
                                <ol className="list-decimal list-inside space-y-1.5 pl-0.5">
                                  {demo.execution.map((step, sIdx) => (
                                    <li key={sIdx} className="leading-relaxed text-slate-350">
                                      <span className="text-slate-200">{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>

                              {/* Coach insights grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-900/80">
                                <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/40">
                                  <span className="font-mono font-black text-[9px] text-amber-500 tracking-wider uppercase block mb-1">
                                    💡 DICA DE ELITE:
                                  </span>
                                  <p className="text-slate-400 text-[11px] leading-relaxed">
                                    {demo.proTip}
                                  </p>
                                </div>
                                <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/40">
                                  <span className="font-mono font-black text-[9px] text-cyan-400 tracking-wider uppercase block mb-1">
                                    🫁 TÉCNICA DE RESPIRAÇÃO:
                                  </span>
                                  <p className="text-slate-400 text-[11px] leading-relaxed">
                                    {demo.breathing}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* DYNAMIC VERDE (GREEN) WORKOUT FINALIZE CONTROLLER BUTTON */}
              {isCurrentWorkoutFinished && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4.5 shadow-xl text-center flex flex-col items-center mb-6"
                >
                  <Award className="w-8 h-8 text-emerald-400 mb-2.5 animate-bounce" />
                  <h4 className="text-white text-base font-black uppercase font-sans tracking-tight mb-1">Ficha Completada!</h4>
                  <p className="text-slate-400 text-xs mb-4">Você executou perfeitamente todos os exercícios da ficha {selectedTreino}.</p>

                  <button
                    onClick={handleFinalizeWorkout}
                    disabled={isSyncing}
                    className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-sans font-black tracking-widest text-xs uppercase transition-colors shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSyncing ? (
                      <span>SALVANDO...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[3px]" />
                        <span>Finalizar meu treino</span>
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              <button
                onClick={() => setSelectedTreino(null)}
                className="flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-white font-mono font-bold uppercase tracking-wider py-3 border border-slate-850/60 rounded-xl hover:bg-slate-900/30 transition-all cursor-pointer"
              >
                Voltar para lista de splits
              </button>
            </motion.div>
          )}

          {/* CELEBRATION CONGRATULATIONS SCREEN */}
          {showCelebration && (
            <motion.div
              key="step-congrats"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center py-8"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mb-6 shadow-xl shadow-emerald-900/10 relative">
                <Trophy className="w-10 h-10 text-emerald-400 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center border-2 border-slate-950 text-[8px] text-slate-950 font-black">✓</span>
              </div>

              <span className="text-emerald-400 font-mono font-black text-xs tracking-widest uppercase mb-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" /> TREINO CONCLUÍDO
              </span>
              <h2 className="text-white text-3xl font-black tracking-tight font-sans mb-3">PARABÉNS, ATLETA!</h2>
              
              <p className="text-slate-300 text-sm max-w-sm mb-6 leading-relaxed">
                O seu treino foi salvo no aplicativo.
              </p>

              <div className="flex flex-col gap-3.5 w-full">
                <button
                  onClick={() => {
                    setShowCelebration(false);
                    // Reset all selected completions of current objective
                    const cleanObj: any = {};
                    activeExercises.forEach((_, idx) => {
                      cleanObj[`${objective}-${selectedTreino}-${idx}`] = false;
                    });
                    setCompletedExercises(prev => ({ ...prev, ...cleanObj }));
                    setSelectedTreino(null);
                  }}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans font-black tracking-wider text-xs uppercase cursor-pointer transition-colors shadow-md"
                >
                  Novo Treino / Alterar Ficha
                </button>

                <button
                  onClick={() => {
                    setShowCelebration(false);
                    onNavigate('home');
                  }}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-xs font-sans font-black tracking-wider uppercase cursor-pointer transition-all"
                >
                  Voltar para o Início
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
