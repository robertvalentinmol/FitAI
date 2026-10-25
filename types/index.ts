// ─── Chat ───────────────────────────────────────────────
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  context: ChatContext;
  createdAt: Date;
  updatedAt: Date;
}

export type ChatContext =
  | { type: 'gym'; muscle: string }
  | { type: 'routine'; goal: string; days: number }
  | { type: 'diet'; dietType: string };

// ─── Entrenamiento ──────────────────────────────────────
export interface Exercise {
  id: string;
  name: string;
  muscle: MuscleGroup;
  equipment: string;
  sets?: number;
  reps?: string;
  rest?: string;
  notes?: string;
}

export type MuscleGroup =
  | 'pecho'
  | 'espalda'
  | 'piernas'
  | 'hombros'
  | 'brazos'
  | 'core'
  | 'cardio';

export interface Routine {
  id: string;
  name: string;
  goal: TrainingGoal;
  days: number;
  schedule: RoutineDay[];
  createdAt: Date;
}

export interface RoutineDay {
  day: number;
  name: string;
  exercises: Exercise[];
}

export type TrainingGoal = 'masa' | 'definicion' | 'fuerza' | 'resistencia';

// ─── Nutrición ──────────────────────────────────────────
export interface DietPlan {
  id: string;
  name: string;
  type: DietType;
  calories: number;
  macros: Macros;
  meals: Meal[];
  createdAt: Date;
}

export type DietType = 'volumen' | 'definicion' | 'mantenimiento' | 'vegetariana';

export interface Macros {
  protein: number;   // gramos
  carbs: number;     // gramos
  fat: number;       // gramos
}

export interface Meal {
  name: string;
  time: string;
  foods: FoodItem[];
  calories: number;
}

export interface FoodItem {
  name: string;
  amount: string;
  calories: number;
  protein?: number;
}

// ─── Usuario ────────────────────────────────────────────
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  weight?: number;
  height?: number;
  age?: number;
  goal?: TrainingGoal;
  activityLevel?: 'sedentario' | 'ligero' | 'moderado' | 'activo' | 'muy_activo';
  createdAt: Date;
}
