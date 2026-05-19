import { motion } from 'motion/react';
import { Calculator, Dumbbell, Flame, Apple, ChevronRight, Zap } from 'lucide-react';
import { ScreenType } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 overflow-x-hidden pb-10">
      {/* HERO BANNER SECTION */}
      <div className="relative h-[48vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop"
          alt="Alta Performance Halteres"
          className="w-full h-full object-cover object-center scale-[1.05] filter brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        
        {/* Float badge */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-4 py-2 rounded-full border border-slate-800/80">
          <Zap className="w-4 h-4 text-blue-500 animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest text-slate-300 font-mono">HIGH PERFORMANCE</span>
        </div>
      </div>

      {/* MAIN CONTENT PORT */}
      <div className="relative z-10 bg-slate-950 rounded-t-[35px] -mt-[60px] px-6 pt-8 pb-12 flex-1 max-w-2xl mx-auto w-full">
        {/* Drag Indicator Mimic */}
        <div className="w-10 h-1 bg-slate-800 rounded-full mx-auto mb-8" />

        {/* BRAND IDENTITY */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <div className="flex items-baseline gap-0.5 justify-center mb-1">
            <span className="font-display font-light text-5xl text-slate-100 tracking-tight">VITA</span>
            <span className="font-display font-black text-5xl text-blue-500 tracking-tight">ELITE</span>
          </div>

          <div className="flex items-center gap-3 my-3">
            <div className="h-[1px] w-6 bg-slate-800" />
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.3em]">SUPREMO RENDIMENTO</span>
            <div className="h-[1px] w-6 bg-slate-800" />
          </div>

          <p className="text-slate-400 text-sm max-w-sm mt-1 leading-relaxed">
            Sua plataforma definitiva para evolução física, prescrição de treinos e performance milimétrica.
          </p>
        </motion.div>

        {/* ACTION BUTTON GRID */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* BOTÃO IMC */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('imc')}
            id="btn-nav-imc"
            className="flex flex-col justify-between items-start text-left bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-[24px] h-[160px] shadow-lg shadow-blue-950/40 border border-blue-500/20 cursor-pointer group hover:from-blue-500 hover:to-blue-700 transition-all duration-300 w-full"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <div className="w-full flex justify-between items-center mt-4">
              <span className="text-white font-extrabold text-lg tracking-tight">Tabela IMC</span>
              <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

          {/* BOTÃO TREINOS */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('treinos')}
            id="btn-nav-treinos"
            className="flex flex-col justify-between items-start text-left bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-[24px] h-[160px] shadow-lg shadow-red-950/40 border border-red-500/20 cursor-pointer group hover:from-red-500 hover:to-red-700 transition-all duration-300 w-full"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Dumbbell className="w-7 h-7 text-white" />
            </div>
            <div className="w-full flex justify-between items-center mt-4">
              <span className="text-white font-extrabold text-lg tracking-tight">Planos de Treino</span>
              <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

          {/* BOTÃO DIETA - FULL WIDTH ON GRID */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('dieta')}
            id="btn-nav-dieta"
            className="sm:col-span-2 flex flex-col justify-between items-start text-left bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 rounded-[24px] h-[150px] shadow-lg shadow-emerald-950/40 border border-emerald-500/20 cursor-pointer group hover:from-emerald-500 hover:to-emerald-700 transition-all duration-300 w-full"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Apple className="w-7 h-7 text-white" />
            </div>
            <div className="w-full flex justify-between items-center mt-2">
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-lg tracking-tight font-sans">Minha Nutrição</span>
                <span className="text-white/70 text-xs font-mono">Planejamento focado por objetivo</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        </motion.div>

        {/* MOTIVATIONAL WATERMARK */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-col items-center justify-center gap-1 opacity-20 hover:opacity-40 transition-opacity duration-300 select-none pb-6"
        >
          <Flame className="w-6 h-6 text-gray-500" />
          <span className="text-[9px] font-mono tracking-[0.4em] font-medium text-gray-400">VITA ELITE ATHLETICS</span>
        </motion.div>
      </div>
    </div>
  );
}
