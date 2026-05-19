import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Dumbbell, Flame, CheckCircle, Trophy, Sparkles, BookOpen, Clock, PlayCircle } from 'lucide-react';
import { ScreenType, ObjectiveType, WorkoutType } from '../types';

interface TreinosScreenProps {
  onNavigate: (screen: ScreenType) => void;
  objective: ObjectiveType | null;
  setObjective: (obj: ObjectiveType | null) => void;
  workoutType: WorkoutType | null;
  setWorkoutType: (type: WorkoutType | null) => void;
}

export default function TreinosScreen({
  onNavigate,
  objective,
  setObjective,
  workoutType,
  setWorkoutType,
}: TreinosScreenProps) {
  // Track completed exercises to calculate training progress
  const [completedItems, setCompletedItems] = useState<{ [key: string]: boolean }>({});

  // DATABASE OF WORKOUT PLANS
  const getMusculacaoPorObjetivo = (obj: string) => {
    if (obj === 'PERDER PESO') {
      return [
        { id: 'A', nome: 'A: Full Body Queima', itens: ['Agachamento + Press - 4x20', 'Burpees - 4x15', 'Remada Curvada - 4x20', 'Mountain Climbers - 4x30s', 'Polichinelos - 4x1min', 'Prancha Dinâmica - 3x1min'] },
        { id: 'B', nome: 'B: Superior & Resistência', itens: ['Supino Halter - 3x20', 'Puxada Aberta - 3x20', 'Flexão de Braços - 3x Max', 'Bíceps + Tríceps (Super-set) - 3x15', 'Desenvolvimento - 3x15', 'Abdominal Infra - 4x25'] },
        { id: 'C', nome: 'C: Inferior & Tônico', itens: ['Leg Press - 4x20', 'Afundo Progressivo - 3x15', 'Extensora - 4x25', 'Stiff com Halter - 3x20', 'Panturrilha - 4x30', 'Elevação Pélvica - 3x20'] },
      ];
    }
    if (obj === 'GANHAR MASSA') {
      return [
        { id: 'A', nome: 'A: Força Bruta (Push)', itens: ['Supino Reto Barra - 5x5', 'Desenvolvimento Militar - 4x8', 'Supino Inclinado - 3x10', 'Tríceps Testa - 4x8', 'Paralelas com Peso - 3x Falha', 'Elevação Lateral - 3x12'] },
        { id: 'B', nome: 'B: Tração (Pull)', itens: ['Levantamento Terra - 5x5', 'Barra Fixa - 4x Falha', 'Remada Cavalinho - 4x8', 'Rosca Direta W - 3x10', 'Encolhimento Barra - 4x10', 'Rosca Inversa - 3x12'] },
        { id: 'C', nome: 'C: Membros Inferiores', itens: ['Agachamento Livre - 5x5', 'Leg Press 45º - 4x10', 'Cadeira Flexora - 4x12', 'Extensora - 3x12', 'Panturrilha em Pé - 5x15', 'Agachamento Sumô - 3x10'] },
      ];
    }
    // Default or HIPERTROFIA
    return [
      { id: 'A', nome: 'A: Peito e Ombro', itens: ['Supino Inclinado - 4x10', 'Crucifixo Reto - 3x12', 'Cross Over - 4x15', 'Elev. Lateral Cabo - 4x12', 'Desenv. Arnold - 3x10', 'Flexão Diamante - 3x Falha'] },
      { id: 'B', nome: 'B: Costas e Trapézio', itens: ['Puxada Triângulo - 4x10', 'Remada Unilateral - 3x12', 'Pulldown com Corda - 4x15', 'Face Pull - 4x15', 'Remada Alta - 3x10', 'Lombar no Banco - 3x15'] },
      { id: 'C', nome: 'C: Braços e Pernas', itens: ['Rosca Scott - 4x10', 'Tríceps Pulley - 4x12', 'Rosca Concentrada - 3x12', 'Tríceps Francês - 3x12', 'Cadeira Extensora - 4x15', 'Mesa Flexora - 4x15'] },
    ];
  };

  const getAerobicoPorObjetivo = (obj: string) => {
    if (obj === 'PERDER PESO') {
      return [
        { id: '1', nome: 'HIIT Explosivo', itens: ['Tiro na Esteira - 30s (Max)', 'Descanso Ativo - 30s (Caminhada)', 'Repetições - 15 vezes', 'Polichinelos - 3x1 min', 'Corda - 5 min direto', 'Trote Regenerativo - 5 min'] },
      ];
    }
    if (obj === 'GANHAR MASSA') {
      return [
        { id: '1', nome: 'Cardio de Manutenção', itens: ['Caminhada Inclinada - 20 min', 'Frequência Cardíaca - 120bpm', 'Bicicleta Leve - 10 min', 'Alongamento Ativo', 'Mobilidade de Quadril', 'Core (Prancha) - 3x1 min'] },
      ];
    }
    // Default or HIPERTROFIA
    return [
      { id: '1', nome: 'Aeróbico Metabólico', itens: ['Corrida Moderada - 30 min', 'Escada (Step) - 10 min', 'Burpees Lentos - 3x12', 'Mountain Climbers - 3x45s', 'Remo Interno - 5 min', 'Caminhada Final - 5 min'] },
    ];
  };

  const handleBack = () => {
    if (workoutType) {
      setWorkoutType(null);
    } else if (objective) {
      setObjective(null);
    } else {
      onNavigate('home');
    }
  };

  const planosExibicao = workoutType === 'musculacao' 
    ? getMusculacaoPorObjetivo(objective || '') 
    : workoutType === 'aerobico' 
    ? getAerobicoPorObjetivo(objective || '') 
    : [];

  const handleToggleExercise = (key: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const totalExercises = planosExibicao.reduce((sum, p) => sum + p.itens.length, 0);
  const completedCount = Object.keys(completedItems).filter(
    k => completedItems[k] && planosExibicao.some(p => p.itens.some(item => `${p.id}-${item}` === k))
  ).length;

  const progressPercent = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 overflow-x-hidden pb-12">
      {/* HEADER HERO */}
      <div className="relative h-[28vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop"
          alt="Treinamento físico"
          className="w-full h-full object-cover object-center filter brightness-[0.5]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <button 
            onClick={handleBack}
            id="btn-treinos-back"
            className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer border border-white/5 text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-1 font-sans">
            <span className="text-white text-sm font-light tracking-tight">VITA</span>
            <span className="text-blue-500 text-sm font-black tracking-tight">ELITE</span>
          </div>
        </div>
      </div>

      {/* WORKOUT INTERFACE WINDOW */}
      <div className="relative z-10 bg-slate-950 rounded-t-[35px] -mt-[40px] px-6 pt-6 flex-1 max-w-xl mx-auto w-full">
        {/* Drag Indicator Mimic */}
        <div className="w-10 h-1 bg-slate-800" />

        <AnimatePresence mode="wait">
          {/* STEP 1: OBJECTIVE CHOOSER */}
          {!objective && (
            <motion.div
              key="step-objective"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col"
            >
              <h2 className="text-white text-2xl font-black tracking-tight mb-1 font-sans">OBJETIVO</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-6">Escolha sua meta para hoje</p>

              <div className="flex flex-col gap-4">
                {['PERDER PESO', 'GANHAR MASSA', 'HIPERTROFIA'].map((obj) => (
                  <button
                    key={obj}
                    onClick={() => setObjective(obj as ObjectiveType)}
                    id={`btn-target-${obj.toLowerCase().replace(' ', '-')}`}
                    className="flex justify-between items-center bg-slate-900 hover:bg-slate-850 border border-slate-800 p-5 rounded-2xl cursor-pointer active:scale-[0.99] transition-all group text-left"
                  >
                    <span className="text-white font-black tracking-wide text-[15px]">{obj}</span>
                    <Sparkles className="w-5 h-5 text-blue-500 group-hover:animate-spin" />
                  </button>
                ))}
              </div>

              {/* MOTIVATIONAL STATEMENT (required) */}
              <div className="mt-12 flex flex-col items-center text-center px-4">
                <div className="w-10 h-1 bg-blue-500 mb-6 rounded-full" />
                <p className="text-white text-lg font-black uppercase leading-snug max-w-md">
                  A DISCIPLINA É A <span className="text-blue-500 underline decoration-2 underline-offset-4">PONTE</span> ENTRE SEUS OBJETIVOS E SUAS <span className="text-blue-500 underline decoration-2 underline-offset-4">CONQUISTAS</span>.
                </p>
                <p className="text-slate-500 font-bold font-mono text-[9px] tracking-[0.3em] uppercase mt-4">
                  VITA ELITE | HIGH PERFORMANCE
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 2: CATEGORY SELECTION (MUSCULAÇÃO VS CARDIO) */}
          {objective && !workoutType && (
            <motion.div
              key="step-modality"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col"
            >
              <h2 className="text-white text-2xl font-black tracking-tight mb-1 font-sans">MODALIDADE</h2>
              <p className="text-slate-500 text-sm mb-6 flex items-center gap-1">
                Foco selecionado: <span className="text-blue-500 font-extrabold">{objective}</span>
              </p>

              <div className="flex flex-col gap-4">
                {/* Weight Training */}
                <button
                  onClick={() => setWorkoutType('musculacao')}
                  id="btn-workout-musculacao"
                  className="flex items-center gap-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 p-5 rounded-2xl cursor-pointer active:scale-[0.99] transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Dumbbell className="w-6 h-6 text-blue-500 group-hover:animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-lg">Musculação</h3>
                    <p className="text-slate-400 text-xs">Aperfeiçoamento de força e densidade</p>
                  </div>
                </button>

                {/* Cardio */}
                <button
                  onClick={() => setWorkoutType('aerobico')}
                  id="btn-workout-aerobico"
                  className="flex items-center gap-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 p-5 rounded-2xl cursor-pointer active:scale-[0.99] transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/10 group-hover:bg-red-500/20 transition-colors">
                    <Flame className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-lg">Aeróbico</h3>
                    <p className="text-slate-400 text-xs">Metabolismo acelerado e condicionamento</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SPECIFIC WORKOUT PLAN SHEETS */}
          {objective && workoutType && (
            <motion.div
              key="step-plans"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-white text-2xl font-black tracking-tight font-display">
                    {workoutType === 'musculacao' ? 'MUSCULAÇÃO' : 'CARDIO AERÓBICO'}
                  </h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                    PLAN PARA: <span className={workoutType === 'musculacao' ? 'text-blue-500 font-extrabold' : 'text-red-500 font-extrabold'}>{objective}</span>
                  </p>
                </div>

                {/* Training Timer Mock Indicator */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>45-60 MIN</span>
                </div>
              </div>

              {/* PROGRESS BAR FOR SESSION ENGAGEMENT */}
              <div className="bg-slate-900/50 border border-slate-800/60 p-4 rounded-2xl mb-6">
                <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                    Completo da Sessão
                  </span>
                  <span className="font-mono text-blue-400">{completedCount}/{totalExercises} ({progressPercent}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ type: 'spring', damping: 15 }}
                    className={`h-full ${workoutType === 'musculacao' ? 'bg-blue-500' : 'bg-red-500'}`} 
                  />
                </div>
              </div>

              {/* LIST OF WORKOUT SHEETS */}
              <div className="flex flex-col gap-6">
                {planosExibicao.map((plano: any) => (
                  <div
                    key={plano.id}
                    className="bg-slate-900 border border-slate-800 rounded-[24px] p-5 shadow-lg shadow-black/25 flex flex-col"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-4">
                      <h3 className="text-white text-[16px] font-black">{plano.nome}</h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold text-white uppercase ${
                        workoutType === 'musculacao' ? 'bg-blue-600' : 'bg-red-600'
                      }`}>
                        Ficha {plano.id}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {plano.itens.map((item: string, index: number) => {
                        const itemKey = `${plano.id}-${item}`;
                        const isDone = !!completedItems[itemKey];

                        return (
                          <div
                            key={index}
                            onClick={() => handleToggleExercise(itemKey)}
                            id={`exercise-row-${plano.id}-${index}`}
                            className={`flex items-center gap-3 p-3.5 rounded-xl transition-all cursor-pointer border ${
                              isDone 
                                ? 'bg-slate-800/40 border-emerald-500/20 text-slate-500 line-through' 
                                : 'bg-slate-950 hover:bg-slate-950/80 border-slate-800/60 text-slate-200'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => {}} // Hooked on parent container click
                              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer pointer-events-none"
                            />
                            
                            <div className="flex-1 flex flex-col">
                              <span className="text-xs font-bold leading-normal">{item}</span>
                            </div>
                            
                            {!isDone && (
                              <PlayCircle className="w-4 h-4 opacity-30 text-gray-400 flex-shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
