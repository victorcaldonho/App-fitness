export type ScreenType = 'welcome' | 'home' | 'imc' | 'treinos' | 'dieta' | 'notificacoes' | 'dashboard';
export type ObjectiveType = 'PERDER PESO' | 'GANHAR MASSA' | 'HIPERTROFIA';
export type WorkoutType = 'musculacao' | 'aerobico';

export interface BaseScreenProps {
  onNavigate: (screen: ScreenType) => void;
  objective: ObjectiveType | null;
  setObjective: (obj: ObjectiveType | null) => void;
  workoutType: WorkoutType | null;
  setWorkoutType: (type: WorkoutType | null) => void;
}
