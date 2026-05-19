import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Salad, Flame, Leaf, Shield, CheckCircle2, ChevronRight, Apple, Heart, Activity } from 'lucide-react';
import { ScreenType, ObjectiveType } from '../types';

interface DietaScreenProps {
  onNavigate: (screen: ScreenType) => void;
  objective: ObjectiveType | null;
  setObjective: (obj: ObjectiveType | null) => void;
}

export default function DietaScreen({ onNavigate, objective, setObjective }: DietaScreenProps) {
  // Store eaten meals or items
  const [eatenMeals, setEatenMeals] = useState<{ [key: string]: boolean }>({});

  // --- DIETS DATABASE (Color psychology matching exact request) ---
  const dietas: { [key: string]: { titulo: string; cor: string; rgbBg: string; textCor: string; info: string; refeicoes: { id: string; nome: string; itens: string[] }[] } } = {
    'PERDER PESO': {
      titulo: 'PROTOCOLO DETOX & QUEIMA',
      cor: '#10B981', // Emerald Green (Health/Lightness)
      rgbBg: 'from-emerald-950/20 to-emerald-800/15 border-emerald-500/20',
      textCor: 'text-emerald-400',
      info: 'Foco em déficit calórico estrategicamente programado e alta densidade nutricional.',
      refeicoes: [
        { id: '1', nome: 'Café da Manhã', itens: ['Omelete de 2 ovos com espinafre', '1 xícara de café preto (sem açúcar)', '50g de mamão com sementes de chia'] },
        { id: '2', nome: 'Almoço', itens: ['150g de Filé de frango grelhado', '3 colheres de arroz integral', 'Salada verde à vontade', 'Brócolis no vapor'] },
        { id: '3', nome: 'Lanche da Tarde', itens: ['1 Iogurte natural desnatado', '3 nozes ou 5 amêndoas'] },
        { id: '4', nome: 'Jantar', itens: ['Posta de peixe branco', 'Mix de legumes (abobrinha e cenoura)', 'Salada de folhas roxas'] },
      ]
    },
    'GANHAR MASSA': {
      titulo: 'BULKING ESTRUTURADO',
      cor: '#F59E0B', // Amber (Energy/Appetite)
      rgbBg: 'from-amber-950/20 to-amber-800/15 border-amber-500/20',
      textCor: 'text-amber-400',
      info: 'Superávit calórico controlado com alto índice de carboidratos complexos e rápida digestão.',
      refeicoes: [
        { id: '1', nome: 'Café da Manhã', itens: ['Vitamina: 300ml leite, 1 banana, 40g aveia', '2 fatias de pão integral com ovos'] },
        { id: '2', nome: 'Almoço', itens: ['200g de Carne bovina magra', '200g de Arroz branco', '100g de Feijão', 'Salada de tomate'] },
        { id: '3', nome: 'Pós-Treino', itens: ['Shake de Whey Protein', '60g de Dextrose ou 1 banana grande'] },
        { id: '4', nome: 'Jantar', itens: ['200g de Macarrão integral', 'Molho de tomate caseiro com frango desfiado'] },
      ]
    },
    'HIPERTROFIA': {
      titulo: 'DENSIDADE MÁXIMA',
      cor: '#8B5CF6', // Royal Purple (Construction/Elite)
      rgbBg: 'from-purple-950/20 to-purple-800/15 border-purple-500/20',
      textCor: 'text-purple-400',
      info: 'Aporte máximo de proteínas biológicas e gorduras insaturadas para reparo e síntese proteica.',
      refeicoes: [
        { id: '1', nome: 'Café da Manhã', itens: ['4 Claras e 2 ovos inteiros', '80g de Aveia em flocos', 'Frutas vermelhas'] },
        { id: '2', nome: 'Almoço', itens: ['180g de Frango ou Peixe', '150g de Batata Doce', 'Aspargos ou Vagem'] },
        { id: '3', nome: 'Lanche/Pré-Treino', itens: ['Sanduíche de atum natural', 'Pasta de amendoim (1 colher)'] },
        { id: '4', nome: 'Ceia', itens: ['Abacate (100g)', 'Proteína de lenta absorção (Caseína ou Ovos)'] },
      ]
    }
  };

  const handleBack = () => {
    if (objective) {
      setObjective(null);
    } else {
      onNavigate('home');
    }
  };

  const activeDieta = objective ? dietas[objective] : null;

  const handleToggleMealItem = (key: string) => {
    setEatenMeals(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] overflow-x-hidden pb-12">
      {/* HEADER SECTION WITH HERO COVER */}
      <div className="relative h-[28vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1453&auto=format&fit=crop"
          alt="Alimentação saudável e fatias de legumes"
          className="w-full h-full object-cover object-center filter brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent" />
        
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <button 
            onClick={handleBack}
            id="btn-dieta-back"
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

      {/* CORE DIET CONTROL LAYER */}
      <div className="relative z-10 bg-slate-950 rounded-t-[35px] -mt-[40px] px-6 pt-6 flex-1 max-w-xl mx-auto w-full">
        {/* Drag Indicator Mimic */}
        <div className="w-10 h-1 bg-slate-800 rounded-full mx-auto mb-6" />

        <AnimatePresence mode="wait">
          {/* STEP 1: SELECT DIET OBJECTIVE */}
          {!objective && (
            <motion.div
              key="select-objective"
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 25 }}
              className="flex flex-col"
            >
              <h2 className="text-white text-2xl font-black tracking-tight mb-1 font-sans">NUTRIÇÃO</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-6">O que vamos alimentar hoje?</p>

              <div className="flex flex-col gap-4">
                {/* LOSE WEIGHT */}
                <button
                  onClick={() => setObjective('PERDER PESO')}
                  id="btn-diet-perder"
                  className="flex items-center justify-between bg-slate-900 border-l-[4px] border-emerald-500 p-5 rounded-r-2xl rounded-l-md cursor-pointer hover:bg-slate-850 transition-colors active:scale-[0.99] text-left border-y border-r border-slate-800"
                >
                  <div className="flex flex-col">
                    <span className="text-white font-black tracking-wide text-base">PERDER PESO</span>
                    <span className="text-slate-400 text-xs mt-0.5">Déficit calórico detox ativo</span>
                  </div>
                  <Leaf className="w-5 h-5 text-emerald-500" />
                </button>

                {/* GAIN MASS */}
                <button
                  onClick={() => setObjective('GANHAR MASSA')}
                  id="btn-diet-ganhar"
                  className="flex items-center justify-between bg-slate-900 border-l-[4px] border-amber-500 p-5 rounded-r-2xl rounded-l-md cursor-pointer hover:bg-slate-850 transition-colors active:scale-[0.99] text-left border-y border-r border-slate-800"
                >
                  <div className="flex flex-col">
                    <span className="text-white font-black tracking-wide text-base">GANHAR MASSA</span>
                    <span className="text-slate-400 text-xs mt-0.5">Superávit energizante com carboidratos</span>
                  </div>
                  <Flame className="w-5 h-5 text-amber-500" />
                </button>

                {/* HYPERTROPHY */}
                <button
                  onClick={() => setObjective('HIPERTROFIA')}
                  id="btn-diet-hipertrofia"
                  className="flex items-center justify-between bg-slate-900 border-l-[4px] border-purple-500 p-5 rounded-r-2xl rounded-l-md cursor-pointer hover:bg-slate-850 transition-colors active:scale-[0.99] text-left border-y border-r border-slate-800"
                >
                  <div className="flex flex-col">
                    <span className="text-white font-black tracking-wide text-base">HIPERTROFIA</span>
                    <span className="text-slate-400 text-xs mt-0.5">Síntese proteica reconstrutiva premium</span>
                  </div>
                  <Shield className="w-5 h-5 text-purple-500" />
                </button>
              </div>

              {/* HEALTH QUOTE */}
              <div className="mt-12 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex items-start gap-3.5">
                <Heart className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="text-white text-xs font-black tracking-wide uppercase font-mono">Nutrição Inteligente</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Mais que comer menos ou mais, uma nutrição de elite se faz com equilíbrio metabólico e constância celular diária.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: ACTIVE DETAILED DIET PLAN */}
          {objective && activeDieta && (
            <motion.div
              key="active-meals"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col"
            >
              {/* BRANDED HEADER */}
              <div className="mb-6">
                <h2 
                  className="text-2xl font-black tracking-tight font-display transition-colors mb-1"
                  style={{ color: activeDieta.cor }}
                >
                  {activeDieta.titulo}
                </h2>
                <p className="text-gray-300 text-xs leading-relaxed max-w-md">
                  {activeDieta.info}
                </p>
              </div>

              {/* MACROS CHECKLIST CARDS */}
              <div className="flex flex-col gap-5">
                {activeDieta.refeicoes.map((ref) => {
                  // Determine if all sub-items of this specific meal are checked off
                  const totalMealItems = ref.itens.length;
                  const completedMealItems = ref.itens.filter(it => !!eatenMeals[`${ref.id}-${it}`]).length;
                  const isMealFinished = totalMealItems > 0 && totalMealItems === completedMealItems;

                  return (
                    <div 
                      key={ref.id}
                      className={`bg-slate-900 rounded-3xl p-5 border shadow-md shadow-black/30 transition-all ${
                        isMealFinished 
                          ? 'border-emerald-500/20 bg-emerald-950/10' 
                          : 'border-slate-800'
                      }`}
                    >
                      {/* Meal title badge header */}
                      <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
                        <span 
                          className="text-[11px] font-black tracking-widest text-[#121212] uppercase px-3 py-1 rounded-full font-mono font-bold transition-all"
                          style={{ backgroundColor: isMealFinished ? '#10B981' : activeDieta.cor, color: '#ffffff' }}
                        >
                          {ref.nome}
                        </span>
                        
                        {isMealFinished ? (
                          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Consumido
                          </div>
                        ) : (
                          <div className="text-[10px] font-mono text-slate-500 font-bold">
                            {completedMealItems}/{totalMealItems} ITENS
                          </div>
                        )}
                      </div>

                      {/* Items loop checklist */}
                      <div className="flex flex-col gap-2.5">
                        {ref.itens.map((item, index) => {
                          const itemKey = `${ref.id}-${item}`;
                          const isDone = !!eatenMeals[itemKey];

                          return (
                            <div
                              key={index}
                              onClick={() => handleToggleMealItem(itemKey)}
                              id={`meal-row-${ref.id}-${index}`}
                              className={`flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer border ${
                                isDone 
                                  ? 'bg-emerald-950/10 border-emerald-500/10 text-slate-500 line-through' 
                                  : 'bg-slate-950 hover:bg-slate-950/80 border-slate-800 text-slate-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isDone}
                                onChange={() => {}} // Hooked on container div click
                                className="w-4 h-4 rounded cursor-pointer mt-0.5 pointer-events-none"
                                style={{ accentColor: activeDieta.cor }}
                              />
                              <span className="text-xs font-medium leading-relaxed flex-1">
                                {item}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
