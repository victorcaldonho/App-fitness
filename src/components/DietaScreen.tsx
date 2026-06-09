import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Salad, Flame, Leaf, Shield, CheckCircle2, ChevronRight, Apple, Heart, Activity, BookOpen, ChefHat, X } from 'lucide-react';
import { ScreenType, ObjectiveType } from '../types';
import { safeStorage } from '../safeStorage';
import { syncDashboardStats, syncActivities } from '../supabaseClient';
import { RECIPE_DATABASE, getGenericRecipe } from '../data/demonstrations';

interface DietaScreenProps {
  onNavigate: (screen: ScreenType) => void;
  objective: ObjectiveType | null;
  setObjective: (obj: ObjectiveType | null) => void;
}

export default function DietaScreen({ onNavigate, objective, setObjective }: DietaScreenProps) {
  // Store eaten meals or items
  const [eatenMeals, setEatenMeals] = useState<{ [key: string]: boolean }>(() => {
    const cached = safeStorage.getItem('vita_eaten_meals');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error(e);
      }
    }
    return {};
  });

  const [selectedRecipeItem, setSelectedRecipeItem] = useState<string | null>(null);

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

  const NUTRIENT_MAP: { [key: string]: { cal: number; protein: number; carbs: number; fats: number } } = {
    // PERDER PESO
    'Omelete de 2 ovos com espinafre': { cal: 150, protein: 13, carbs: 2, fats: 10 },
    '1 xícara de café preto (sem açúcar)': { cal: 5, protein: 0, carbs: 0, fats: 0 },
    '50g de mamão com sementes de chia': { cal: 45, protein: 1, carbs: 10, fats: 1 },
    '150g de Filé de frango grelhado': { cal: 240, protein: 45, carbs: 0, fats: 5 },
    '3 colheres de arroz integral': { cal: 110, protein: 2.5, carbs: 23, fats: 1 },
    'Salada verde à vontade': { cal: 15, protein: 1, carbs: 3, fats: 0 },
    'Brócolis no vapor': { cal: 35, protein: 3, carbs: 6, fats: 0 },
    '1 Iogurte natural desnatado': { cal: 60, protein: 6, carbs: 9, fats: 0 },
    '3 nozes ou 5 amêndoas': { cal: 90, protein: 2, carbs: 2, fats: 8 },
    'Posta de peixe branco': { cal: 150, protein: 30, carbs: 0, fats: 3 },
    'Mix de legumes (abobrinha e cenoura)': { cal: 50, protein: 1.5, carbs: 10, fats: 0.5 },
    'Salada de folhas roxas': { cal: 15, protein: 1, carbs: 3, fats: 0 },

    // GANHAR MASSA
    'Vitamina: 300ml leite, 1 banana, 40g aveia': { cal: 350, protein: 15, carbs: 58, fats: 7 },
    '2 fatias de pão integral com ovos': { cal: 280, protein: 18, carbs: 24, fats: 12 },
    '200g de Carne bovina magra': { cal: 380, protein: 50, carbs: 0, fats: 18 },
    '200g de Arroz branco': { cal: 260, protein: 5, carbs: 57, fats: 0.5 },
    '100g de Feijão': { cal: 95, protein: 6, carbs: 17, fats: 0.5 },
    'Salada de tomate': { cal: 25, protein: 1, carbs: 5, fats: 0.2 },
    'Shake de Whey Protein': { cal: 140, protein: 25, carbs: 3, fats: 2 },
    '60g de Dextrose ou 1 banana grande': { cal: 240, protein: 1, carbs: 58, fats: 0 },
    '200g de Macarrão integral': { cal: 250, protein: 10, carbs: 50, fats: 1.5 },
    'Molho de tomate caseiro com frango desfiado': { cal: 180, protein: 25, carbs: 8, fats: 4 },

    // HIPERTROFIA
    '4 Claras e 2 ovos inteiros': { cal: 225, protein: 26, carbs: 2, fats: 12 },
    '80g de Aveia em flocos': { cal: 300, protein: 11, carbs: 52, fats: 6 },
    'Frutas vermelhas': { cal: 50, protein: 1, carbs: 11, fats: 0.5 },
    '180g de Frango ou Peixe': { cal: 290, protein: 54, carbs: 0, fats: 6 },
    '150g de Batata Doce': { cal: 130, protein: 2, carbs: 30, fats: 0.2 },
    'Aspargos ou Vagem': { cal: 30, protein: 2, carbs: 5, fats: 0.1 },
    'Sanduíche de atum natural': { cal: 250, protein: 20, carbs: 25, fats: 5 },
    'Pasta de amendoim (1 colher)': { cal: 95, protein: 3.5, carbs: 3, fats: 8 },
    'Abacate (100g)': { cal: 160, protein: 2, carbs: 9, fats: 15 },
    'Proteína de lenta absorção (Caseína ou Ovos)': { cal: 120, protein: 24, carbs: 1, fats: 1.5 }
  };

  const handleToggleMealItem = (key: string, itemName: string, mealName: string) => {
    const isNowDone = !eatenMeals[key];
    
    // 1. Update eatenMeals state
    const updatedMeals = {
      ...eatenMeals,
      [key]: isNowDone
    };
    setEatenMeals(updatedMeals);
    safeStorage.setItem('vita_eaten_meals', JSON.stringify(updatedMeals));

    // 2. Load current dashboard stats
    const cachedStatsStr = safeStorage.getItem('vita_dashboard_stats');
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

    if (cachedStatsStr) {
      try {
        cachedStats = { ...cachedStats, ...JSON.parse(cachedStatsStr) };
      } catch (e) {
        console.error(e);
      }
    }

    // 3. Find macronutrients for the item
    const nutrition = NUTRIENT_MAP[itemName] || { cal: 150, protein: 12, carbs: 15, fats: 4 };

    // 4. Edit stats depending on whether it was checked or unchecked
    const multiplier = isNowDone ? 1 : -1;
    
    cachedStats.caloriesLogged = Math.max(0, (cachedStats.caloriesLogged || 0) + (nutrition.cal * multiplier));
    cachedStats.protein = Math.max(0, (cachedStats.protein || 0) + (nutrition.protein * multiplier));
    cachedStats.carbs = Math.max(0, (cachedStats.carbs || 0) + (nutrition.carbs * multiplier));
    cachedStats.fats = Math.max(0, (cachedStats.fats || 0) + (nutrition.fats * multiplier));

    // 5. Add a timeline action log
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const actionText = isNowDone
      ? `Ingeriu: ${itemName} (${mealName})`
      : `Desmarcou refeição: ${itemName} (${mealName})`;
    
    const newAct = {
      id: Math.random().toString(),
      time: timeNow,
      text: actionText,
      category: 'meal' as const
    };
    
    cachedStats.activities = [newAct, ...(cachedStats.activities || [])];

    // 6. Save back to localStorage
    safeStorage.setItem('vita_dashboard_stats', JSON.stringify(cachedStats));

    // 7. Sync back to Supabase
    const activeUserId = safeStorage.getItem('vita_supabase_sync_id');
    if (activeUserId) {
      const goalsDict = {
        'PERDER PESO': { caloriesGoal: 2000, waterGoal: 3200, proteinGoal: 150, carbsGoal: 180, fatsGoal: 60 },
        'GANHAR MASSA': { caloriesGoal: 3100, waterGoal: 4000, proteinGoal: 180, carbsGoal: 400, fatsGoal: 90 },
        'HIPERTROFIA': { caloriesGoal: 2700, waterGoal: 3800, proteinGoal: 200, carbsGoal: 310, fatsGoal: 75 }
      };
      const activeObj = objective || 'PERDER PESO';
      const activeGoals = goalsDict[activeObj as keyof typeof goalsDict] || { caloriesGoal: 2400, waterGoal: 3000, proteinGoal: 160, carbsGoal: 250, fatsGoal: 80 };

      syncDashboardStats(activeUserId, {
        waterLogged: cachedStats.waterLogged ?? 0,
        waterGoal: activeGoals.waterGoal,
        workoutsCompleted: cachedStats.workoutsCompleted ?? 0,
        workoutsGoal: 7,
        caloriesLogged: cachedStats.caloriesLogged,
        caloriesGoal: activeGoals.caloriesGoal,
        protein: cachedStats.protein,
        proteinGoal: activeGoals.proteinGoal,
        carbs: cachedStats.carbs,
        carbsGoal: activeGoals.carbsGoal,
        fats: cachedStats.fats,
        fatsGoal: activeGoals.fatsGoal
      }).catch(err => console.error('Error syncing diet to Supabase:', err));

      syncActivities(activeUserId, cachedStats.activities).catch(err => console.error('Error syncing diet activities to Supabase:', err));
    }
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
                              onClick={() => handleToggleMealItem(itemKey, item, ref.nome)}
                              id={`meal-row-${ref.id}-${index}`}
                              className={`flex items-center justify-between gap-3 p-3 rounded-xl transition-all cursor-pointer border ${
                                isDone 
                                  ? 'bg-emerald-950/10 border-emerald-500/10 text-slate-500 line-through' 
                                  : 'bg-slate-950 hover:bg-slate-950/80 border-slate-800 text-slate-300'
                              }`}
                            >
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={isDone}
                                  onChange={() => {}} // Hooked on container div click
                                  className="w-4 h-4 rounded cursor-pointer mt-0.5 pointer-events-none flex-shrink-0"
                                  style={{ accentColor: activeDieta.cor }}
                                />
                                <span className="text-xs font-medium leading-relaxed truncate-2-lines flex-1">
                                  {item}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRecipeItem(item);
                                }}
                                className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer active:scale-95 ${
                                  isDone
                                    ? 'border-slate-850/60 bg-slate-900/30 text-slate-650 text-slate-500/70'
                                    : 'border-amber-500/10 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400'
                                }`}
                              >
                                <ChefHat className="w-3.5 h-3.5 text-amber-500" />
                                <span>Receita</span>
                              </button>
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

      {/* RECIPE MODAL DETAIL OVERLAY */}
      <AnimatePresence>
        {selectedRecipeItem && (() => {
          const recipe = RECIPE_DATABASE[selectedRecipeItem] || getGenericRecipe(selectedRecipeItem);

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => setSelectedRecipeItem(null)}
            >
              <motion.div
                initial={{ y: 50, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 50, scale: 0.95 }}
                transition={{ type: 'spring', duration: 0.25 }}
                className="bg-slate-950 border border-slate-850 w-full max-w-md rounded-t-[30px] sm:rounded-3xl shadow-2xl overflow-hidden text-left"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header pattern */}
                <div className="relative p-6 pb-4 border-b border-slate-900 flex justify-between items-start bg-gradient-to-r from-amber-500/5 to-slate-950">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                      <ChefHat className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-black text-amber-500 tracking-widest uppercase">Gastronomia Saudável</span>
                      <h3 className="text-white text-base font-black font-sans leading-snug mt-0.5">{recipe.title}</h3>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedRecipeItem(null)}
                    className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {/* Nutritional pills */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                      <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">Calorias</span>
                      <span className="text-white font-black text-xs block mt-0.5">{recipe.calories} kcal</span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                      <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">Proteínas</span>
                      <span className="text-emerald-400 font-black text-xs block mt-0.5">{recipe.protein}g</span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                      <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">Carbos</span>
                      <span className="text-blue-400 font-black text-xs block mt-0.5">{recipe.carbs}g</span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                      <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">Gorduras</span>
                      <span className="text-purple-400 font-black text-xs block mt-0.5">{recipe.fats}g</span>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-900 pb-1.5">
                      <Salad className="w-4 h-4 text-amber-500" /> Ingredientes Necessários:
                    </h4>
                    <ul className="space-y-1.5 font-sans text-xs text-slate-300 list-disc pl-4 leading-relaxed">
                      {recipe.ingredients.map((ing, iIdx) => (
                        <li key={iIdx}>
                          <span className="text-slate-200">{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Preparation method */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-900 pb-1.5">
                      <BookOpen className="w-4 h-4 text-amber-505 text-amber-500" /> Modo de Preparo:
                    </h4>
                    <p className="font-sans text-xs text-slate-300 leading-relaxed text-left whitespace-pre-line pl-0.5">
                      {recipe.preparation}
                    </p>
                  </div>

                  {/* Culinary Coach Insight */}
                  <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10 flex items-start gap-3">
                    <Apple className="w-4.5 h-4.5 text-amber-505 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-sans font-black text-[10px] tracking-wide text-amber-400 uppercase">Segredo de Prep de Elite:</h5>
                      <p className="text-[11px] font-sans text-slate-400 mt-0.5 leading-relaxed">
                        {recipe.tip}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-slate-900 bg-slate-950">
                  <button
                    onClick={() => setSelectedRecipeItem(null)}
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-white font-sans font-black text-xs uppercase tracking-wider border border-slate-850 cursor-pointer text-center transition-all"
                  >
                    Entendido, voltar ao cardápio
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
