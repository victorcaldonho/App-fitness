import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Scale, Ruler, Play, Quote, AlertTriangle, ArrowRight, Check, Dumbbell, Apple } from 'lucide-react';
import { ScreenType, ObjectiveType } from '../types';

interface IMCScreenProps {
  onNavigate: (screen: ScreenType) => void;
  setGlobalObjective: (obj: ObjectiveType | null) => void;
}

export default function IMCScreen({ onNavigate, setGlobalObjective }: IMCScreenProps) {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [resultado, setResultado] = useState<number | null>(null);

  const calcularIMC = () => {
    // Standardize decimal pointers
    const p = parseFloat(peso.replace(',', '.'));
    const a = parseFloat(altura.replace(',', '.'));
    if (p > 0 && a > 0) {
      setResultado(p / (a * a));
    } else {
      setResultado(null);
    }
  };

  const getInfo = (val: number) => {
    if (val < 18.5) {
      return { 
        cor: '#3B82F6', 
        bgGradient: 'from-blue-500/10 to-blue-500/20',
        textTheme: 'text-blue-400',
        label: 'Abaixo do peso', 
        pos: '12.5%',
        sugestao: 'GANHAR MASSA',
        descricao: 'Foco em superávit calórico saudável e treinos de força hipertróficos.'
      };
    }
    if (val < 25) {
      return { 
        cor: '#10B981', 
        bgGradient: 'from-emerald-500/10 to-emerald-500/20',
        textTheme: 'text-emerald-400',
        label: 'Peso Saudável', 
        pos: '37.5%',
        sugestao: 'HIPERTROFIA',
        descricao: 'Condição excelente! Ideal para focar em densidade muscular máxima.'
      };
    }
    if (val < 30) {
      return { 
        cor: '#F59E0B', 
        bgGradient: 'from-amber-500/10 to-amber-500/20',
        textTheme: 'text-amber-400',
        label: 'Sobrepeso', 
        pos: '62.5%',
        sugestao: 'PERDER PESO',
        descricao: 'Déficit calórico planejado e treinos híbridos para readequar a composição corporal.'
      };
    }
    return { 
      cor: '#EF4444', 
      bgGradient: 'from-red-500/10 to-red-500/20',
      textTheme: 'text-red-400',
      label: 'Obesidade', 
      pos: '87.5%',
      sugestao: 'PERDER PESO',
      descricao: 'Protocolo metabólico urgente: reeducação nutricional e atividades focadas em queima hibridizada.'
    };
  };

  const info = resultado ? getInfo(resultado) : null;

  const handleAction = (target: 'treinos' | 'dieta') => {
    if (info) {
      // Pre-set the objective globally based on the IMC suggestion for better UX
      setGlobalObjective(info.sugestao as ObjectiveType);
    }
    onNavigate(target);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calcularIMC();
    }
  };

  const resetAll = () => {
    setPeso('');
    setAltura('');
    setResultado(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 overflow-x-hidden pb-12">
      {/* HEADER SECTION WITH HERO COVER */}
      <div className="relative h-[30vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop"
          alt="Análise corporal balança"
          className="w-full h-full object-cover object-center filter brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        
        {/* Nav Overlays */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')}
            id="btn-imc-back"
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

      {/* CORE FRAME FOR WEIGHT ANALYSIS */}
      <div className="relative z-10 bg-slate-950 rounded-t-[35px] -mt-[40px] px-6 pt-6 flex-1 max-w-xl mx-auto w-full">
        {/* Drag Indicator Mimic */}
        <div className="w-10 h-1 bg-slate-800 rounded-full mx-auto mb-6" />

        {/* INPUT FORM BLOCK */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl shadow-black/40">
          <h2 className="text-white text-xl font-bold font-sans text-center mb-6">Análise Corporal IMC</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-blue-500" />
                Peso (kg)
              </label>
              <input
                type="text"
                pattern="[0-9]*[.,]?[0-9]*"
                inputMode="decimal"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="00.0"
                id="input-peso"
                className="bg-slate-950 rounded-xl py-4 px-3 text-center text-white text-2xl font-black font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow placeholder-slate-605 border border-slate-800"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-blue-500" />
                Altura (m)
              </label>
              <input
                type="text"
                pattern="[0-9]*[.,]?[0-9]*"
                inputMode="decimal"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="0.00"
                id="input-altura"
                className="bg-slate-950 rounded-xl py-4 px-3 text-center text-white text-2xl font-black font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow placeholder-slate-605 border border-slate-800"
              />
            </div>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={calcularIMC}
              id="btn-calcular-imc"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold tracking-widest text-[12px] py-4 rounded-xl cursor-pointer shadow-md shadow-blue-900/40 active:scale-[0.98] transition-all"
            >
              CALCULAR AGORA
            </button>
            {(peso || altura || resultado) && (
              <button
                onClick={resetAll}
                id="btn-limpar-imc"
                className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-bold px-4 rounded-xl cursor-pointer active:scale-[0.98] transition-all text-xs"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* FEEDBACK VIEWS CONTAINER */}
        <AnimatePresence mode="wait">
          {!resultado ? (
            <motion.div
              key="quote-block"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-12 flex flex-col items-center text-center px-4"
            >
              <Quote className="w-10 h-10 text-blue-500/20 mb-4 transform rotate-180" />
              <p className="text-white text-lg font-light italic leading-relaxed max-w-sm">
                O SEU CORPO É O SEU MAIOR PROJETO.
                <br />
                <span className="text-blue-500 font-black tracking-wider uppercase text-sm font-sans block mt-1">
                  INVISTA COM DISCIPLINA.
                </span>
              </p>
              <div className="h-[2px] w-8 bg-blue-500 mt-6 rounded-full" />
            </motion.div>
          ) : (
            <motion.div
              key="result-block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120 }}
              className="mt-8 flex flex-col items-center text-center"
            >
              {/* VALUE AND BADGE */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-white text-7xl font-black font-mono tracking-tighter transition-all">
                  {resultado.toFixed(1)}
                </span>
                <span className={`text-[15px] font-black tracking-widest uppercase mt-1 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 ${info?.textTheme}`}>
                  {info?.label}
                </span>
              </div>

              {/* DYNAMIC PROGRESS GAUGE */}
              <div className="w-full mt-10 px-2 relative" id="gauge-container">
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-800">
                  <div className="w-1/4 bg-blue-500" title="Abaixo do peso (&lt;18.5)" />
                  <div className="w-1/4 bg-emerald-500" title="Normal (18.5 - 24.9)" />
                  <div className="w-1/4 bg-amber-500" title="Sobrepeso (25.0 - 29.9)" />
                  <div className="w-1/4 bg-red-500" title="Obesidade (&gt;=30)" />
                </div>
                
                {/* Gauge Labels */}
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1.5 px-1">
                  <span>18.5</span>
                  <span>25.0</span>
                  <span>30.0</span>
                </div>

                {/* Animated pointer indicator */}
                <motion.div 
                  initial={{ left: '0%' }}
                  animate={{ left: info?.pos || '50%' }}
                  transition={{ type: 'spring', duration: 1.2 }}
                  className="absolute top-[12px] -ml-[12px] flex flex-col items-center"
                >
                  <div className="w-[1.5px] h-3 bg-white" />
                  <div className="w-4 h-4 rounded-full border-2 border-slate-950 shadow-md shadow-black" style={{ backgroundColor: info?.cor }} />
                </motion.div>
              </div>

              {/* RECOMMENDATION BLURB */}
              {info && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`mt-10 mx-auto w-full p-5 rounded-2xl bg-gradient-to-br ${info.bgGradient} border border-white/5 text-left`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5" style={{ color: info.cor }} />
                    <span className="text-[11px] font-black uppercase tracking-wider text-gray-200">Meta Sugerida Especializada</span>
                  </div>
                  <p className="text-white text-lg font-black tracking-tight flex items-center gap-1.5">
                    Focar em: <span className="underline decoration-wavy underline-offset-4" style={{ color: info.cor }}>{info.sugestao}</span>
                  </p>
                  <p className="text-gray-300 text-xs mt-1 leading-relaxed">
                    {info.descricao}
                  </p>
                </motion.div>
              )}

              {/* INTEGRATED FAST ACTIONS ROW */}
              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                <button
                  onClick={() => handleAction('treinos')}
                  id="btn-imc-view-workouts"
                  className="flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl cursor-pointer shadow-md shadow-blue-900/30 active:scale-[0.98] transition-all group"
                >
                  <Dumbbell className="w-4 h-4 group-hover:animate-bounce" />
                  Ver Treino Ideal
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => handleAction('dieta')}
                  id="btn-imc-view-nutrition"
                  className="flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl cursor-pointer shadow-md shadow-emerald-900/30 active:scale-[0.98] transition-all group"
                >
                  <Apple className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Ver Dieta Ideal
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
