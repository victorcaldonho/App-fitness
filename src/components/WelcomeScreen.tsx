import { motion } from 'motion/react';
import { ScreenType } from '../types';
import { ArrowRight, Flame } from 'lucide-react';

interface WelcomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export default function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  return (
    <div className="relative w-full h-[85vh] sm:h-[780px] rounded-[38px] overflow-hidden bg-slate-950 flex flex-col justify-end p-6 md:p-8 select-none">
      
      {/* Background Image with elegant gradient overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1200&auto=format&fit=crop"
          alt="Alta Performance Fitness"
          className="w-full h-full object-cover object-center scale-[1.02] filter brightness-[0.78] contrast-[1.05]"
        />
        {/* Subtle vignette and bottom dark gradient to ensure readable typography */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/35" />
      </div>

      {/* Floated Brand Badge at the top */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="absolute top-8 left-6 md:left-8 z-20 flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10"
      >
        <Flame className="w-4 h-4 text-blue-400 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90 font-mono">VITA ELITE PRO</span>
      </motion.div>

      {/* Main Container for Text, Indicators, and Get Started Button */}
      <div className="relative z-15 w-full max-w-sm mx-auto flex flex-col items-center justify-end h-full pb-6">
        
        {/* Progress Indicator Dots / Active Indicator from the Image */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center items-center gap-1.5 mb-5"
        >
          {/* Active indicator bar */}
          <span className="w-12 h-1 bg-white/20 rounded-full overflow-hidden relative">
            <motion.span 
              initial={{ left: '-100%' }}
              animate={{ left: '0%' }}
              transition={{ delay: 0.4, duration: 1.5, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 w-2/3 bg-white rounded-full" 
            />
          </span>
          <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
          <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
        </motion.div>

        {/* Big Bold Elegant Title from the Image */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
          className="text-white text-4xl sm:text-5xl font-black font-sans leading-tight tracking-tight text-center max-w-[340px] mb-8 select-none"
          style={{ textShadow: '0 4px 18px rgba(0, 0, 0, 0.75)' }}
        >
          Descubra como<br />
          moldar o seu<br />
          corpo
        </motion.h1>

        {/* GET STARTED PILL BUTTON from user image */}
        <motion.button
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
          onClick={() => onNavigate('home')}
          className="relative group w-full py-4.5 rounded-full bg-blue-600 text-white font-sans font-black tracking-widest text-xs uppercase shadow-xl hover:bg-blue-500 transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <span>COMEÇAR • GET STARTED</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.button>

        {/* Small detail of safety */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ delay: 0.6 }}
          className="text-[9px] text-white/60 font-mono tracking-widest mt-5 uppercase"
        >
          Alta Performance • Performance Milimétrica
        </motion.p>
      </div>
    </div>
  );
}
