import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatSession, Routine, DietPlan, UserProfile } from '@/types';

const KEYS = {
  SESSIONS: 'fitai_sessions',
  ROUTINES: 'fitai_routines',
  DIETS: 'fitai_diets',
  PROFILE: 'fitai_profile',
};

// ─── Chat Sessions ───────────────────────────────────────
export async function saveChatSession(session: ChatSession): Promise<void> {
  const sessions = await getChatSessions();
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = session;
  } else {
    sessions.unshift(session);
  }
  // Guardar solo las últimas 50 sesiones
  const trimmed = sessions.slice(0, 50);
  await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(trimmed));
}

export async function getChatSessions(): Promise<ChatSession[]> {
  const raw = await AsyncStorage.getItem(KEYS.SESSIONS);
  if (!raw) return [];
  const data = JSON.parse(raw);
  return data.map((s: ChatSession) => ({
    ...s,
    createdAt: new Date(s.createdAt),
    updatedAt: new Date(s.updatedAt),
    messages: s.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
  }));
}

export async function deleteChatSession(id: string): Promise<void> {
  const sessions = await getChatSessions();
  const filtered = sessions.filter((s) => s.id !== id);
  await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(filtered));
}

// ─── Rutinas ─────────────────────────────────────────────
export async function saveRoutine(routine: Routine): Promise<void> {
  const routines = await getRoutines();
  const idx = routines.findIndex((r) => r.id === routine.id);
  if (idx >= 0) {
    routines[idx] = routine;
  } else {
    routines.unshift(routine);
  }
  await AsyncStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines));
}

export async function getRoutines(): Promise<Routine[]> {
  const raw = await AsyncStorage.getItem(KEYS.ROUTINES);
  if (!raw) return [];
  return JSON.parse(raw);
}

export async function deleteRoutine(id: string): Promise<void> {
  const routines = await getRoutines();
  const filtered = routines.filter((r) => r.id !== id);
  await AsyncStorage.setItem(KEYS.ROUTINES, JSON.stringify(filtered));
}

// ─── Dietas ──────────────────────────────────────────────
export async function saveDietPlan(plan: DietPlan): Promise<void> {
  const plans = await getDietPlans();
  const idx = plans.findIndex((p) => p.id === plan.id);
  if (idx >= 0) {
    plans[idx] = plan;
  } else {
    plans.unshift(plan);
  }
  await AsyncStorage.setItem(KEYS.DIETS, JSON.stringify(plans));
}

export async function getDietPlans(): Promise<DietPlan[]> {
  const raw = await AsyncStorage.getItem(KEYS.DIETS);
  if (!raw) return [];
  return JSON.parse(raw);
}

export async function deleteDietPlan(id: string): Promise<void> {
  const plans = await getDietPlans();
  const filtered = plans.filter((p) => p.id !== id);
  await AsyncStorage.setItem(KEYS.DIETS, JSON.stringify(filtered));
}

// ─── Perfil de usuario ───────────────────────────────────
export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export async function getProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(KEYS.PROFILE);
  if (!raw) return null;
  const data = JSON.parse(raw);
  return { ...data, createdAt: new Date(data.createdAt) };
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
