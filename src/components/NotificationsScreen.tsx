import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Droplet, 
  Dumbbell, 
  Apple, 
  Clock, 
  MessageSquare, 
  Sparkles, 
  Check, 
  Smartphone, 
  Volume2, 
  Info, 
  Calendar, 
  Zap, 
  Compass, 
  Save, 
  Trash2,
  RefreshCw
} from 'lucide-react';
import { ScreenType, ObjectiveType } from '../types';

interface NotificationsScreenProps {
  onNavigate: (screen: ScreenType) => void;
  objective: ObjectiveType | null;
  triggerGlobalPush: (title: string, body: string, type: 'water' | 'workout' | 'meal') => void;
}

export default function NotificationsScreen({ 
  onNavigate, 
  objective, 
  triggerGlobalPush 
}: NotificationsScreenProps) {
  // Browser permission state
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Load defaults or stored configurations
  const [waterEnabled, setWaterEnabled] = useState<boolean>(true);
  const [waterInterval, setWaterInterval] = useState<number>(60); // minutes
  const [waterMl, setWaterMl] = useState<number>(250);
  const [waterStartTime, setWaterStartTime] = useState<string>('08:00');
  const [waterEndTime, setWaterEndTime] = useState<string>('22:00');
  const [waterDailyTarget, setWaterDailyTarget] = useState<number>(3000);

  const [workoutEnabled, setWorkoutEnabled] = useState<boolean>(true);
  const [workoutTime, setWorkoutTime] = useState<string>('18:30');
  const [workoutMotivation, setWorkoutMotivation] = useState<string>('Foco na missão! Hora de superar seus limites hoje.');
  const [workoutDays, setWorkoutDays] = useState<string[]>(['Seg', 'Ter', 'Qua', 'Qui', 'Sex']);

  const [mealEnabled, setMealEnabled] = useState<boolean>(true);
  const [mealBreakfast, setMealBreakfast] = useState<string>('07:30');
  const [mealLunch, setMealLunch] = useState<string>('12:30');
  const [mealSnack, setMealSnack] = useState<string>('16:00');
  const [mealDinner, setMealDinner] = useState<string>('20:00');

  // Custom alert settings
  const [notificationSound, setNotificationSound] = useState<boolean>(true);
  const [alertType, setAlertType] = useState<'both' | 'system' | 'inapp'>('both');

  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Check local Notification API availability
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Load configurations from LocalStorage
    const savedWater = localStorage.getItem('vita_notif_water');
    if (savedWater) {
      try {
        const data = JSON.parse(savedWater);
        setWaterEnabled(data.enabled ?? true);
        setWaterInterval(data.interval ?? 60);
        setWaterMl(data.ml ?? 250);
        setWaterStartTime(data.startTime ?? '08:00');
        setWaterEndTime(data.endTime ?? '22:00');
        setWaterDailyTarget(data.dailyTarget ?? 3000);
      } catch (e) {
        console.error("Error parsing water settings", e);
      }
    }

    const savedWorkout = localStorage.getItem('vita_notif_workout');
    if (savedWorkout) {
      try {
        const data = JSON.parse(savedWorkout);
        setWorkoutEnabled(data.enabled ?? true);
        setWorkoutTime(data.time ?? '18:30');
        setWorkoutMotivation(data.motivation ?? 'Foco na missão! Hora de superar seus limites hoje.');
        setWorkoutDays(data.days ?? ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']);
      } catch (e) {
        console.error("Error parsing workout settings", e);
      }
    }

    const savedMeal = localStorage.getItem('vita_notif_meal');
    if (savedMeal) {
      try {
        const data = JSON.parse(savedMeal);
        setMealEnabled(data.enabled ?? true);
        setMealBreakfast(data.breakfast ?? '07:30');
        setMealLunch(data.lunch ?? '12:30');
        setMealSnack(data.snack ?? '16:00');
        setMealDinner(data.dinner ?? '20:00');
      } catch (e) {
        console.error("Error parsing meal settings", e);
      }
    }

    const savedGeneral = localStorage.getItem('vita_notif_general');
    if (savedGeneral) {
      try {
        const data = JSON.parse(savedGeneral);
        setNotificationSound(data.sound ?? true);
        setAlertType(data.alertType ?? 'both');
      } catch (e) {}
    }
  }, []);

  const requestBrowserPermission = async () => {
    if (!('Notification' in window)) {
      alert("Este navegador não suporta notificações de sistema.");
      return;
    }
    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      triggerGlobalPush(
        "Notificações Ativadas!",
        "Agora você receberá alertas de treino, água e nutrição em tempo real.",
        "workout"
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveAll = () => {
    localStorage.setItem('vita_notif_water', JSON.stringify({
      enabled: waterEnabled,
      interval: waterInterval,
      ml: waterMl,
      startTime: waterStartTime,
      endTime: waterEndTime,
      dailyTarget: waterDailyTarget
    }));

    localStorage.setItem('vita_notif_workout', JSON.stringify({
      enabled: workoutEnabled,
      time: workoutTime,
      motivation: workoutMotivation,
      days: workoutDays
    }));

    localStorage.setItem('vita_notif_meal', JSON.stringify({
      enabled: mealEnabled,
      breakfast: mealBreakfast,
      lunch: mealLunch,
      snack: mealSnack,
      dinner: mealDinner
    }));

    localStorage.setItem('vita_notif_general', JSON.stringify({
      sound: notificationSound,
      alertType
    }));

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);

    triggerGlobalPush(
      "Preferências Salvas",
      "Seus temporizadores e agendas foram calibrados com precisão elite.",
      "workout"
    );
  };

  // Preset automatic alignments based on objectives
  const applyPresetByObjective = () => {
    if (objective === 'PERDER PESO') {
      setWaterDailyTarget(3200);
      setWaterInterval(45);
      setMealBreakfast('07:00');
      setMealLunch('12:00');
      setMealSnack('15:30');
      setMealDinner('19:00');
      setWorkoutMotivation("Foco no gasto energético! Cada movimento nos aproxima da nossa meta.");
    } else if (objective === 'GANHAR MASSA') {
      setWaterDailyTarget(4000);
      setWaterInterval(60);
      setMealBreakfast('08:00');
      setMealLunch('13:00');
      setMealSnack('16:30');
      setMealDinner('20:30');
      setWorkoutMotivation("Carga máxima e nutrição de ferro! Proteínas e carboidratos no ponto.");
    } else if (objective === 'HIPERTROFIA') {
      setWaterDailyTarget(3800);
      setWaterInterval(50);
      setMealBreakfast('07:30');
      setMealLunch('12:30');
      setMealSnack('16:00');
      setMealDinner('20:00');
      setWorkoutMotivation("Síntese proteica otimizada! Dia de hipertrofia muscular suprema.");
    } else {
      // Default standard smart layout
      setWaterDailyTarget(3000);
      setWaterInterval(60);
      setMealBreakfast('07:30');
      setMealLunch('12:30');
      setMealSnack('16:00');
      setMealDinner('20:00');
    }

    triggerGlobalPush(
      "Preset Ajustado!",
      `Configurações otimizadas para sua meta: ${objective || 'SUPREMO RENDIMENTO'}.`,
      "meal"
    );
  };

  const testTriggerNotif = (type: 'water' | 'workout' | 'meal') => {
    if (type === 'water') {
      triggerGlobalPush(
        "💧 Alerta de Hidratação!",
        `Hora de beber ${waterMl}ml de água para manter seu metabolismo de elite ativo. Meta de hoje: ${waterDailyTarget}ml.`,
        'water'
      );
    } else if (type === 'workout') {
      triggerGlobalPush(
        "🏋️ Hora do Treino!",
        `${workoutMotivation} (${workoutTime}h programado)`,
        'workout'
      );
    } else {
      triggerGlobalPush(
        "🍎 Lembrete de Refeição!",
        "Chegou a hora de alimentar suas células! Prepare sua dieta balanceada e evite catabolismo.",
        'meal'
      );
    }
  };

  const toggleDay = (day: string) => {
    if (workoutDays.includes(day)) {
      setWorkoutDays(workoutDays.filter(d => d !== day));
    } else {
      setWorkoutDays([...workoutDays, day]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 overflow-x-hidden pb-12">
      {/* HEADER HERO BANNER */}
      <div className="relative h-[25vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1474&auto=format&fit=crop"
          alt="Push Notifications Configuration"
          className="w-full h-full object-cover object-center filter brightness-[0.45] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        
        {/* Nav Header Row */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')}
            id="btn-notif-back"
            className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-white p-2.5 rounded-full backdrop-blur-md transition-colors cursor-pointer"
          >
            <Compass className="w-5 h-5 rotate-180" />
          </button>
          
          <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800/80">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] font-black font-mono tracking-widest text-slate-300">PUSH CENTER</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-slate-950 rounded-t-[35px] -mt-[40px] px-6 pt-6 flex-1 max-w-xl mx-auto w-full">
        {/* Mock slider bar */}
        <div className="w-10 h-1 bg-slate-800 rounded-full mx-auto mb-6" />

        {/* TITLE AND PERSISTENT META */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-white text-2xl font-black font-sans tracking-tight">ALERTAS & NOTIFICAÇÕES</h2>
            <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
              Configure lembretes cirúrgicos na tela e no navegador para otimizar sua rotina.
            </p>
          </div>
          <Bell className="w-6 h-6 text-blue-500" />
        </div>

        {/* NATIVE PERMISSION CONTROLLER Banner */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-100 font-bold text-xs">Aviso de Sistema Push</p>
              <p className="text-slate-400 text-[10px] mt-0.5">
                {permission === 'granted' 
                  ? 'Permissões concedidas! Recebendo alertas nativos.' 
                  : permission === 'denied'
                  ? 'Acesso bloqueado pelo navegador. Usando simulador nativo.'
                  : 'Ative notificações no navegador para receber no fundo.'}
              </p>
            </div>
          </div>
          {permission !== 'granted' && (
            <button
              onClick={requestBrowserPermission}
              id="btn-request-push-perm"
              className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] tracking-wide px-3 py-1.5 rounded-lg active:scale-95 transition-all text-center uppercase"
            >
              Ativar
            </button>
          )}
        </div>

        {/* PRESET GENERATOR LINKED TO METAS */}
        {objective && (
          <div className="bg-blue-950/20 border border-blue-800/25 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div>
                <span className="text-blue-300 font-black text-xs uppercase tracking-wide">Calibrar Inteligente</span>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                  Sua meta global está programada para <strong className="text-blue-400 font-bold">{objective}</strong>. Deseja calibrar automaticamente seus alarmes de água, treinos e refeições para este objetivo?
                </p>
                <button
                  onClick={applyPresetByObjective}
                  id="btn-auto-preset-calibrate"
                  className="mt-3 flex items-center gap-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 px-3.5 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Aplicar Preset Otimizado
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTAINER CONFIG OPTIONS */}
        <div className="flex flex-col gap-6">

          {/* WATER REMINDER SETTINGS CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl shadow-black/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Droplet className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Lembrete de Hidratação</h3>
                  <p className="text-slate-400 text-[10px]">Alimentação e fluxo metabólico constante</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={waterEnabled} 
                  onChange={(e) => setWaterEnabled(e.target.checked)}
                  id="switch-notif-water"
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {waterEnabled && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-col gap-4 overflow-hidden"
              >
                {/* Interval and ML */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Intervalo</label>
                    <select 
                      value={waterInterval}
                      onChange={(e) => setWaterInterval(Number(e.target.value))}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white text-xs font-bold focus:outline-none"
                    >
                      <option value={30}>A cada 30 min</option>
                      <option value={45}>A cada 45 min</option>
                      <option value={60}>A cada 60 min (1 hora)</option>
                      <option value={90}>A cada 90 min (1.5 horas)</option>
                      <option value={120}>A cada 120 min (2 horas)</option>
                      <option value={180}>A cada 180 min (3 horas)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quantidade</label>
                    <select 
                      value={waterMl}
                      onChange={(e) => setWaterMl(Number(e.target.value))}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white text-xs font-bold focus:outline-none"
                    >
                      <option value={150}>150 ml (Copo pequeno)</option>
                      <option value={200}>200 ml (Copo padrão)</option>
                      <option value={250}>250 ml (Copo cheio)</option>
                      <option value={300}>300 ml (Copo grande)</option>
                      <option value={500}>500 ml (Garrafa média)</option>
                    </select>
                  </div>
                </div>

                {/* Range start / end */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Início das Alertas</label>
                    <input 
                      type="time" 
                      value={waterStartTime}
                      onChange={(e) => setWaterStartTime(e.target.value)}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white text-xs font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fim das Alertas</label>
                    <input 
                      type="time" 
                      value={waterEndTime}
                      onChange={(e) => setWaterEndTime(e.target.value)}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>

                {/* Daily Goal target */}
                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Meta Diária</label>
                    <span className="text-xs font-bold font-mono text-blue-400">{waterDailyTarget} ml</span>
                  </div>
                  <input 
                    type="range"
                    min={1500}
                    max={6000}
                    step={250}
                    value={waterDailyTarget}
                    onChange={(e) => setWaterDailyTarget(Number(e.target.value))}
                    className="w-full mt-1.5 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Quick actions */}
                <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-slate-800/60">
                  <button
                    onClick={() => testTriggerNotif('water')}
                    id="btn-notif-test-water"
                    className="flex items-center gap-1 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors active:scale-95 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                    Enviar Teste Rápido
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* WORKOUT ALERTS CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl shadow-black/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Alerta de Treinos</h3>
                  <p className="text-slate-400 text-[10px]">Disciplina de horários em academia</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={workoutEnabled} 
                  onChange={(e) => setWorkoutEnabled(e.target.checked)}
                  id="switch-notif-workout"
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            {workoutEnabled && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-col gap-4 overflow-hidden"
              >
                {/* Specific hour picker */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Horário Programado</label>
                  <div className="relative mt-1">
                    <input 
                      type="time" 
                      value={workoutTime}
                      onChange={(e) => setWorkoutTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-base font-bold font-mono focus:outline-none"
                    />
                    <Clock className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Days chooser checklist */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 block">Dias do Alerta</label>
                  <div className="flex justify-between gap-1 mt-1">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => {
                      const isSelected = workoutDays.includes(day);
                      return (
                        <button
                          key={day}
                          onClick={() => toggleDay(day)}
                          id={`btn-day-toggle-${day.toLowerCase()}`}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-black font-sans uppercase transition-all ${
                            isSelected 
                              ? 'bg-red-600 text-white border border-red-500 shadow-md shadow-red-950/40 font-black' 
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Motivational Template sentence selection */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Frase Motivacional da Notificação</label>
                  <input 
                    type="text" 
                    value={workoutMotivation}
                    onChange={(e) => setWorkoutMotivation(e.target.value)}
                    placeholder="Ex: Hora de acelerar o ritmo e dominar seu objetivo"
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      "Mente blindada, corpo forte!",
                      "Sem desculpas hoje, vamos agitar!",
                      "Supere sua versão de ontem.",
                    ].map((sentence) => (
                      <button
                        key={sentence}
                        onClick={() => setWorkoutMotivation(sentence)}
                        className="bg-slate-950 hover:bg-slate-800 text-slate-400 text-[10px] font-medium py-1 px-2 rounded-md border border-slate-850"
                      >
                        {sentence}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Test button row */}
                <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-slate-800/60">
                  <button
                    onClick={() => testTriggerNotif('workout')}
                    id="btn-notif-test-workout"
                    className="flex items-center gap-1 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors active:scale-95 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-red-400" />
                    Enviar Teste Rápido
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* MEAL ALERTS CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl shadow-black/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Apple className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Notificar Refeições</h3>
                  <p className="text-slate-400 text-[10px]">Nutrição cronometrada sem jejuar à toa</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={mealEnabled} 
                  onChange={(e) => setMealEnabled(e.target.checked)}
                  id="switch-notif-meal"
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {mealEnabled && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-col gap-4 overflow-hidden"
              >
                {/* 4 times inputs for basic meals */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Cafezinho da Manhã</label>
                    <input 
                      type="time" 
                      value={mealBreakfast}
                      onChange={(e) => setMealBreakfast(e.target.value)}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white text-xs font-mono font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Almoço Nutritivo</label>
                    <input 
                      type="time" 
                      value={mealLunch}
                      onChange={(e) => setMealLunch(e.target.value)}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white text-xs font-mono font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Lanche da Tarde</label>
                    <input 
                      type="time" 
                      value={mealSnack}
                      onChange={(e) => setMealSnack(e.target.value)}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white text-xs font-mono font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Jantar Reconstrutivo</label>
                    <input 
                      type="time" 
                      value={mealDinner}
                      onChange={(e) => setMealDinner(e.target.value)}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white text-xs font-mono font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-slate-800/60">
                  <button
                    onClick={() => testTriggerNotif('meal')}
                    id="btn-notif-test-meal"
                    className="flex items-center gap-1 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors active:scale-95 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                    Enviar Teste Rápido
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* GENERAL SOUND & ALERT PREFS CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl shadow-black/30">
            <h3 className="text-white font-bold text-sm mb-4 border-b border-slate-800 pb-3">Preferências de Entrega</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-200 text-xs font-bold block">Som do Alarme</span>
                  <span className="text-slate-450 text-[10px]">Tocar som curto ao disparar alertas</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notificationSound} 
                    onChange={(e) => setNotificationSound(e.target.checked)}
                    className="sr-only peer"
                    id="switch-notif-sound"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <span className="text-slate-200 text-xs font-bold block mb-2">Estilo de Apresentação</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'both', label: 'Ambos' },
                    { key: 'system', label: 'Push S.O.' },
                    { key: 'inapp', label: 'No App' }
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setAlertType(item.key as any)}
                      className={`py-2 px-3 rounded-xl text-[10px] tracking-wide uppercase font-black transition-all ${
                        alertType === item.key 
                          ? 'bg-blue-600 text-white border border-blue-500 shadow-md shadow-blue-900/30' 
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* PERSIST SAVE BLOCK BUTTON */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={handleSaveAll}
            id="btn-save-push-settings"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-950/40 border border-blue-500/10 cursor-pointer active:scale-[0.99] transition-all"
          >
            <Save className="w-4 h-4" />
            SALVAR CONFIGURAÇÕES PUSH
          </button>

          <AnimatePresence>
            {saveSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-500/10 border border-emerald-500/20 py-2.5 px-4 rounded-xl text-center flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-xs font-bold font-sans">Evolução programada de alertas gravada!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ACTIVE TIMELINE QUEUE EXHIBITION */}
        <div className="mt-10 bg-slate-900/40 border border-slate-800 rounded-3xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-slate-400 animate-spin" />
            <h4 className="text-slate-200 text-xs font-black tracking-wider uppercase font-mono">Fila Cronológica Próximos Eventos</h4>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { id: '1', hr: waterStartTime, text: 'Disparo de beber água', type: 'water', desc: `${waterMl}ml agendados` },
              { id: '2', hr: mealBreakfast, text: 'Notificação Cafezinho', type: 'meal', desc: 'Sua refeição matinal balanceada' },
              { id: '3', hr: mealLunch, text: 'Notificação Almoço', type: 'meal', desc: 'Acelere o metabolismo na hora certa' },
              { id: '4', hr: workoutTime, text: 'Notificação de Treino do Dia', type: 'workout', desc: workoutMotivation.substring(0, 32) + '...' },
            ].sort((a,b) => a.hr.localeCompare(b.hr)).map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <span className="text-white text-xs font-mono font-black border border-slate-800 bg-slate-900 rounded-md px-2 py-0.5">
                    {item.hr}
                  </span>
                  <div>
                    <p className="text-slate-100 font-bold text-xs">{item.text}</p>
                    <p className="text-slate-500 text-[9px] font-medium">{item.desc}</p>
                  </div>
                </div>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  item.type === 'water' ? 'bg-blue-400' : item.type === 'workout' ? 'bg-red-400' : 'bg-purple-400'
                }`} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
